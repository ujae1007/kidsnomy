# 네이버 검색 API 예제 - 블로그 검색
import os
import sys
import urllib.request
from dotenv import load_dotenv
load_dotenv()
QUERY_STRING = '관평동 양꼬치'
DISPLAY_NUM = 5 #한 번에 표시할 검색 결과 개수(기본값: 1, 최댓값: 5)
START_NUM = 1 #검색 시작 위치(기본값: 1, 최댓값: 1)
SORT_METHOD = 'random' #검색 결과 정렬 방법- random: 정확도순으로 내림차순 정렬(기본값)- comment: 업체 및 기관에 대한 카페, 블로그의 리뷰 개수순으로 내림차순 정렬
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
encText = urllib.parse.quote(QUERY_STRING)
url = os.getenv('REQUEST_URL_JSON')+encText+'&display='+str(DISPLAY_NUM)+'&start='+str(START_NUM)+'&sort='+SORT_METHOD
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id",client_id)
request.add_header("X-Naver-Client-Secret",client_secret)
response = urllib.request.urlopen(request)
rescode = response.getcode()
if(rescode==200):
    response_body = response.read()
    print(response_body.decode('utf-8'))
else:
    print("Error Code:" + rescode)