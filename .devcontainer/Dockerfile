# 기본 Node.js 개발 컨테이너 이미지 사용
FROM mcr.microsoft.com/devcontainers/typescript-node:22

# 추가 패키지 설치 (필요시)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Wrangler CLI 전역 설치 (Cloudflare Workers 사용시)
RUN npm install -g wrangler

# 작업 디렉토리 설정
WORKDIR /workspaces/image-api-playground
