from fastapi import FastAPI
from pydantic import BaseModel

from rag.rag import RAG_Chatbot

chatbot = RAG_Chatbot()
app = FastAPI()

@app.get("/api/chat")
async def chat(message: str) -> str:
    response = chatbot.get_chat(message)
    return {"response": response}

# 실행 방법:
# uvicorn main:app --reload
# (main.py 파일을 기준으로 app 변수를 실행합니다.)
#
# 테스트 방법:
# http://127.0.0.1:8000/chat/안녕하세요
# 위 주소로 접속하여 결과를 확인할 수 있습니다.
# JSON 형식으로 {"response": "챗봇 응답: 안녕하세요"} 와 같은 응답이 반환됩니다.

# 추가 설명:

# 1. FastAPI: 웹 API를 구축하기 위한 현대적이고 빠른 웹 프레임워크입니다.
# 2. BaseModel: Pydantic 라이브러리를 사용하여 데이터 유효성 검사 및 직렬화/역직렬화를 수행합니다.
# 3. get_chat 함수: 실제 챗봇 로직을 구현해야 하는 부분입니다.
# 4. @app.get("/chat/{message}"): GET 요청을 처리하는 엔드포인트를 정의합니다.
# 5. response_model: 응답 데이터의 모델을 지정합니다.