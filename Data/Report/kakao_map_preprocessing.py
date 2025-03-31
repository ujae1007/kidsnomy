import json
import time

category_list = {"교육":'edu', "병원":'health', "pc방":'hobby', "식당":'eat', "카페":'cafe', "쇼핑":'shopping', "문구":'stationary',
                 "미용":'beauty', "문화":'culture', "도서":'book', "생활":'life', "교통":'transportation'}
# eng_categories = ['edu', 'health', 'hobby', 'eat', 'cafe', 'shopping', 'stationary', 'beauty', 'culture', 'book', 'life', 'transportation']
additional_list = {"카페":["간식", "아이스크림할인점", "빵", "휘낭시에"],
                   "미용":["올리브영"],
                   "교육":["학원"],
                   "쇼핑":["백화점", "아울렛", "옷"],
                   "식당":["레스토랑", "음식", "버거킹", "맘스터치", "롯데리아", "서브웨이", "샐러드", "햄버거", "감자탕", "고기", "샌드위치", "국밥"],
                   "문화":["영화관", "미술관", "박물관", "놀이동산", "아쿠아리움", "동물원"],
                   "생활":["다이소", "대형마트", "슈퍼"],
                   "병원":["약국"],
                   "pc방":["노래", "사진", "오락"],
                   "교통":["운수", "터미널"]} # 코레일, 티머니

for category in category_list:
    start_time = time.time()
    res = []
    file_path = f"./kakao_data/A_{category_list[category]}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    for place in range(len(data)):
        # address_name = data[place]["address_name"]
        category_name = data[place]["category_name"]
        place_name = data[place]["place_name"]

        refined_data = {"category_name": category_name, "place_name": place_name}
        res.append(refined_data)

    if category in additional_list:
        for small_cate in additional_list[category]:

            file_path = f"./kakao_data/A_{category_list[category]}_{additional_list[category].index(small_cate)}.json"
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            for place in range(len(data)):
                # address_name = data[place]["address_name"]
                category_name = data[place]["category_name"]
                place_name = data[place]["place_name"]

                refined_data = {"category_name": category_name, "place_name": place_name}
                res.append(refined_data)

    with open(f'./kakao_data/B_processed_{category_list[category]}.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=4)
        print(f"{category}관련 지도 글 JSON 저장 완료: kakao_data/B_processed_{category_list[category]}.json")
        end_time = time.time()
        print(f"실행시간: {end_time - start_time}")
