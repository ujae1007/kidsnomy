# API 키를 환경변수로 관리하기 위한 설정 파일
from dotenv import load_dotenv

from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os

import nltk

from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI


# API 키 정보 로드
load_dotenv()

system_prompt = """
You are an expert in adolescent behavior change, specializing in guiding 10-15-year-olds. Use the provided documents to generate an informed response while following these guidelines:

### **Response Guidelines**
- Retrieve and utilize relevant information from the provided documents.
- Adjust the wording naturally in your response (e.g., "my kid" → "the child").
- Assess the child's current situation and suggest key areas for improvement.
- Recommend **five** specific activities tailored to the child's interests and challenges.
- Present each activity in the format: **"Activity Name / Description / Expected Benefits."**
- Ensure the activities are practical and easy to implement in daily life.
- Maintain a natural and supportive tone while showing respect.
- **Respond in Korean.**

### Response Format
현재 상황 분석
[문서 기반 분석 내용 요약]
- (문서에서 참고한 내용 요약)

[아이의 상황]
- (아이의 현재 문제 또는 필요한 변화 방향)

추천 활동 5가지 
활동명: 설거지
설명: 가족을 돕는 작은 습관을 들이며 책임감을 기를 수 있음.
기대 효과: 성취감 증가, 가족과의 관계 개선

활동명: 방 정리
설명: 자기 주변을 정리하는 습관을 통해 질서와 자기 관리 능력 향상.
기대 효과: 집중력 향상, 자기주도적 태도 형성

활동명: 독서
설명: 관심 있는 주제의 책을 읽으며 사고력을 키우는 활동.
기대 효과: 창의력 향상, 어휘력 증가

활동명: 운동 (예: 줄넘기, 축구)
설명: 신체 활동을 통해 에너지를 긍정적으로 발산.
기대 효과: 스트레스 해소, 건강 증진

활동명: 감정 일기 쓰기
설명: 하루 동안 느낀 감정을 기록하며 자기 이해를 높이는 활동.
기대 효과: 감정 조절 능력 향상, 정서적 안정

3️결론 및 조언
위 활동들을 아이의 관심사와 성향에 맞게 적용해 보세요. 무리하게 강요하기보다는 자연스럽게 습관이 형성될 수 있도록 도와주는 것이 중요합니다.

### Question:
"""


class RAG_Chatbot:
    global system_prompt

    def __init__(self, embeddings_model_name="paraphrase-multilingual-mpnet-base-v2", persist_directory="./chroma_db", folder_path = "./data/crawled_data"):
        self.embeddings = SentenceTransformerEmbeddings(model_name=embeddings_model_name)
        self.persist_directory = persist_directory
        self.folder_path = folder_path
        self._make_chroma_db()

    def _make_chroma_db(self, chunk_size=500, chunk_overlap=50, batch_size=32):
        
        nltk.download('averaged_perceptron_tagger_eng')

        # 텍스트 파일 로드
        loader = DirectoryLoader(self.folder_path, glob="./*.txt")
        documents = loader.load()

        # 텍스트 분할
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        texts = text_splitter.split_documents(documents)

        self.chroma_db = self._add_to_chroma_batched(texts, self.embeddings, batch_size=batch_size, persist_directory=self.persist_directory)

    
    def _add_to_chroma_batched(texts: str, embeddings, batch_size: int=32, persist_directory: str="./chroma_db"):
        """문서들을 배치 단위로 ChromaDB에 추가하고 저장합니다. 이미 DB가 존재하면 추가하지 않습니다.

        Args:
            texts (str): _description_
            embeddings (_type_): _description_
            batch_size (int, optional): _description_. Defaults to 32.
            persist_directory (str, optional): _description_. Defaults to "./chroma_db".

        Returns:
            _type_: _description_
        """
        """
        문서들을 배치 단위로 ChromaDB에 추가하고 저장합니다. 이미 DB가 존재하면 추가하지 않습니다.

        Args:
            texts: langchain Document 객체의 리스트.
            embeddings: 사용할 임베딩 모델.
            batch_size: 배치 크기.
            persist_directory: ChromaDB 데이터를 저장할 경로.

        Returns:
            ChromaDB 인스턴스 또는 None.
        """

        if os.path.exists(persist_directory): #DB가 이미 존재하면
            print(f"ChromaDB가 이미 존재합니다: {persist_directory}")
            return Chroma(persist_directory=persist_directory, embedding_function=embeddings) #존재하는 DB를 로드하고 반환
        if not texts:
            return None  # 빈 문서 리스트인 경우 None 반환

        db = Chroma.from_documents(texts[:batch_size], embeddings, persist_directory=persist_directory)  # 초기 ChromaDB 생성

        if len(texts) > batch_size:
            for i in range(batch_size, len(texts), batch_size):
                batch_texts = texts[i:i + batch_size]
                db.add_documents(batch_texts)

        db.persist() # 데이터를 디스크에 저장
        return db

    def get_answer(self, query, max_tokens=1024):
        retriever = self.chroma_db.as_retriever(search_kwargs={'k': 5})
        llm = OpenAI(max_tokens=max_tokens)
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)
        result = qa.run(self.system_prompt + query)
        return result
    
if __name__ == "__main__":
    # User input (query)
    query = """
    12살 딸을 키우고 있는데, 우리 딸이 간식을 너무 좋아해
    문제는 운동도 안하고 쓰레기도 치우지 않아
    어떻게 하면 좋을까?
    """

    # Initialize the chatbot
    chatbot = RAG_Chatbot()

    # Get the answer
    answer = chatbot.get_answer(query)
    print(answer)