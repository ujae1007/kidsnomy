import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
from sklearn.model_selection import train_test_split
import json

# 카테고리 목록과 매핑
categories = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구', '미용', '문화', '도서', '생활', '교통']
category_to_id = {cat: i for i, cat in enumerate(categories)}

# 학습 데이터로 바꾸기
def preprocess_data():
    all_data = []

    with open(f"./preprocessed/D_A_final_total_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        # 데이터 전처리: 각 항목에 대해 카테고리 번호와 텍스트를 추출
        for item in data:
            category_name = item.get("category_name", "")  # 텍스트 내용
            label = category_to_id.get(item.get("label", ""))  # 해당 카테고리의 숫자 라벨 (없으면 -1)
            all_data.append({"category_name": category_name, "label": label})

    return all_data

# 전처리된 학습 데이터
data = preprocess_data()

# JSON 형식으로 저장
with open("processed_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

texts = [item['category_name'] for item in data]
labels = [item['label'] for item in data]

# train, validation 데이터로 분할
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels, test_size=0.2, random_state=42)

# 토크나이저 로드
model_name = "skt/kobert-base-v1"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 토큰화 함수
def tokenize_function(texts):
    return tokenizer(texts, padding="max_length", truncation=True, max_length=64)

# 토큰화 적용
train_encodings = tokenize_function(train_texts)
val_encodings = tokenize_function(val_texts)

# 데이터셋 변환
train_dataset = Dataset.from_dict({"input_ids": train_encodings["input_ids"], "attention_mask": train_encodings["attention_mask"], "labels": train_labels})
val_dataset = Dataset.from_dict({"input_ids": val_encodings["input_ids"], "attention_mask": val_encodings["attention_mask"], "labels": val_labels})

# BERT 모델 불러오기
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=len(categories))

# 모델 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

from sklearn.metrics import accuracy_score
from transformers import Trainer, TrainingArguments

# 정확도 계산 함수
def compute_metrics(p):
    predictions, labels = p
    preds = predictions.argmax(axis=-1)  # 가장 큰 확률을 가진 인덱스를 선택
    accuracy = accuracy_score(labels, preds)
    return {"accuracy": accuracy}

# 학습 설정
training_args = TrainingArguments(
    output_dir="./kobert_category",
    eval_strategy="steps",          # 평가 주기 설정 (매 500 스텝마다 평가)
    eval_steps=500,                 # 평가 주기 (스텝 단위)
    save_strategy="steps",         # 모델 저장 주기 설정
    save_steps=500,                # 모델 저장 주기 (500 스텝마다 저장)
    per_device_train_batch_size=16, # 학습 배치 크기
    per_device_eval_batch_size=16,  # 평가 배치 크기
    num_train_epochs=2,            # 학습할 epoch 수
    learning_rate=2e-5,            # 학습률
    logging_dir="./logs",          # 로그 디렉토리
    logging_steps=50,              # 로그 출력 주기 (50 스텝마다 출력)
    load_best_model_at_end=True,   # 학습 종료 후 가장 좋은 모델 로드
    metric_for_best_model="accuracy"  # 가장 좋은 모델을 평가할 기준 (정확도)
)

# Trainer 설정
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics  # 평가 항목 추가
)

# 모델 학습
trainer.train()

trainer.save_model("./kobert_category_v2")  # 모델 저장

# 토크나이저 저장
tokenizer.save_pretrained("./kobert_category_v2")

# 모델 평가
results = trainer.evaluate()
print(results)  # 평가 결과 출력
