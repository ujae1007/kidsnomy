from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

import json
category = ['교육', '의료', '취미', '식비', '카페/간식', '쇼핑', '문구점',
            '미용', '문화', '도서', '생활', '교통']

with open("asset/data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

category_data = data['documents'][0]['category_name']
print(category_data)
processed_category_data = [category.strip() for category in category_data.split(">")]
print(processed_category_data)

def classify_word(word):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(category + [word])
    similarities = cosine_similarity(vectors[-1], vectors[:-1])
    print(similarities)
    best_match_idx = np.argmax(similarities)
    return category[best_match_idx]

word = processed_category_data[-2]
predicted_category = classify_word(word)
print(f"'{word}'(은)는 '{predicted_category}' 카테고리로 분류되었습니다.")

# word1 = processed_category_data[-3]
# predicted_category1 = classify_word(word1)
# print(f"'{word1}'(은)는 '{predicted_category1}' 카테고리로 분류되었습니다.")