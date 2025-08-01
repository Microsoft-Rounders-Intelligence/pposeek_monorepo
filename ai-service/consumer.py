
import json
import time
from kafka import KafkaConsumer, KafkaProducer
import sys

KAFKA_BROKER_URL = 'kafka:9092'
REQUEST_TOPIC = 'resume_analysis_request'
FEEDBACK_TOPIC = 'analysis_feedback_topic'
NOTIFICATION_TOPIC = 'notification_topic'

print("--- AI Service Script Started. Waiting for messages... ---")
# 버퍼를 강제로 비워 로그를 즉시 출력합니다. (핵심 코드)
sys.stdout.flush()


consumer = None
producer = None
try:
    print("🔄 Connecting to Kafka...")
    consumer = KafkaConsumer(
        REQUEST_TOPIC,
        bootstrap_servers=KAFKA_BROKER_URL,
        value_deserializer=lambda x: json.loads(x.decode('utf-8')),
        auto_offset_reset='earliest'
    )

    print("--- Kafka Consumer initialized successfully. ---", consumer)

    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BROKER_URL,
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )

    print("--- Kafka Producer initialized successfully. ---", producer)

except Exception as e:
    print(f"!!! KAFKA CONNECTION ERROR: {e}")
    sys.stdout.flush()
    sys.exit(1)  # 연결 실패 시 프로그램 종료

def analyze_resume(file_url):
    print(f"-> Analyzing resume from: {file_url}")
    
    
    sys.stdout.flush()
    
    time.sleep(10) # AI 분석 시뮬레이션
    
    strengths = "프로젝트 경험을 수치적으로 표현한 점이 좋습니다."
    weaknesses = "지원하는 직무와의 연관성을 더 강조할 필요가 있습니다."
    
    print("-> Analysis complete.")
    sys.stdout.flush()
    return strengths, weaknesses


print("🎧 Starting to listen for messages...")
sys.stdout.flush()

for message in consumer:
    try:
        request_data = message.value
        print(f"Received request: {request_data}")
        sys.stdout.flush()

        user_id = request_data.get('userId')
        print(type(user_id))
        user_id = str(user_id)  # Ensure user_id is a string
        print(type(user_id))
        file_url = request_data.get('fileUrl')

        print(f"Processing resume for user: {user_id}, file URL: {file_url}")


        strengths, weaknesses = analyze_resume(file_url)

        feedback_payload = {
            'userId': user_id,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'status': 'completed'
        }
        producer.send(FEEDBACK_TOPIC, value=feedback_payload)
        print(f"Sent feedback: {feedback_payload}")
        sys.stdout.flush()

        notification_payload = {
            'userId': user_id,
            'message': '이력서 AI 분석이 완료되었습니다. 지금 확인해보세요!'
        }
        producer.send(NOTIFICATION_TOPIC, value=notification_payload)
        print(f"Sent notification: {notification_payload}")
        sys.stdout.flush()
        
        # 메시지를 즉시 전송하도록 강제
        producer.flush()
        print("--- Producer flushed. Message sent successfully. ---")
        sys.stdout.flush()

    except Exception as e:
        print(f"!!! ERROR during message processing: {e}")
        sys.stdout.flush()


    