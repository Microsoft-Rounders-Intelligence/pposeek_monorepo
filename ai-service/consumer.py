import os
import json
import logging
import sys
import re
import requests # PDF 다운로드를 위해 추가
import fitz  # PyMuPDF
from openai import AzureOpenAI
from dotenv import load_dotenv
from typing import Tuple
from kafka import KafkaConsumer, KafkaProducer
from azure.storage.blob import BlobServiceClient # Blob 다운로드를 위해 추가
from kafka.errors import NoBrokersAvailable # 에러 처리를 위해 추가
from pythonjsonlogger import jsonlogger

# --- .env 파일 로드 ---
load_dotenv()

# --- 1. 로깅 설정 ---
log_file_path = "/var/log/app/python_server.log"

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

if logger.hasHandlers():
    logger.handlers.clear()

logHandler = logging.FileHandler(log_file_path)
formatter = jsonlogger.JsonFormatter(
    '%(asctime)s %(name)s %(levelname)s %(message)s'
)
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
# --------------------

# --- 2. GPT 클라이언트 설정 ---
try:
    client = AzureOpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        azure_endpoint=os.getenv("OPENAI_ENDPOINT"),
        api_version="2024-02-15-preview"
    )
    logger.info("Azure OpenAI client initialized successfully.")
    # ⭐ [핵심 수정] Azure Blob Storage 클라이언트
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_BLOB_CONN_STRING"))
    AZURE_CONTAINER = os.getenv("AZURE_BLOB_CONTAINER")
    logger.info("Azure Blob Storage client initialized successfully.")
except Exception as e:
    logger.error("Failed to initialize Azure OpenAI client", exc_info=True)
    sys.exit(1)
# -------------------------

# --- 3. Kafka 설정 ---
KAFKA_BROKER_URL = 'kafka:9092'
REQUEST_TOPIC = 'resume_analysis_request'
FEEDBACK_TOPIC = 'analysis_feedback_topic'
NOTIFICATION_TOPIC = 'notification_topic'
# -------------------

# --- 4. 핵심 분석 함수들 ---

def extract_text_from_pdf_stream(pdf_stream) -> str:
    """PDF 파일 스트림에서 텍스트를 추출합니다."""
    try:
        doc = fitz.open(stream=pdf_stream, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc])
        doc.close()
        return text
    except Exception as e:
        logger.error("Failed to extract text from PDF stream", exc_info=True)
        raise

def evaluate_resume(text: str) -> str:
    """GPT를 사용해 이력서를 평가합니다."""
    prompt = f"""
다음은 한 사람의 이력서입니다:

{text}

이 이력서를 분석하여 다음 정보를 한국어로 작성해 주세요. 각 항목에 대해 **왜 그렇게 판단했는지** 반드시 포함해 주세요.

1. 강점
2. 약점
3. 개선점
"""
    try:
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_DEPLOYMENT"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error("Failed to evaluate resume with OpenAI", exc_info=True)
        raise

def parse_resume_sections(report: str) -> Tuple[str, str, str]:
    """GPT 이력서 평가 리포트에서 강점, 약점, 개선점을 파싱합니다."""
    try:
        strength_match = re.search(r"1\.\s*강점\s*[:\-\n]?(.*?)(?=\n\s*2\.|\Z)", report, re.DOTALL)
        weakness_match = re.search(r"2\.\s*약점\s*[:\-\n]?(.*?)(?=\n\s*3\.|\Z)", report, re.DOTALL)
        improvement_match = re.search(r"3\.\s*개선점\s*[:\-\n]?(.*?)(?=\n\s*4\.|\Z)", report, re.DOTALL)

        strength = strength_match.group(1).strip() if strength_match else "분석 결과를 파싱할 수 없습니다."
        weakness = weakness_match.group(1).strip() if weakness_match else "분석 결과를 파싱할 수 없습니다."
        improvement = improvement_match.group(1).strip() if improvement_match else "분석 결과를 파싱할 수 없습니다."

        return strength, weakness, improvement
    except Exception as e:
        logger.error("Failed to parse AI report", exc_info=True, extra={'report_text': report})
        # 파싱 실패 시 기본값 반환
        return "분석 오류", "분석 오류", "분석 오류"

