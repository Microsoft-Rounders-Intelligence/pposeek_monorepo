import json
import logging
import sys
from kafka import KafkaConsumer, KafkaProducer
from pythonjsonlogger import jsonlogger

# --- 1. 로깅 설정 ---
log_file_path = "/var/log/app/python_server.log"

# 로거 인스턴스 생성
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# 기존 핸들러 제거 (중복 로깅 방지)
if logger.hasHandlers():
    logger.handlers.clear()

# 파일 핸들러 설정
logHandler = logging.FileHandler(log_file_path)

# JSON 포맷터 설정: 로그를 JSON 형식으로 만들어줍니다.
formatter = jsonlogger.JsonFormatter(
    '%(asctime)s %(name)s %(levelname)s %(message)s'
)
logHandler.setFormatter(formatter)

# 핸들러를 로거에 추가
logger.addHandler(logHandler)
# --------------------

KAFKA_BROKER_URL = 'kafka:9092'
REQUEST_TOPIC = 'resume_analysis_request'
FEEDBACK_TOPIC = 'analysis_feedback_topic'
NOTIFICATION_TOPIC = 'notification_topic'

logger.info("AI Service Script Started. Waiting for messages...")

consumer = None
producer = None
try:
    logger.info("Connecting to Kafka...", extra={'kafka_broker': KAFKA_BROKER_URL})
    consumer = KafkaConsumer(
        REQUEST_TOPIC,
        bootstrap_servers=KAFKA_BROKER_URL,
        value_deserializer=lambda x: json.loads(x.decode('utf-8')),
        auto_offset_reset='earliest'
    )
    logger.info("Kafka Consumer initialized successfully.")

    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BROKER_URL,
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )
    logger.info("Kafka Producer initialized successfully.")

except Exception as e:
    # 에러 로그는 logger.error를 사용하고, 에러 정보도 함께 기록합니다.
    logger.error("KAFKA CONNECTION ERROR", exc_info=True)
    sys.exit(1)

def analyze_resume(file_url, user_id):
    logger.info(f"Analyzing resume for user: {user_id}", extra={'file_url': file_url})
    
    # AI 분석 로직 (시뮬레이션)
    strengths = "프로젝트 경험을 수치적으로 표현한 점이 좋습니다."
    weaknesses = "지원하는 직무와의 연관성을 더 강조할 필요가 있습니다."
    
    logger.info(f"Analysis complete for user: {user_id}")
    return strengths, weaknesses

logger.info("Starting to listen for messages...")

for message in consumer:
    try:
        request_data = message.value
        # extra 인자를 사용하면 구조화된 데이터를 로그에 쉽게 추가할 수 있습니다.
        logger.info("Received request", extra={'request_data': request_data})

        user_id = str(request_data.get('userId'))
        file_url = request_data.get('fileUrl')

        logger.info(f"Processing resume for user: {user_id}", extra={'file_url': file_url})

        strengths, weaknesses = analyze_resume(file_url, user_id)

        feedback_payload = {
            'userId': user_id,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'status': 'completed'
        }
        producer.send(FEEDBACK_TOPIC, value=feedback_payload)
        logger.info("Sent feedback", extra={'payload': feedback_payload})

        notification_payload = {
            'userId': user_id,
            'message': '이력서 AI 분석이 완료되었습니다. 지금 확인해보세요!'
        }
        producer.send(NOTIFICATION_TOPIC, value=notification_payload)
        logger.info("Sent notification", extra={'payload': notification_payload})
        
        # 메시지를 즉시 전송하도록 강제
        producer.flush()
        logger.info("Producer flushed. Messages sent successfully.")

    except Exception as e:
        logger.error("ERROR during message processing", exc_info=True, extra={'failed_message': message.value})