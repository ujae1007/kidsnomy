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
# eng_categories = ['edu', 'health', 'hobby', 'eat', 'cafe', 'shopping', 'stationary', 'beauty', 'culture', 'book', 'life', 'transportation']
additional_list = {"카페":["간식", "아이스크림할인점", "빵", "휘낭시에"],
                   "미용":["올리브영"],
                   "교육":["학원"],
                   "쇼핑":["백화점", "아울렛", "옷", "소매", "소품샵"],
                   "식당":["레스토랑", "음식", "버거킹", "맘스터치", "롯데리아", "서브웨이", "샐러드", "햄버거", "감자탕", "고기", "샌드위치", "국밥"],
                   "문화":["영화관", "미술관", "박물관", "놀이동산", "아쿠아리움", "동물원"],
                   "생활":["다이소", "대형마트", "슈퍼"],
                   "병원":["약국"],
                   "pc방":["노래", "사진", "오락"],
                   "교통":["운수", "터미널"]} # 코레일, 티머니


case_input = int(input("데이터 수집하고 싶은 곳은?(기본:1, 그외: 2): "))
if case_input == 1:
    for category in category_list:
        print(f"{category} 데이터 수집 중~")
        res = []
        for page in range(1, 46):
            params = {
                "query": category,
                "x": "127.09761630337", # 송파구
                "y": "37.51232891786",
                "radius": 20000,
                "page":page
            }

            response = requests.get(URL, headers=headers, params=params)
            os.makedirs("./kakao_data", exist_ok=True)
            if response.status_code == 200:
                data = response.json()
                preprocessed_data = data["documents"]
                for cnt in range(len(preprocessed_data)):
                    res.append(preprocessed_data[cnt])
                with open(f"./kakao_data/A_{category_list[category]}.json", "w", encoding="utf-8") as f:
                    json.dump(res, f, indent=4, ensure_ascii=False)

                # print('./asset/data.json으로 저장되었습니다.')
                # print(json.dumps(response.json(), indent=4, ensure_ascii=False))
            else:
                print(f"Error {response.status_code}: {response.text}")
else:
    for large_cate in additional_list:
        print(f"{large_cate} 데이터 추가 수집 중~")
        res = []
        for small_cate in additional_list[large_cate]:
            for page in range(1, 46):
                params = {
                    "query": small_cate,
                    "x": "127.09761630337",
                    "y": "37.51232891786",
                    "radius": 20000,
                    "page": page
                }

                response = requests.get(URL, headers=headers, params=params)
                os.makedirs("./kakao_data", exist_ok=True)
                if response.status_code == 200:
                    data = response.json()
                    preprocessed_data = data["documents"]
                    for cnt in range(len(preprocessed_data)):
                        res.append(preprocessed_data[cnt])
                    with open(f"./kakao_data/A_{category_list[large_cate]}_{additional_list[large_cate].index(small_cate)}.json", "w", encoding="utf-8") as f:
                        json.dump(res, f, indent=4, ensure_ascii=False)

                    # print('./asset/data.json으로 저장되었습니다.')
                    # print(json.dumps(response.json(), indent=4, ensure_ascii=False))
                else:
                    print(f"Error {response.status_code}: {response.text}")