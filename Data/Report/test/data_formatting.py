import json

# 데이터
with open("asset/category_training.json", "r", encoding="utf-8") as f:
  category_data = json.load(f)


# 데이터 변환
formatted_data = []

for category, items in category_data.items():
    for item in items:
        meaning = item["meaning"]
        examples = " ".join(item["examples"])
        text = f"{category}: {meaning} 예시: {examples}"
        label = category  # 카테고리 이름을 레이블로 사용
        formatted_data.append({"text": text, "label": label})

# JSON으로 저장
with open("./asset/formatted_lora_data.json", "w", encoding="utf-8") as f:
    json.dump(formatted_data, f, ensure_ascii=False, indent=4)

print("데이터가 formatted_lora_data.json으로 저장되었습니다.")