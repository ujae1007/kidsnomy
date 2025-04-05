'''
소비 리포트 분석
1. 이번 주 소비 (지난 주와 비교)
2. 사용자 평균 소비 비율 비교
3. 결제 내역 api를 긁어와서 소비 내역 카테고리 분류 및 합산
'''

'''
결제 내역 api 구조

"Header": {
        "responseCode": "H0000",
        "responseMessage": "정상처리 되었습니다.",
        "apiName": "inquireTransactionHistoryList",
        "transmissionDate": "20250331",
        "transmissionTime": "141703",
        "institutionCode": "00100",
        "apiKey": "265a24cbda3049959c697baf14f51154",
        "apiServiceCode": "inquireTransactionHistoryList",
        "institutionTransactionUniqueNo": "20250331141703999999"
    },
    "REC": {
        "totalCount": "6",
        "list": [
            {
                "transactionUniqueNo": "85085",
                "transactionDate": "20250326",
                "transactionTime": "172109",
                "transactionType": "2",
                "transactionTypeName": "출금",
                "transactionAccountNo": "",
                "transactionBalance": "1000",
                "transactionAfterBalance": "995000",
                "transactionSummary": "CU, 서울시 강남구",
                "transactionMemo": ""
            },
        ]
    }

'''
import os
import requests
import json
from dotenv import load_dotenv
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from collections import defaultdict

load_dotenv()


### CATEGORY MODEL 관련 설정
# 학습한 모델 로드
model_path = "./kobert_category"  # 학습된 모델이 저장된 경로

# 카테고리 목록과 매핑
categories = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구', '미용', '문화', '도서', '생활', '교통']
category_to_id = {cat: i for i, cat in enumerate(categories)}
id_to_category = {i: cat for i, cat in enumerate(categories)}

# 이미 학습된 모델과 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

def search_kakao_map(store, address):
    """
    도로명 주소로 카카오맵 검색해서 해당 가게의 카테고리 들고오기
    input: store -> 가게명 address -> 주소
    output: category
    """
    REST_API_KEY = os.getenv('KAKAO_API')
    URL = "https://dapi.kakao.com/v2/local/search/keyword.json"

    headers = {
        "Authorization": f"KakaoAK {REST_API_KEY}"
    }
    for page in range(1, 46):
        params = {
            "query": address,
            # "x": "127.09761630337", # 송파구
            # "y": "37.51232891786",
            "radius": 20000,
            "page": 1
        }

        response = requests.get(URL, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()["documents"]
            for item in range(len(data)):
                if data[item]['place_name'] == store:
                    return data[item]['category_name']
        else:
            print(f"Error {response.status_code}: {response.text}")
            continue

def category_classification(kakao_category):
    """
    카카오맵 카테고리 데이터를 프로그램에 맞게 재분류하는 함수
    input: kakao_category -> 분류해야하는 카테고리(str)
    output: predicted_category -> 재분류된 카테고리(str)
    """
    # 입력 텍스트를 토큰화
    encodings = tokenizer(kakao_category, padding="max_length", truncation=True, max_length=64, return_tensors="pt")

    encodings['token_type_ids'] = torch.zeros_like(encodings['input_ids'])

    # 예측 수행
    with torch.no_grad():
        outputs = model(**encodings)
        logits = outputs.logits

    # 예측된 라벨을 얻기
    prediction = torch.argmax(logits, dim=-1).cpu().item()

    # 예측 결과를 카테고리로 변환
    predicted_category = id_to_category[prediction]

    return predicted_category

def total_expense(data):
    """
    카테고리별 총 소비액 계산하는 함수
    input: data[json] => store->상호명, address->가게주소, price->지출액, category->카카오맵카테고리, predicted_category->재분류된 카테고리
    output: res[json] => category->카테고리 expense->총소비액
    """
    res = []
    total_data = defaultdict(int)
    for category in categories:
        total_data[category] = 0

    for item in range(len(data)):
        total_data[data[item]['predicted_category']] += data[item]['price']

    for category in total_data:
        res.append({'category':category, 'expense':total_data[category]})

    return res

def db_data_preprocessing(db_data):
    """
    DB 데이터 전처리 하는 함수
    input: db데이터[json]

    >>DB 데이터 <<
    ACCOUNT_LOG TABLE
      `transaction_date` TIMESTAMP, -> 결제일
      `transaction_type` TINYINT, ->입출금 타입(1->입금, 2->출금)
      `transaction_balance` DECIMAL(15,2), -> 입출금 금액
      `transaction_summary` VARCHAR(255), -> 입출금 정보 -> 형식: 가게명, 도로명주소
    output: res[json]
    """

def category_expense():
    """
    카테고리별 총 지출금액 계산하는 통합 함수
    input: 전처리된 Account_log DB 데이터 -> db_data_preprocessing 함수 결과물

    output: 총 지출 금액 데이터
    """

    data = []
    place_name = "왕가탕후루 충장로점"
    road_address_name = "광주 동구 충장로3가 41-1"
    price = 3500
    searched_category = search_kakao_map(place_name, road_address_name)
    predicted_category = category_classification(searched_category)
    data.append({'store': place_name, 'address': road_address_name, 'price': price, 'category': searched_category,
                 'predicted_category': predicted_category})
    res = total_expense(data)
    return res

# 카테고리 저장
# 통계 자료 -> 5주차 합계
# 이번주 카테고리별 합계

if __name__ == "__main__":
    res1 = category_expense()
    print(res1)



