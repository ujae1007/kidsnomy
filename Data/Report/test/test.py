import json

# 데이터 개수 확인
file_path=f"./kakao_data/D_A_final_total_data.json"
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(len(data))