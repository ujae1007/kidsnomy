import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import json
import numpy as np

### 아래는 학습되지 않은 데이터 ###
text_list = ["음식점 > 양식 > 피자 > 피자알볼로",
            "음식점 > 패스트푸드 > 버거킹",
            "음식점 > 패밀리레스토랑 > 빕스",
            "서비스,산업 > 식품 > 음료,주류제조 > 주류도매,주류유통",
            "의료,건강 > 병원 > 대학병원",
            "교통,수송 > 기차,철도 > 기차역 > KTX정차역",
            "여행 > 관광,명소 > 테마파크 > 테마파크시설"]
ans_list = ["식비",
           "식비",
           "식비",
           "식비",
           "의료",
           "교통",
           "문화"]

# 학습한 모델 로드
model_path = "./kobert_category_v2"  # 학습된 모델이 저장된 경로

# 카테고리 목록과 매핑
categories = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구', '미용', '문화', '도서', '생활', '교통']
category_to_id = {cat: i for i, cat in enumerate(categories)}
id_to_category = {i: cat for i, cat in enumerate(categories)}

# 이미 학습된 모델과 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# 모델을 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# device = torch.device("cpu")
model.to(device)

# 예측 함수
def predict_single_text(text):
    # 입력 텍스트를 토큰화
    encodings = tokenizer(text, padding="max_length", truncation=True, max_length=64, return_tensors="pt")

    # print("Token Type IDs:", encodings['token_type_ids'])
    encodings['token_type_ids'] = torch.zeros_like(encodings['input_ids'])
    # print("Token Type IDs:", encodings['token_type_ids'])
    # 입력 데이터를 GPU로 이동
    encodings = {key: value.to(device) for key, value in encodings.items()}
    # 예측 수행
    model.to(device)
    with torch.no_grad():
        outputs = model(**encodings)
        logits = outputs.logits

    # 예측된 라벨을 얻기
    prediction = torch.argmax(logits, dim=-1).cpu().item()

    # 예측 결과를 카테고리로 변환
    predicted_category = id_to_category[prediction]

    return predicted_category


# 예측 수행
predicted_categories = [predict_single_text(text) for text in text_list]

# 예측 결과와 실제 결과 비교
print("실제 정답:", ans_list)
print("예측 결과:", predicted_categories)

# 정확도 계산
accuracy = np.mean(np.array(predicted_categories) == np.array(ans_list))
print(f"정확도: {accuracy:.4f}")
