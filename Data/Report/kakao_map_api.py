import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()


REST_API_KEY = os.getenv('KAKAO_API')
URL = "https://dapi.kakao.com/v2/local/search/keyword.json"

headers = {
    "Authorization": f"KakaoAK {REST_API_KEY}"
}

category_list = {"교육":'edu', "병원":'health', "pc방":'hobby', "식당":'eat', "카페":'cafe', "쇼핑":'shopping', "문구":'stationary',
                 "미용":'beauty', "문화":'culture', "도서":'book', "생활":'life', "교통":'transportation'}
SEARCH_QUERY = "탕후루"
params = {
    "query": SEARCH_QUERY,
    # "x": "127.09761630337", # 송파구
    # "y": "37.51232891786",
    "radius": 20000,
    "page":1
}

response = requests.get(URL, headers=headers, params=params)
os.makedirs("./kakao_data", exist_ok=True)
if response.status_code == 200:
    data = response.json()
    print(json.dumps(response.json(), indent=4, ensure_ascii=False))
else:
    print(f"Error {response.status_code}: {response.text}")
