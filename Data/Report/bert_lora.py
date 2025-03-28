import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from peft import get_peft_model, LoraConfig, TaskType
from datasets import Dataset
from sklearn.model_selection import train_test_split
import json
import pandas as pd

# 카테고리 목록과 매핑
categories = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구점', '미용', '문화', '도서', '생활', '교통']
eng_categories = ['edu', 'health', 'hobby', 'eat', 'cafe', 'shopping', 'stationary', 'beauty', 'culture', 'book', 'life', 'transportation']
category_to_id = {cat: i for i, cat in enumerate(categories)}

# 학습 데이터로 바꾸기
def preprocess_data():
    # 최종 학습 데이터를 저장할 리스트
    all_data = []

    # eng_categories 리스트

    # 각 카테고리별로 데이터 불러오기
    # for eng_cate in eng_categories:
    #     with open(f"./preprocessed/preprocess_data_{eng_cate}.json", "r", encoding="utf-8") as f:
    #         data = json.load(f)
    with open(f"./preprocessed/A_final_total_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        # 데이터 전처리: 각 항목에 대해 카테고리 번호와 텍스트를 추출
        for item in data:
            category_name = item.get("category_name", "")  # 텍스트 내용
            # place_name = item.get("place_name", "")
            label = category_to_id.get(item.get("label", ""), -1)  # 해당 카테고리의 숫자 라벨 (없으면 -1)
            all_data.append({"category_name": category_name, "label": label})

    # 결과 확인
    return all_data

# 전처리된 학습 데이터를 얻기
data = preprocess_data()

# JSON 형식으로 저장
with open("processed_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Data has been saved as processed_data.json.")

texts = [item['category_name'] for item in data]
labels = [item['label'] for item in data]  # 'label'로 수정

# train, validation 데이터로 분할
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels, test_size=0.2, random_state=42)

# 결과 확인
print(f"Train texts: {len(train_texts)}")
print(f"Validation texts: {len(val_texts)}")

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

# 모델 불러오기 (LoRA 적용)
base_model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=len(categories))

lora_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    inference_mode=False,
    r=8,  # LoRA 랭크
    lora_alpha=32,
    lora_dropout=0.2
)

model = get_peft_model(base_model, lora_config)

# 모델 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)

# 학습 설정
training_args = TrainingArguments(
    output_dir="./kobert_lora_category",
    eval_strategy="steps",
    eval_steps=500,
    save_strategy="steps",
    save_steps=500,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=10,
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
'''
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments, DataCollatorWithPadding
from peft import get_peft_model, LoraConfig, TaskType
from datasets import Dataset
from sklearn.model_selection import train_test_split
import json

# 카테고리 목록과 매핑
categories = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구점', '미용', '문화', '도서', '생활', '교통']
category_to_id = {cat: i for i, cat in enumerate(categories)}

# 데이터 불러오기
with open("./preprocessed/A_final_total_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 데이터 전처리 (잘못된 라벨 제거)
filtered_data = [{"category_name": item["category_name"], "label": category_to_id[item["label"]]}
                 for item in data if item["label"] in category_to_id]

texts = [item['category_name'] for item in filtered_data]
labels = [item['label'] for item in filtered_data]

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

# 데이터셋 변환 (🚨 labels를 int로 변환 필수)
train_dataset = Dataset.from_dict({
    "input_ids": train_encodings["input_ids"],
    "attention_mask": train_encodings["attention_mask"],
    "labels": list(map(int, train_labels))
})

val_dataset = Dataset.from_dict({
    "input_ids": val_encodings["input_ids"],
    "attention_mask": val_encodings["attention_mask"],
    "labels": list(map(int, val_labels))
})

# 모델 불러오기 (LoRA 적용)
base_model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=len(categories))

# BERT 가중치 고정
for param in base_model.parameters():
    param.requires_grad = False

# LoRA 설정
lora_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    inference_mode=False,
    r=8,
    lora_alpha=32,
    lora_dropout=0.2
)

model = get_peft_model(base_model, lora_config)

# LoRA 가중치만 학습
for name, param in model.named_parameters():
    param.requires_grad = "lora" in name

# 모델 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 학습 가능한 파라미터 확인 (🚨 LoRA만 학습해야 정상)
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
total_params = sum(p.numel() for p in model.parameters())
print(f"Trainable parameters: {trainable_params} / {total_params}")

# 학습 설정
training_args = TrainingArguments(
    output_dir="./kobert_lora_category",
    eval_strategy="steps",
    eval_steps=500,
    save_strategy="steps",
    save_steps=500,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=10,
    learning_rate=2e-5,
    logging_dir="./logs",
    logging_steps=50,
    optim="adamw_torch"
)

# 데이터 로더 추가 (🚨 HuggingFace Trainer에 맞게 설정)
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Trainer 설정
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    data_collator=data_collator
)

# 모델 학습
trainer.train()
'''