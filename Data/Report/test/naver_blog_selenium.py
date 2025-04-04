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
import pandas as pd
import json
from lxml import html

# 웹드라이버 설정
options = webdriver.ChromeOptions()
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

# 버전에 상관 없이 os에 설치된 크롬 브라우저 사용
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)
driver.implicitly_wait(3)
# 버전에 상관 없이 os에 설치된 크롬 브라우저 사용

'''
# Naver API key 입력
client_id = ''
client_secret = ''

# selenium으로 검색 페이지 불러오기 #
naver_urls = []
postdate = []
titles = []

# 검색어 입력
keword = input("검색할 키워드를 입력해주세요:")
encText = urllib.parse.quote(keword)

# 검색을 끝낼 페이지 입력
end = input("\n크롤링을 끝낼 위치를 입력해주세요. (기본값:1, 최대값:100):")
if end == "":
    end = 1
else:
    end = int(end)
print("\n 1 ~ ", end, "페이지 까지 크롤링을 진행 합니다")

# 한번에 가져올 페이지 입력
display = input("\n한번에 가져올 페이지 개수를 입력해주세요.(기본값:10, 최대값: 100):")
if display == "":
    display = 10
else:
    display = int(display)
print("\n한번에 가져올 페이지 : ", display, "페이지")

for start in range(end):
    url = "https://openapi.naver.com/v1/search/blog?query=" + encText + "&start=" + str(start + 1) + "&display=" + str(
        display + 1)  # JSON 결과
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    response = urllib.request.urlopen(request)
    rescode = response.getcode()
    if (rescode == 200):
        response_body = response.read()

        data = json.loads(response_body.decode('utf-8'))['items']
        for row in data:
            if ('blog.naver' in row['link']):
                naver_urls.append(row['link'])
                postdate.append(row['postdate'])
                title = row['title']
                # html태그제거
                pattern1 = '<[^>]*>'
                title = re.sub(pattern=pattern1, repl='', string=title)
                titles.append(title)
        time.sleep(2)
    else:
        print("Error Code:" + rescode)
'''
###naver 기사 본문 및 제목 가져오기###

# ConnectionError방지
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}
naver_urls=["https:\/\/blog.naver.com\/mindiggo\/223783478308"]
postdate = []
titles = []
contents = []

pattern1 = '<[^>]*>'
try:
    for i in naver_urls:
        print(f"크롤링 중: {i}")
        driver.get(i)
        time.sleep(5)  # 대기시간 조정 가능

        iframe = driver.find_element(By.ID, "mainFrame")  # iframe 이동
        driver.switch_to.frame(iframe)

        source = driver.page_source
        html = BeautifulSoup(source, "html.parser")

        # 제목 가져오기
        # title_elem = html.select_one("h3.se_textarea")
        title_elem = html.select_one("span.se-fs- se-ff-system")
        title = title_elem.get_text(strip=True) if title_elem else "제목 없음"
        titles.append(title)

        # 본문 가져오기
        content = html.select("div.se-main-container")
        content = ''.join([c.get_text(strip=True) for c in content])  # get_text() 사용
        contents.append(content)

        # 날짜 가져오기
        date_elem = html.select_one("span.se_publishDate")
        date = date_elem.get_text(strip=True) if date_elem else None
        postdate.append(date)

    # JSON 파일로 저장
    news_data = [{'title': t, 'content': c, 'date': d} for t, c, d in zip(titles, contents, postdate)]
    with open('blog.json', 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=4)

    print("JSON 저장 완료: blog.json")

except Exception as e:
    print(f"오류 발생: {e}")

finally:
    driver.quit()  # 드라이버 종료