import json
import time
from kafka import KafkaConsumer, KafkaProducer

KAFKA_BROKER_URL = 'kafka:9092'
REQUEST_TOPIC = 'resume_analysis_request'
FEEDBACK_TOPIC = 'analysis_feedback_topic'
NOTIFICATION_TOPIC = 'notification_topic'

print("AI Service - Kafka Consumer starting...")

consumer = KafkaConsumer(
    REQUEST_TOPIC,
    bootstrap_servers=KAFKA_BROKER_URL,
    value_deserializer=lambda x: json.loads(x.decode('utf-8')),
    auto_offset_reset='earliest'
)

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER_URL,
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

# AI 이력서 분석 로직을 수행하는 함수 s3에서 파일 받아와서 분석모델 호출하면댐.
def analyze_resume(file_url):

    print(f"Analyzing resume from: {file_url}")

    # 분석 결과 생성 (예시)
    strengths = "프로젝트 경험을 수치적으로 표현한 점이 좋습니다."
    weaknesses = "지원하는 직무와의 연관성을 더 강조할 필요가 있습니다."

    print("Analysis complete.")
    return strengths, weaknesses

for message in consumer:
    request_data = message.value
    print(f"Received request: {request_data}")

    user_id = request_data.get('userId')
    file_url = request_data.get('fileUrl')

    # AI 이력서 분석 수행 위 함수토대로.
    strengths, weaknesses = analyze_resume(file_url)

    # 1. 상세 피드백 결과 전송
    feedback_payload = {
        'userId': user_id,
        'strengths': strengths,
        'weaknesses': weaknesses,
        'status': 'completed'
    }
    producer.send(FEEDBACK_TOPIC, value=feedback_payload)
    print(f"Sent feedback: {feedback_payload}")

    # 2. 간단한 알림 메시지 전송
    notification_payload = {
        'userId': user_id,
        'message': '이력서 AI 분석이 완료되었습니다. 지금 확인해보세요!'
    }
    producer.send(NOTIFICATION_TOPIC, value=notification_payload)
    print(f"Sent notification: {notification_payload}")