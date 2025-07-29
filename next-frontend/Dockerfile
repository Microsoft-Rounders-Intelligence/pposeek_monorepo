# next-frontend/Dockerfile (최종 수정본)

# 1. Builder Stage
FROM node:20-alpine AS builder
# pnpm 설치
RUN npm install -g pnpm
WORKDIR /app
# 의존성 파일 복사
COPY package.json pnpm-lock.yaml* ./
# 'postinstall' 스크립트 없이 의존성만 설치
RUN pnpm install --ignore-scripts
# 나머지 소스코드 복사
COPY . .
# 소스코드 복사 후 빌드 실행
RUN pnpm run build

# 2. Runner Stage
FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
# 빌드 결과물 및 필요한 파일만 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]