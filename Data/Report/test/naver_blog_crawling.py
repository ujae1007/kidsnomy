# 네이버 검색 API 예제 - 블로그 검색
import os
import sys
import urllib.request
from dotenv import load_dotenv
load_dotenv()
QUERY_STRING = '식비 소비'
DISPLAY_NUM = 10 #한 번에 표시할 검색 결과 개수(기본값: 10, 최댓값: 100)
START_NUM = 1 #검색 시작 위치(기본값: 1, 최댓값: 1000)
SORT_METHOD = 'sim' # 검색 결과 정렬 방법- sim: 정확도순으로 내림차순 정렬(기본값)- date: 날짜순으로 내림차순 정렬
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
encText = urllib.parse.quote(QUERY_STRING)
url = os.getenv('BLOG_REQUEST_URL_JSON')+encText+'&display='+str(DISPLAY_NUM)+'&start='+str(START_NUM)+'&sort='+SORT_METHOD
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id",client_id)
request.add_header("X-Naver-Client-Secret",client_secret)
response = urllib.request.urlopen(request)
rescode = response.getcode()
if(rescode==200):
    response_body = response.read().decode('utf-8')
    # print(response_body.decode('utf-8'))
    print(response_body["items"])
else:
    print("Error Code:" + rescode)