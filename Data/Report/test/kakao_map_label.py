import json
import time
from collections import defaultdict

category_list = {"교육":'edu', "병원":'health', "pc방":'hobby', "식당":'eat', "카페":'cafe', "쇼핑":'shopping', "문구":'stationary',
                 "미용":'beauty', "문화":'culture', "도서":'book', "생활":'life', "교통":'transportation'}
# category_list = {"테스트":"test"}
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
category_label_list = {'q': "교육", 'w': "병원", 'e': "취미", 'r': "식당", 't': "카페", 'a':"쇼핑", 's':"문구",
                 'd': "미용", 'f':"문화", 'g':"도서", 'z': "생활", 'x': "교통"}

# label_data_list = defaultdict(str)
with open("./kakao_data/C_A_label_data.json", "r", encoding="utf-8") as f:
    label_data_list = json.load(f)
#
# print(len(label_data_list))

# 라벨링할 데이터 카테고리별 갯수 확인
# res = []
# for category in category_list:
#     start_time = time.time()
#     file_path = f"./kakao_data/B_processed_{category_list[category]}.json"
#     with open(file_path, "r", encoding="utf-8") as f:
#         data = json.load(f)
#         print(f"{category} {len(data)}")
#         res.append(len(data))
#
# print(sum(res))

for category in category_list:
    start_time = time.time()
    res = []
    file_path = f"./kakao_data/B_processed_{category_list[category]}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for place in range(len(data)):
        category_name = data[place]["category_name"]
        place_name = data[place]["place_name"]
        if category_name in label_data_list:
            label_name = label_data_list[category_name]
        else:
            print('================================')
            print("카테고리 분류")
            print('--------------------------------')
            print('q: 교육, w: 병원, e: 취미, r: 식당, t: 카페, a:쇼핑, s:문구\nd: 미용, f:문화, g:도서, z: 생활, x: 교통')
            print('--------------------------------')
            print(f"해당 데이터: {category_name}")
            print(f"상호명 이름: {place_name}")
            print('--------------------------------')
            label_input = input(f"해당 데이터가 어떤 카테고리에 속할 것 같은지 입력하기:")
            if label_input == "":
                label_input = input("다시 입력하기: ")
            label_data_list[category_name] = category_label_list[label_input]
            print(category_label_list[label_input])
            print(f"데이터 추가 완! {category_name} -> {category_label_list[label_input]}")
            print('================================')
            label_name = category_label_list[label_input]
        refined_data = {"category_name": category_name, "place_name": place_name, "label": label_name}
        res.append(refined_data)
    with open(f'./kakao_data/C_label_{category_list[category]}.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=4)
        print(f"{category}관련 지도 글 라벨링 데이터 JSON 저장 완료: kakao_data/C_label_{category_list[category]}.json")

with open(f'./kakao_data/C_A_label_data.json', 'w', encoding='utf-8') as f:
    json.dump(label_data_list, f, ensure_ascii=False, indent=4)
    print(f"라벨 데이터 JSON 저장 완료!! 끝!!")