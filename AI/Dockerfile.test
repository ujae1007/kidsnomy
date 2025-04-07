# 1단계: 빌드 환경 (ChromaDB 생성 및 종속성 설치)
FROM python:3.11-slim AS builder
WORKDIR /build

# requirements.txt 복사 및 종속성 설치
COPY requirements.txt .
RUN apt-get update && apt-get install -y libmagic-dev --no-install-recommends
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install torch torchvision torchaudio

# 애플리케이션 코드 복사
COPY . .

# NLTK 데이터 다운로드
RUN python -m nltk.downloader averaged_perceptron_tagger_eng -d /nltk_data

# ChromaDB 생성 및 저장
RUN python /build/rag_func/rag.py --build_db

# 2단계: 최종 이미지 (실행 환경)
FROM python:3.11-slim
WORKDIR /app

# 필요한 시스템 라이브러리 설치
RUN apt-get update && apt-get install -y --no-install-recommends libmagic1

# requirements.txt 복사 및 종속성 설치 (최종 이미지에서)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# NLTK 데이터 복사
COPY --from=builder /nltk_data /nltk_data
ENV NLTK_DATA=/nltk_data

# 애플리케이션 코드 복사 (빌드 결과 포함)
COPY --from=builder /build .

# 애플리케이션 실행
CMD ["uvicorn", "server:app", "--port", "8000", "--reload"]