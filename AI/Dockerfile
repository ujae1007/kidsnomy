# 1단계: 빌드 환경 (ChromaDB 생성 및 종속성 설치)
FROM kwon0528/b207-fastapi-app:0.0.1
# FROM python:3.10-slim
WORKDIR /app

# requirements.txt 복사 및 종속성 설치
# COPY requirements.txt .
COPY . .
# RUN apt-get update && apt-get install -y --no-install-recommends libmagic1
# RUN pip install --no-cache-dir -r requirements.txt
# RUN pip install torch torchvision torchaudio

# # NLTK 데이터 다운로드
# RUN python -m nltk.downloader averaged_perceptron_tagger_eng -d /nltk_data

# # Vector DB 생성 및 저장
# RUN python rag_func/rag.py --build_db

# 애플리케이션 실행
# CMD ["uvicorn", "server:app", "--port", "8000", "--host", "0.0.0.0", "--reload"]
ENTRYPOINT ["uvicorn", "server:app", "--port", "8000", "--host", "0.0.0.0", "--reload"]
