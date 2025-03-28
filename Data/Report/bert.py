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

    with open(f"./preprocessed/A_final_total_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        # 데이터 전처리: 각 항목에 대해 카테고리 번호와 텍스트를 추출
        for item in data:
            category_name = item.get("category_name", "")  # 텍스트 내용
            label = category_to_id.get(item.get("label", ""))  # 해당 카테고리의 숫자 라벨 (없으면 -1)
            all_data.append({"category_name": category_name, "label": label})

    return all_data

# 전처리된 학습 데이터를 얻기
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

# 학습 설정
training_args = TrainingArguments(
    output_dir="./kobert_category",
    eval_strategy="steps",
    eval_steps=500,
    save_strategy="steps",
    save_steps=500,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=5,
    learning_rate=2e-5,
    logging_dir="./logs",
    logging_steps=50
)

# Trainer 설정
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

# 모델 학습
trainer.train()
