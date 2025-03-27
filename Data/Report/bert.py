import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from peft import get_peft_model, LoraConfig, TaskType
from datasets import Dataset
from sklearn.model_selection import train_test_split

categories = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구점', '미용', '문화', '도서', '생활', '교통']
category_to_id = {cat: i for i, cat in enumerate(categories)}

import json

# 데이터
with open("formatted_lora_data.json", "r", encoding="utf-8") as f:
  data = json.load(f)

# 데이터 프레임 변환
texts = [item['text'] for item in data]
labels = [item['label'] for item in data]
labels = [category_to_id[label] for label in labels]

# 데이터 분할
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
    lora_dropout=0.1
)

model = get_peft_model(base_model, lora_config)

# 모델 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)

# 학습 설정
training_args = TrainingArguments(
    output_dir="./kobert_lora_category",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=5,
    logging_dir="./logs",
    logging_steps=10
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
def predict(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=64)
    inputs['token_type_ids'] = torch.zeros_like(inputs['input_ids'])
    inputs = {key: value.to("cuda") for key, value in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=-1).item()
    return categories[predicted_class]


# 예제 테스트
print(predict("사진,사진관,포토스튜디오,즉석사진,인생네컷"))  # 취미
print(predict("도서,서점,교보문고"))  # 도서
'''
# 모델 저장
model.save_pretrained("./kobert_lora_category")
tokenizer.save_pretrained("./kobert_lora_category")

from transformers import pipeline

def classify_words(words, candidate_labels):
    """
    주어진 단어들을 특정 카테고리로 분류하는 함수입니다.

    Args:
        words (list): 분류할 단어 리스트입니다.
        candidate_labels (list): 분류할 카테고리 리스트입니다.

    Returns:
        dict: 각 단어별 분류 결과 (카테고리, 점수)를 담은 딕셔너리입니다.
    """

    classifier = pipeline("text-classification", model="./kobert_lora_category", tokenizer="./kobert_lora_category")

    results = {}
    for word in words:
        result = classifier(word, candidate_labels=candidate_labels)
        results[word] = {
            "category": result[0]["label"],  # 'label'을 첫 번째 결과에서 가져옴
            "score": result[0]["score"]  # 'score'를 첫 번째 결과에서 가져옴
        }
    return results

# 예시 단어 리스트와 카테고리 정의
words = ["즉석사진", "사진", "도서", "서점", "생활용품점"]

# 단어 분류 실행
word_classifications = classify_words(words, categories)

# 결과 출력
for word, classification in word_classifications.items():
    print(f"'{word}' 단어는 '{classification['category']}' 카테고리({classification['score']:.4f})")
