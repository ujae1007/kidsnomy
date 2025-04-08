import os
import requests
import json
from typing import Dict, List
from dotenv import load_dotenv
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from collections import defaultdict
from pydantic import BaseModel

from .classifiaction import CategoryClassifier


load_dotenv()

BASE_PATH = os.path.dirname(os.path.realpath(__file__))

CATEGORIES = [
    "교육",
    "의료",
    "취미",
    "식비",
    "카페/간식",
    "쇼핑",
    "문구",
    "미용",
    "문화",
    "도서",
    "생활",
    "교통",
]


classifier = CategoryClassifier()


class ExpenseStatics:
    def __init__(self, weekly_transactions: dict, save_path: str = ""):
        if save_path:
            self.full_save_path = os.path.join(BASE_PATH, save_path + ".json")

        print(weekly_transactions)
        self.weekly_transactions = weekly_transactions
        self.week_stores_data = defaultdict(list)
        for week, transactions in weekly_transactions.items():
            for transaction in transactions:
                expense = transaction.transactionBalance
                store, address = transaction.transactionSummary.split(",")
                self.week_stores_data[week].append(((store, address), expense))

    def category_expense(self):
        """
        카테고리별 총 소비액 계산하는 함수
        input: data[json] => store->상호명, address->가게주소, expense->지출액, category->카카오맵카테고리, predicted_category->재분류된 카테고리
        output: res[json] => category->카테고리 expense->총소비액
        """

        week_expense = [0] * 5
        category_total_expense = defaultdict(int)

        for i, (week, stores_data_list) in enumerate(self.week_stores_data.items()):
            sum_expense = 0
            for stores_data, expense in stores_data_list:
                # 5주차(이번주)만 카테고리 재분류
                if week == "week5":
                    print(stores_data)
                    new_category = classifier.get_category([stores_data])
                    for _, new_cate in new_category.items():
                        category_total_expense[new_cate] += expense
                sum_expense += expense
            week_expense[i] = sum_expense

        return week_expense, category_total_expense


if __name__ == "__main__":
    from pprint import pprint

    test_transactions = {
        "week1": [
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1",
            },
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "더벙커게임존, 대전 유성구 대학로 34",
            },
        ],
        "week2": [
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "설빙 유성온천점, 대전 유성구 대학로 14",
            },
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1",
            },
        ],
        "week3": [
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1",
            },
        ],
        "week4": [
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1",
            },
        ],
        "week5": [
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1",
            },
            {
                "transactionDate": "20250330",
                "transactionType": 1,
                "transactionBalance": 250000.00,
                "transactionSummary": "더벙커게임존, 대전 유성구 대학로 34",
            },
        ],
    }
    statics = ExpenseStatics(test_transactions)

    week_expense, category_total_expense = statics.category_expense()
    print("week_expense")
    pprint(week_expense)
    print("category_total")
    pprint(category_total_expense)
