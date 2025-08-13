# 🤖 뽀식이 - AI 기반 채용 플랫폼

## *우리 모두 취업 뽀셔버리자 !*
<img width="1435" height="809" alt="Image" src="https://github.com/user-attachments/assets/c18f78c6-be77-499e-89ef-259fad7b4da3" />

뽀식이는 AI 기술을 활용하여 구직자에게는 맞춤형 채용 공고를 추천하고, 기업에게는 적합한 인재를 연결해주는 지능형 채용 플랫폼입니다.

이 프로젝트는 Spring Boot 백엔드와 Next.js 프론트엔드로 구성된 **모노레포(Monorepo)** 구조를 가지며, **Docker**를 통해 전체 서비스를 손쉽게 관리하고 실행할 수 있습니다.

---

## 🛠️ 주요 기술 스택

### **Backend**
* Java 21
* Spring Boot 3
* Spring Security & JWT (JSON Web Token)
* MyBatis
* Gradle
* Kafka(KRaft)
* Flask 

### **Frontend**
* Next.js
* React & TypeScript
* pnpm (Package Manager)
* Tailwind CSS
* shadcn/ui

### **DevOps**
* Docker & Docker Compose
* Nginx (Reverse Proxy)
* Github actions

### **Monitoring** 
* Grafana/Prometheus
* ELK Stack

### **Cloud** 
* Azure Container Registry 
* Azure Container Apps 
* Azure event hubs 
* Azure OpenAI 
* Azure DNS 
* Azure Key Vault 
* Azure monitor 
* Azure Storage Account 
* Azure API GATEWAY

### **Network** 
* VPN(tailscale)

### **DataBase** 
* MySQL
* FAISS (Vector)



### **Collaborative Software 
* Confluence 
* Microsoft Teams 
---

## ✅ Prerequisites

이 프로젝트를 실행하기 위해서는 컴퓨터에 아래의 소프트웨어가 반드시 설치되어 있어야 합니다.

* [**Docker Desktop**](https://www.docker.com/products/docker-desktop/)

---

## 🚀 시작하기

**1. 프로젝트 클론**
```bash
git clone https://github.com/Microsoft-Rounders-Intelligence/pposeek_monorepo.git
cd pposeek_monorepo
```
**2. Docker Compose로 전체 서비스 실행**
```bash
docker compose up --build
```

**3. 어플리케이션 접속** 
```bash
URL: http://localhost:3000
```

## 📂 프로젝트 구조
```bash
.
├── next-frontend/      # Next.js 프론트엔드 애플리케이션
    └── Dockerfile
├── spring-backend/     # Spring Boot 백엔드 API 서버
    └── Dockerfile
├── docker-compose.yml  # 전체 서비스 실행을 위한 Docker Compose 설정 파일
├── .github             # Azure 배포 자동화 파이프라인 구성 
    └── workflows
        └── deploy.yml  
├── .env                # 환경설정파일 
├── logs                # 각 서비스별 로그 파일
    └── ai-service 
    └── kafka
    └── nextjs
    └── nginx
    └── spring-boot
├── README.md           # 리드미 
├── ai-service          # ai 서빙하는 서버(추가예정)
    └── Dockerfile
└── infra               # 인프라 통합 파일
    └── elk             # ELK STACK 
        └── filebeat 
        └── logstash 
    └── monitoring      # Grafana/Prometheus
        └── grafana
        └── prometheus
    └── nginx           # Nginx 리버스 프록시 설정 + infra(devops)
        └── Dockerfile 


```

## 📂 발표 자료
[최종_발표자료.pptx](https://github.com/user-attachments/files/21747122/_MSAI_Team2_Rounders_PPO-Seek_0812_.pptx)