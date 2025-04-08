# ---- Builder Stage ----
# 빌드에 필요한 모든 의존성 설치 및 빌드 실행
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# 개발 의존성 포함하여 모든 의존성 설치
RUN npm ci
COPY . .
# 빌드 스크립트 실행 (package.json에 정의된 'build' 스크립트 가정)
RUN npm run build

# ---- Runtime Stage ----
# Nginx 이미지를 기반으로 최종 이미지 생성
FROM nginx:stable-alpine

# 위에서 작성한 Nginx 설정 파일을 복사
# 파일 이름이 nginx.conf 이고 Dockerfile과 같은 경로에 있다고 가정
COPY app.conf /etc/nginx/conf.d/default.conf

# Nginx 기본 HTML 파일 제거 (선택사항)
RUN rm -rf /usr/share/nginx/html/*

# Builder 스테이지에서 빌드된 결과물('dist' 폴더 내용)을 Nginx의 root 디렉토리로 복사
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# CMD ["tail", "-f", "/dev/null"]