# spring-backend/Dockerfile (수정 완료된 버전)

# 1. Builder Stage
FROM gradle:jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar

# 2. Runner Stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]