def process_resume_analysis(file_url: str, user_id: str) -> Tuple[str, str, str]:
    """전체 이력서 분석 프로세스를 실행합니다."""
    logger.info(f"Starting resume analysis for user: {user_id}", extra={'file_url': file_url})

    # ⭐ [핵심 수정] 1. URL에서 파일 이름만 추출하여 Blob Storage에서 안전하게 다운로드
    blob_name = os.path.basename(file_url)
    blob_client = blob_service_client.get_blob_client(container=AZURE_CONTAINER, blob=blob_name)
    
    downloader = blob_client.download_blob()
    pdf_content = downloader.readall()
    logger.info(f"Successfully downloaded PDF from Blob Storage for user: {user_id}", extra={'file_size': len(pdf_content)})

    # 2. PDF에서 텍스트 추출
    resume_text = extract_text_from_pdf_stream(pdf_content)
    logger.info(f"Successfully extracted text from PDF for user: {user_id}", extra={'text_length': len(resume_text)})

    # 3. GPT로 이력서 평가
    ai_report = evaluate_resume(resume_text)
    logger.info(f"Successfully received AI evaluation for user: {user_id}")

    # 4. 평가 결과 파싱
    strengths, weaknesses, suggestions = parse_resume_sections(ai_report)
    logger.info(f"Successfully parsed AI report for user: {user_id}")

    return strengths, weaknesses, suggestions

# --- 5. Kafka 컨슈머 및 프로듀서 실행 ---

logger.info("AI Service Script Started. Waiting for messages...")
print("AI Service Script Started. Waiting for messages...")

consumer = None
producer = None
try:
    logger.info("Connecting to Kafka...", extra={'kafka_broker': KAFKA_BROKER_URL})
    consumer = KafkaConsumer(
        REQUEST_TOPIC,
        bootstrap_servers=KAFKA_BROKER_URL,
        value_deserializer=lambda x: json.loads(x.decode('utf-8')),
        auto_offset_reset='earliest',
        
    )
    logger.info("Kafka Consumer initialized successfully.")

    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BROKER_URL,
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )
    logger.info("Kafka Producer initialized successfully.")

except Exception as e:
    logger.error("KAFKA CONNECTION ERROR", exc_info=True)
    sys.exit(1)


logger.info("Starting to listen for messages...")

for message in consumer:
    try:
        request_data = message.value
        logger.info("Received request", extra={'request_data': request_data})

        user_id = str(request_data.get('userId'))
        file_url = request_data.get('fileUrl')

        if not user_id or not file_url:
            logger.warning("Invalid message received (missing userId or fileUrl)", extra={'payload': request_data})
            continue

        # 핵심 분석 로직 호출
        strengths, weaknesses, suggestions = process_resume_analysis(file_url, user_id)

        # Kafka로 피드백 전송
        feedback_payload = {
            'userId': user_id,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'suggestions': suggestions,
            'status': 'completed'
        }
        producer.send(FEEDBACK_TOPIC, value=feedback_payload)
        logger.info("Sent feedback", extra={'payload': feedback_payload})

        # Kafka로 알림 전송
        notification_payload = {
            'userId': user_id,
            'message': '이력서 AI 분석이 완료되었습니다. 지금 확인해보세요!'
        }
        producer.send(NOTIFICATION_TOPIC, value=notification_payload)
        logger.info("Sent notification", extra={'payload': notification_payload})
        
        producer.flush()
        logger.info("Producer flushed for user: " + user_id)

    except Exception as e:
        logger.error("ERROR during message processing", exc_info=True, extra={'failed_message': message.value if message else 'N/A'})

logger.info("Script finished or consumer timed out.")

