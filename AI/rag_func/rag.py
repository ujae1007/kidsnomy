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

# ... (system_prompt는 그대로 유지)


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

    def _make_vectordb(
        self, chunk_size: int = 500, chunk_overlap: int = 50, batch_size: int = 256
    ):
        """VectorDB를 생성합니다.

        Args:
            chunk_size (int, optional): 청크 크기. Defaults to 500.
            chunk_overlap (int, optional): 청크 오버랩 크기. Defaults to 50.
            batch_size (int, optional): 배치 크기. Defaults to 256.
        """

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
        embeddings: SentenceTransformerEmbeddings,
        persist_directory: str,
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
            if os.path.exists(persist_directory):  # DB가 이미 존재하면
                print(f"ChromaDB가 이미 존재합니다: {persist_directory}")
                return Chroma(
                    persist_directory=persist_directory, embedding_function=embeddings
                )  # 존재하는 DB를 로드하고 반환
            if not texts:
                return None  # 빈 문서 리스트인 경우 None 반환

            db = Chroma.from_documents(
                texts, embeddings, persist_directory=persist_directory
            )  # 초기 ChromaDB 생성
            db.persist()  # 데이터를 디스크에 저장
            return db

        elif self.vectordb_type == "faiss":
            if os.path.exists(persist_directory):  # DB가 이미 존재하면
                print(f"FAISS가 이미 존재합니다: {persist_directory}")
                FAISS.load_local(persist_directory, embeddings)
            if not texts:
                return None  # 빈 문서 리스트인 경우 None 반환

            db = FAISS.from_documents(texts, embeddings)
            FAISS.save_local(persist_directory, embeddings)
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
        result = qa.run(self.system_prompt + query)
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
