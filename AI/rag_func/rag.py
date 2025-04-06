from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os
import nltk
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import Chroma, FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import argparse

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
load_dotenv()


SYSTEM_PROMPT = """
You are "노미" who an expert in adolescent behavior change, specializing in guiding 10-15-year-olds. Use the provided documents to generate an informed response while following these guidelines:

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

    def __init__(
        self,
        embeddings_model_name="paraphrase-multilingual-mpnet-base-v2",
        folder_path="./data/crawled_data",
        vectordb_type="chroma",  # vectordb_type 파라미터 추가
    ):
        """class 초기화

        Args:
            embeddings_model_name (str, optional): 임베딩 모델 이름. Defaults to "paraphrase-multilingual-mpnet-base-v2".
            folder_path (str, optional): RAG의 문서가 될 데이터. Defaults to "./data/crawled_data".
            vectordb_type (str, optional): 사용할 VectorDB 유형 ("chroma" 또는 "faiss"). Defaults to "chroma".
        """
        self.embeddings = SentenceTransformerEmbeddings(
            model_name=embeddings_model_name
        )

        # 저장 경로는 DB 유형과 동일하게 설정
        self.persist_directory = os.path.join(CURRENT_PATH, vectordb_type)
        self.folder_path = os.path.join(CURRENT_PATH, folder_path)
        self.vectordb_type = vectordb_type.lower()  # 소문자로 통일
        self._make_vectordb()

    def _make_vectordb(self, chunk_size: int = 500, chunk_overlap: int = 50):
        """VectorDB를 생성합니다.

        Args:
            chunk_size (int, optional): 청크 크기. Defaults to 500.
            chunk_overlap (int, optional): 청크 오버랩 크기. Defaults to 50.
            batch_size (int, optional): 배치 크기. Defaults to 256.
        """

        print(self.vectordb_type, os.path.exists(self.persist_directory))

        if self.vectordb_type == "chroma":
            if os.path.exists(self.persist_directory):  # DB가 이미 존재하면
                print(f"ChromaDB가 이미 존재합니다: {self.persist_directory}")
                self.vectordb = Chroma(
                    persist_directory=self.persist_directory,
                    embedding_function=self.embeddings,
                )  # 존재하는 DB를 로드하고 반환
                return

        elif self.vectordb_type == "faiss":
            if os.path.exists(self.persist_directory):  # DB가 이미 존재하면
                print(f"FAISS가 이미 존재합니다: {self.persist_directory}")
                self.vectordb = FAISS.load_local(
                    self.persist_directory, self.embeddings
                )
                return

        nltk.download("averaged_perceptron_tagger_eng", download_dir="/nltk_data")

        # 텍스트 파일 로드
        loader = DirectoryLoader(self.folder_path, glob="./*.txt")
        documents = loader.load()

        # 텍스트 분할
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )
        texts = text_splitter.split_documents(documents)

        self.vectordb = self._add_to_vectordb(
            texts, self.embeddings, persist_directory=self.persist_directory
        )

    def _add_to_vectordb(
        self,
        texts: list,
    ):
        """문서들을 VectorDB에 추가하고 저장합니다. 이미 DB가 존재하면 추가하지 않습니다.

        Args:
            texts (list): langchain Document 객체의 리스트.
            embeddings (SentenceTransformerEmbeddings): 사용할 임베딩 모델.
            persist_directory (str): VectorDB 데이터를 저장할 경로.

        Returns:
            Chroma | FAISS: VectorDB 인스턴스.
        """

        if self.vectordb_type == "chroma":
            db = Chroma.from_documents(
                texts, self.embeddings, persist_directory=self.persist_directory
            )  # 초기 ChromaDB 생성
            db.persist()  # 데이터를 디스크에 저장
            return db

        elif self.vectordb_type == "faiss":
            db = FAISS.from_documents(texts, self.embeddings)
            db.save_local(self.persist_directory)
            return db

        else:
            raise ValueError(
                f"Invalid vectordb_type: {self.vectordb_type}. Choose 'chroma' or 'faiss'."
            )

    def get_chat(self, query: str, max_tokens: int = 1024) -> str:
        """질의에 대한 답변을 생성합니다.

        Args:
            query (str): 사용자 질의.
            max_tokens (int, optional): 답변 최대 토큰 수. Defaults to 1024.

        Returns:
            str: 생성된 답변.
        """
        retriever = self.vectordb.as_retriever(search_kwargs={"k": 5})
        llm = OpenAI(max_tokens=max_tokens)
        qa = RetrievalQA.from_chain_type(
            llm=llm, chain_type="stuff", retriever=retriever
        )
        result = qa.run(SYSTEM_PROMPT + query)
        return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RAG Chatbot with ChromaDB or FAISS")
    parser.add_argument(
        "--build_db",
        action="store_true",
        help="Build VectorDB during Docker image build",
    )
    parser.add_argument(
        "--vectordb_type",
        type=str,
        default="chroma",
        choices=["chroma", "faiss"],
        help="VectorDB type: chroma or faiss",
    )  # vectordb_type 인자 추가
    args = parser.parse_args()

    chatbot = RAG_Chatbot(vectordb_type=args.vectordb_type)  # 인자 전달

    if args.build_db:
        print(f"Building {args.vectordb_type.capitalize()}...")
        chatbot._make_vectordb()
        print(
            f"{args.vectordb_type.capitalize()} built and saved to {chatbot.persist_directory}"
        )
    else:
        query = """
        12살 딸을 키우고 있는데, 우리 딸이 간식을 너무 좋아해
        문제는 운동도 안하고 쓰레기도 치우지 않아
        어떻게 하면 좋을까?
        """
        answer = chatbot.get_chat(query)
        print(answer)



{
    
  "accountNo": "9996499778380668",
  "weeklyTransactions": {
    "week1": [
        {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1"
        },
        {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "더벙커게임존, 대전 유성구 대학로 34"
        }
    ],
    "week2": [
        {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "설빙 유성온천점, 대전 유성구 대학로 14"
        },
        {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1"
        }
    ],
    "week3": [
        {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1"
        }
    ],
    "week4": [
        {
        "transactionDate": "20250330",
        "transactionType": 1,
        "transactionBalance": 250000.00,
        "transactionSummary": "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1"
        }
    ],
    "week5": [
        {
        "transactionDate": "20250403",
        "transactionType": 1,
        "transactionBalance": 100000000.00,
        "transactionSummary": "(수시입출금) : 입금"
        },
        {
        "transactionDate": "20250403",
        "transactionType": 1,
        "transactionBalance": 100000000.00,
        "transactionSummary": "(수시입출금) : 입금"
        },
        {
        "transactionDate": "20250403",
        "transactionType": 1,
        "transactionBalance": 100000000.00,
        "transactionSummary": "(수시입출금) : 입금"
        },
        {
        "transactionDate": "20250403",
        "transactionType": 1,
        "transactionBalance": 100000000.00,
        "transactionSummary": "(수시입출금) : 입금"
        },
        {
        "transactionDate": "20250403",
        "transactionType": 2,
        "transactionBalance": 50000000.00,
        "transactionSummary": "(수시입출금) : 출금"
        },
        {
        "transactionDate": "20250402",
        "transactionType": 1,
        "transactionBalance": 150000.00,
        "transactionSummary": "(수시입출금) : 입금"
        },
        {
        "transactionDate": "20250401",
        "transactionType": 2,
        "transactionBalance": 100000.00,
        "transactionSummary": "(수시입출금) : 출금"
        },
        {
        "transactionDate": "20250401",
        "transactionType": 1,
        "transactionBalance": 2000000.00,
        "transactionSummary": "(수시입출금) : 입금"
        },
        {
        "transactionDate": "20250331",
        "transactionType": 2,
        "transactionBalance": 700000.00,
        "transactionSummary": "(수시입출금) : 출금"
        }
    ]
}
}
