import json

file_path = "./crawling_data/blog_data_edu_0.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(data[0][0]['content'])