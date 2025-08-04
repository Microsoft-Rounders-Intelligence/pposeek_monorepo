#!/bin/bash

# 뽀식이 모니터링 설정 스크립트
echo "🚀 뽀식이 모니터링 시스템 설정을 시작합니다..."

# 모니터링 디렉터리 구조 생성
echo "📁 디렉터리 구조 생성 중..."
mkdir -p infra/monitoring/prometheus/rules
mkdir -p infra/monitoring/grafana/provisioning/datasources
mkdir -p infra/monitoring/grafana/provisioning/dashboards
mkdir -p infra/monitoring/grafana/dashboards

# 권한 설정 (Grafana를 위해)
echo "🔐 권한 설정 중..."
sudo chown -R 472:472 infra/monitoring/grafana/ 2>/dev/null || echo "권한 설정 건너뜀 (sudo 권한 없음)"

# 설정 파일들이 올바른 위치에 있는지 확인
echo "✅ 설정 파일 확인 중..."

# Prometheus 설정
if [ ! -f "infra/monitoring/prometheus/prometheus.yml" ]; then
    echo "❌ prometheus.yml 파일이 없습니다. 생성해주세요."
else
    echo "✅ prometheus.yml 확인됨"
fi

# Grafana 데이터소스 설정
if [ ! -f "infra/monitoring/grafana/provisioning/datasources/prometheus.yml" ]; then
    echo "❌ Grafana 데이터소스 설정이 없습니다."
else
    echo "✅ Grafana 데이터소스 설정 확인됨"
fi

# Grafana 대시보드 설정
if [ ! -f "infra/monitoring/grafana/provisioning/dashboards/dashboard.yml" ]; then
    echo "❌ Grafana 대시보드 프로바이더 설정이 없습니다."
else
    echo "✅ Grafana 대시보드 프로바이더 설정 확인됨"
fi

# Spring Boot 대시보드
if [ ! -f "infra/monitoring/grafana/dashboards/spring-boot-dashboard.json" ]; then
    echo "❌ Spring Boot 대시보드가 없습니다."
else
    echo "✅ Spring Boot 대시보드 확인됨"
fi

# Prometheus 알람 규칙
if [ ! -f "infra/monitoring/prometheus/rules/application.yml" ]; then
    echo "❌ Prometheus 알람 규칙이 없습니다."
else
    echo "✅ Prometheus 알람 규칙 확인됨"
fi

echo ""
echo "🎯 모니터링 시스템 실행 방법:"
echo "1. 전체 서비스 실행: docker compose up -d"
echo "2. 모니터링만 실행: docker compose up -d prometheus grafana node-exporter cadvisor"
echo ""
echo "📊 접속 URL:"
echo "- Grafana: http://localhost:3001 (admin/admin123)"
echo "- Prometheus: http://localhost:9090"
echo "- Spring Boot Actuator: http://localhost:8080/actuator"
echo "- cAdvisor: http://localhost:8081"
echo "- Node Exporter: http://localhost:9100/metrics"
echo ""
echo "🔍 모니터링 포인트:"
echo "- HTTP 요청/응답 시간"
echo "- JVM 메모리 사용량"
echo "- CPU 사용률"
echo "- 시스템 리소스"
echo "- 컨테이너 메트릭"
echo ""
echo "✅ 모니터링 설정 완료!"