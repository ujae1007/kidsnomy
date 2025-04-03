import json

# 주어진 데이터
data = [
    ("교육의 기본 의미: 사회생활에 필요한 지식이나 기술 및 바람직한 인성과 체력을 갖도록 가르치는 조직적이고 체계적인 활동.",
     "자녀 교육\n가정에서 교육을 잘 받은 아이들이 대체로 인사성이 바르다.\n교육을 받지 않는다면 사람도 짐승과 다를 바가 없을 것이다.\n개화기 지식인들은 교육이야말로 나라를 살리는 길이라고 믿었다.\n유치원에서 대학원까지 합치면 그는 무려 21년 동안 교육을 받았다.\n영재 아동에 대해서는 보통 아이들과는 다른 특별한 교육이 필요하다."),
    ("교육의 또 다른 의미: 특정한 목적을 가지고 기술이나 기능을 가르침.",
     "그들은 테러 교육을 받고 국내에 잠입했다.\n그는 직업 학교에서 6개월간 자동차 정비 교육을 받았다.")
]

# 데이터를 JSON 형식으로 변환
data_dict = [{"meaning": meaning, "examples": examples.split("\n")} for meaning, examples in data]

# JSON 파일로 저장
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data_dict, f, ensure_ascii=False, indent=4)

print("JSON 파일로 저장되었습니다.")
