import json
eng_categories = ['edu', 'health', 'hobby', 'eat', 'cafe', 'shopping', 'stationary', 'beauty', 'culture', 'book',
                  'life', 'transportation']

for name in eng_categories:
    # ConnectionError방지
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}
    file_path = f"./crawling_data/{name}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        naver_urls = json.load(f)

    for hundred in range(10):
        res = []
        for i in range(100):
            res.append(naver_urls[hundred*100 + i])

        with open(f'./crawling_data/{name}_split_{hundred}.json', 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=4)
            print(f"분리 완료! ./crawling_data/{name}_split_{hundred}.json")