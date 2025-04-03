import json
import time
from collections import defaultdict

category_list = {"교육":'edu', "병원":'health', "pc방":'hobby', "식당":'eat', "카페":'cafe', "쇼핑":'shopping', "문구":'stationary',
                 "미용":'beauty', "문화":'culture', "도서":'book', "생활":'life', "교통":'transportation'}
res2 = []
for category in category_list:
    res = []
    with open(f"./kakao_data/C_label_{category_list[category]}.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in range(len(data)):
        category_name = data[item]['category_name']
        place_name = data[item]['place_name']
        label_name = data[item]["label"]
        if label_name =="카페":
            label_name = "카페/간식"
        elif label_name == "병원":
            label_name = "의료"
        elif label_name == "pc방":
            label_name = "취미"
        elif label_name == "식당":
            label_name = "식비"
        content = {"category_name": category_name, "place_name": place_name, "label":label_name}
        res.append(content)
        res2.append(content)

    with open(f'./kakao_data/D_final_{category_list[category]}.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=4)
        print(f"{category}관련 데이터 JSON >>최종<<저장 완료: kakao_data/D_final_{category_list[category]}.json")
        end_time = time.time()
with open('./kakao_data/D_A_final_total_data.json', 'w', encoding='utf-8') as f:
    json.dump(res2, f, ensure_ascii=False, indent=4)
    print("JSON >>최종<<저장 완료: kakao_data/D_A_final_total_data.json")

