import os
import json
from typing import List, Tuple, Dict
import requests
from dotenv import load_dotenv
from tqdm import tqdm
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

load_dotenv()

BASE_PATH = os.path.dirname(os.path.realpath(__file__))

# 카테고리 목록과 매핑
CATEGORIES = [
    "교육",
    "의료",
    "취미",
    "식비",
    "카페_간식",
    "쇼핑",
    "문구",
    "미용",
    "문화",
    "도서",
    "생활",
    "교통",
]
ID2CATEGORY = {i: cat for i, cat in enumerate(CATEGORIES)}

# kakao api 검색 관련 변수
KAKAO_API_KEY = os.getenv("KAKAO_API")
KAKAO_URL = "https://dapi.kakao.com/v2/local/search/keyword.json"


class CategoryClassifier:

    def __init__(self, model_path: str = "kobert_category"):
        """분류기의 초기화

        Args:
            model_path (str, optional): 모델 경로입니다. Defaults to "kobert_category".
        """

        # 이미 학습된 모델과 토크나이저 로드
        full_model_path = os.path.join(BASE_PATH, model_path)
        self.tokenizer = AutoTokenizer.from_pretrained(full_model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(full_model_path)

    def _search_kakao_map(self, store: str, address: str) -> str:
        """도로명 주소로 카카오맵 검색 후, 해당 가게의 카테고리 들고오기
        도로명 주소 검색 후, 해당 주소에서 같은 이름의 가게를 찾습니다.
        이후 해당 가게의 카테고리를 반환합니다.

        Args:
            store (str): 가게명
            address (str): 가게 주소

        Returns:
            str: 카테고리
        """

        headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
        for page in range(1, 46):
            params = {
                "query": address,
                # "x": "127.09761630337", # 송파구
                # "y": "37.51232891786",
                "radius": 20000,
                "page": page,
            }

            response = requests.get(KAKAO_URL, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()["documents"]
                for item in range(len(data)):
                    print(data[item]["place_name"])
                    if data[item]["place_name"] == store:
                        return data[item]["category_name"]
            else:
                print(f"Error {response.status_code}: {response.text}")
                continue

        print(f"{store}, {address}를 찾지 못했습니다.")
        return ""

    def _category_classification(self, kakao_category: str) -> str:
        """카카오맵 카테고리 데이터를 프로그램에 맞게 재분류하는 함수

        Args:
            kakao_category (str): 분류해야하는 카테고리

        Returns:
            str: 재분류된 카테고리
        """

        # 입력 텍스트를 토큰화
        encodings = self.tokenizer(
            kakao_category,
            padding="max_length",
            truncation=True,
            max_length=64,
            return_tensors="pt",
        )

        encodings["token_type_ids"] = torch.zeros_like(encodings["input_ids"])

        # 예측 수행
        with torch.no_grad():
            outputs = self.model(**encodings)
            logits = outputs.logits

        # 예측된 라벨을 얻기
        prediction = torch.argmax(logits, dim=-1).cpu().item()

        # 예측 결과를 카테고리로 변환
        predicted_category = ID2CATEGORY[prediction]

        return predicted_category

    def get_category(
        self, stores_data: List[Tuple[str, str]], save_path: str = ""
    ) -> Dict[str, str]:
        """stores의 가게명과 주소를 기반으로 재분류된 카테고리를 반환합니다.

        Args:
            stores_data (List[Tuple[str, str]]): (가게명, 주소)를 원소로 가지는 리스트
            save_path (str): 재분류된 카테고리를 저장할 경로, 입력하지 않으면 저장하지 않음. Defaults to ""

        Returns:
            List[Tuple[str, str]]: (가게명, 카테고리)를 원소로 가지는 리스트
        """

        category_map = dict()

        if save_path:
            full_save_path = os.path.join(BASE_PATH, save_path + ".json")

            # 입력한 저장 파일 경로가 있으면 불러오기
            if os.path.exists(full_save_path):
                with open(full_save_path, "r", encoding="UTF-8") as load_file:
                    category_map = json.load(load_file)
                print("카테고리 파일을 불러왔습니다.")

        # 입력 받은 가게 정보를 기반으로 카테고리 재분류
        print("카테고리 재분류 중...")
        for store, address in tqdm(stores_data):
            print(store, address)
            kakao_category = self._search_kakao_map(store=store, address=address)

            # 이미 분류되었던 카테고리는 생략
            if kakao_category in category_map:
                continue

            new_category = self._category_classification(kakao_category)
            print(kakao_category, new_category)
            if not new_category:
                continue

            category_map[kakao_category] = new_category

        # 카테고리 저장
        if save_path:
            with open(full_save_path, "w", encoding="UTF-8") as save_file:
                json.dump(category_map, save_file, indent=4, ensure_ascii=False)
            print(f"카테고리 파일이 저장되었습니다. ({full_save_path})")

        return category_map


if __name__ == "__main__":
    from pprint import pprint

    stores_data = [
        ("왕가탕후루 충장로점", "광주 동구 충장로3가 41-1"),
        ("더벙커게임존", "대전 유성구 대학로 34"),
        ("설빙 유성온천점", "대전 유성구 대학로 14"),
    ]

    classifier = CategoryClassifier()
    category_map = classifier.get_category(stores_data, "test")

    pprint(category_map)
