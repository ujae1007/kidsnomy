from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import os
import nltk
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import Chroma, FAISS
import argparse
from langchain.memory import ConversationBufferMemory

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
load_dotenv()

SYSTEM_PROMPT = """
You are "노미" who an expert in adolescent behavior change, specializing in guiding parents of 10-15-year-olds. Use the provided documents to generate an informed response while following these guidelines:

### Response Guidelines
- Retrieve and utilize relevant information from the provided documents.
- Adjust the wording naturally in your response (e.g., "my kid" → "the child").
- Assess the child's current situation and suggest key areas for improvement.
- Recommend **five** specific activities tailored to the child's interests and challenges, **providing guidance on how parents can facilitate these activities.**
- Present each activity in the format: **"Activity Name / Description (with parental guidance) / Expected Benefits."**
- Ensure the activities are practical and easy to implement in daily life.
- Maintain a **warm, supportive, and informative tone** while showing respect for the parent's concerns.
- **Respond in Korean.**

### Response Format
{chat_history}
Parent: {input}
Nomi:
{context}
현재 상황 분석
[문서 기반 분석 내용 요약]
- (문서에서 참고한 내용 요약)

[자녀의 상황]
- (자녀의 현재 문제 또는 필요한 변화 방향)

추천 활동 5가지 
활동명: 함께 하는 설거지 시간 ✨ (부모님 가이드: 칭찬과 격려를 아끼지 마세요!)
설명: 가족 식사 후에 자녀와 함께 설거지지를 하면서 책임감을 길러주세요. 부모님께서는 옆에서 칭찬과 격려를 통해 자녀가 성취감을 느끼도록 도와주시면 좋습니다. 😊
기대 효과: 성취감 증가, 가족과의 긍정적인 상호작용 증진
{...}

결론 및 조언
자녀의 관심사와 성향을 고려하여, 위 활동들을 가정에서 실천해 보세요. 억지로 강요하기보다는, 칭찬과 격려를 통해 자녀가 스스로 참여하고 즐거움을 느낄 수 있도록 지지해 주시는 것이 중요합니다. 부모님의 따뜻한 관심과 지지는 자녀의 건강한 성장에 큰 힘이 될 것입니다. 👍
"""

NORMAL_SYSTEM_PROMPT = """
You are "노미" who an expert in adolescent behavior change, specializing in guiding parents of 10-15-year-olds. Generate an informed response while following these guidelines
### Response Guidelines
- Adjust the wording naturally in your response (e.g., "my kid" → "the child").
- Maintain a **warm, supportive, and informative tone** while showing respect for the parent's concerns.
- **Respond in Korean.**
{chat_history}
Parent: {input}
Nomi:
{context}
"""

class RAG_Chatbot:
    def __init__(
        self,
        embeddings_model_name="paraphrase-multilingual-mpnet-base-v2",
        folder_path="./data/crawled_data",
        vectordb_type="chroma",  # vectordb_type 파라미터 추가
        max_tokens=1024,
        openai_model_name="gpt-3.5-turbo-instruct"  # OpenAI 모델 이름 추가
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
        self.chat_model = ChatOpenAI(model_name="gpt-4o")
        self.llm = OpenAI(model_name=openai_model_name, max_tokens=max_tokens)  # OpenAI 모델 지정
        self.memory = ConversationBufferMemory(memory_key="chat_history", k=5)  # 대화 기록 메모리 초기화
        self.prompt = PromptTemplate(
            input_variables=["chat_history", "input", "context"], template=SYSTEM_PROMPT
        )
        self.normal_prompt = PromptTemplate(
            input_variables=["chat_history", "input", "context"], template=NORMAL_SYSTEM_PROMPT
        )
        

    @staticmethod
    def _update_prompt(prompt: str) -> str:
        """프롬프트를 업데이트합니다.

        Args:
            prompt (str): 업데이트할 프롬프트.

        Returns:
            str: 업데이트된 프롬프트.
        """
        global SYSTEM_PROMPT
        SYSTEM_PROMPT = prompt
        return SYSTEM_PROMPT
    
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

    def get_chat(self, query: str) -> str:
        # retriever = self.vectordb.as_retriever(search_kwargs={"k": 5})
        docs_and_scores = self.vectordb.similarity_search_with_score(query, k=3)
        source_documents = [doc.page_content for doc, _ in docs_and_scores]
        similarities = [1 / (score + 1) for _, score in docs_and_scores]
        context = "\n".join(source_documents) if source_documents else ""

        print("=== Memory Contents ===")
        print(self.memory.load_memory_variables({}))
        print("=======================")

        print(similarities)

        memory_variables = self.memory.load_memory_variables({})
        chat_history = memory_variables.get("chat_history", "no caht")  # chat_history가 없을 경우 빈 문자열 사용
        print('chat_history', chat_history)

        print(self.prompt)

        # 임계값을 넘지 못하거나 source를 찾지 못했을 때
        if max(similarities) < 0.1 or not source_documents:
            print('일반적인 대답')
            final_prompt = self.prompt.format(input=query, chat_history=chat_history, context="no context")
        else:
            print('RAG 대답')
            final_prompt = self.prompt.format(input=query, chat_history=chat_history, context=context)
        
        result = self.chat_model.predict(final_prompt)
        self.memory.save_context({"input": query}, {"output": result})  # 메모리 업데이트
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