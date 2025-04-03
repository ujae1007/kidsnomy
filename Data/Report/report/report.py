import os
import requests
import json
from typing import Dict, List
from dotenv import load_dotenv
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from collections import defaultdict

from classifiaction import CategoryClassifier

load_dotenv()

CATEGORIES = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구', '미용', '문화', '도서', '생활', '교통']

classifier = CategoryClassifier()

{
  "accountNo": "9996499778380668",
  "weeklyTransactions": {
    "week1": [],
    "week2": [],
    "week3": [],
    "week4": [
      {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "(수시입출금) : 입금"
      },
    ]
    }
}

class ExpenseStatics:
    def __init__(self, save_path):
        if save_path:
            full_save_path = os.path.join(BASE_PATH, save_path + ".json")

            # 입력한 저장 파일 경로가 있으면 불러오기
            if os.path.exists(full_save_path):
                with open(full_save_path, 'r', encoding='UTF-8') as load_file:
                    category_map = json.load(load_file)
                print("카테고리 파일을 불러왔습니다.")
        pass
    
    def convert_category(self):
        pass

    def week_category_expense(self, weekly_transactions: Dict[str, List[Dict]]):
        """
        카테고리별 총 소비액 계산하는 함수
        input: data[json] => store->상호명, address->가게주소, price->지출액, category->카카오맵카테고리, predicted_category->재분류된 카테고리
        output: res[json] => category->카테고리 expense->총소비액
        """
        res = []
        total_data = defaultdict(int)

        for week, transactions in weekly_transactions.items():
            for transaction in transactions:
                transaction["transactionBalance"]
                transaction["transactionSummary"]


        for item in range(len(data)):
            total_data[data[item]['predicted_category']] += data[item]['price']

        for category in total_data:
            res.append({'category':category, 'expense':total_data[category]})

        return res

    def total_week_expense():
        pass


    # 통계 자료 -> 5주차 합계
    # 이번주 카테고리별 합계

if __name__ == "__main__":
    res1 = category_expense()
    print(res1)




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