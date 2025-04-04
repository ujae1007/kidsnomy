from bs4 import BeautifulSoup
import requests
import re
import time
import os
import sys
import urllib.request
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
# import pandas as pd
import json
from lxml import html
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
# 웹드라이버 설정
options = webdriver.ChromeOptions()
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

# 버전에 상관 없이 os에 설치된 크롬 브라우저 사용
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)
driver.implicitly_wait(3)
categories = ['의료', '취미', '식비', '카페/간식', '쇼핑', '문구점', '미용', '문화', '도서', '생활', '교통']
eng_categories = ['health', 'hobby', 'eat', 'cafe', 'shopping', 'stationary', 'beauty', 'culture', 'book',
                  'life', 'transportation']
# categories = ['교육']
# eng_categories = ['edu']

for category, name in zip(categories, eng_categories):
    # ConnectionError방지
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}
    for cnt in range(10):
        start_time = time.time()
        file_path = f"./crawling_data/{name}_split_{cnt}.json"
        with open(file_path, "r", encoding="utf-8") as f:
            naver_urls = json.load(f)
        pattern1 = '<[^>]*>'
        res = []

        for num in range(len(naver_urls)):
            try:
                postdate = []
                contents = []
                i = naver_urls[num]
                print(f"{num}번째 크롤링 중: {i}")
                driver.get(i)
                '''
                time.sleep(2)  # 대기시간 조정 가능

                iframe = driver.find_element(By.ID, "mainFrame")  # iframe 이동
                driver.switch_to.frame(iframe)
                '''
                # WebDriverWait을 사용하여 iframe 로딩을 기다림
                WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "mainFrame")))

                iframe = driver.find_element(By.ID, "mainFrame")  # iframe 이동
                driver.switch_to.frame(iframe)
                source = driver.page_source
                html = BeautifulSoup(source, "html.parser")

                # 제목 가져오기
                # title_elem = html.select_one("h3.se_textarea")
                # title_elem = html.select_one("span.se-fs- se-ff-system")
                # title = title_elem.get_text(strip=True) if title_elem else "제목 없음"
                # titles.append(title)

                # 본문 가져오기
                content = html.select("div.se-main-container")
                content = ''.join([c.get_text(strip=True) for c in content])  # get_text() 사용
                contents.append(content)

                # 날짜 가져오기
                date_elem = html.select_one("span.se_publishDate")
                date = date_elem.get_text(strip=True) if date_elem else None
                postdate.append(date)

                # JSON 파일로 저장
                news_data = [{'url': i, 'content': c, 'date': d} for c, d in zip(contents, postdate)]
                res.append(news_data)

            except Exception as e:
                print(f"오류 발생: {e}")
                continue

        with open(f'./crawling_data/blog_data_{name}_{cnt}.json', 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=4)
            print(f"{category}관련 블로그 글 JSON 저장 완료: crawling_data/blog_data_{name}_{cnt}.json")
            end_time = time.time()
            print(f"실행시간: {end_time-start_time}")

driver.quit()  # 드라이버 종료