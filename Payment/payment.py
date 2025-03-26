import os
import json
import dotenv
import requests

from datetime import datetime

# .env 파일 로드
dotenv.load_dotenv()

# 변수 선언
API_KEY = os.getenv("FIN_API_KEY")
FIN_BASE_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/"
USER_URL = FIN_BASE_URL + "member/"
ACCOUNT_URL = FIN_BASE_URL + "edu/demandDeposit/"
PAYMENT_URL = ACCOUNT_URL + "updateDemandDepositAccountWithdrawal"

# user_key, balance -> 결제
class Payment:
    """user_key에 해당하는 user의 결제를 담당하는 클래스
    """

    def __init__(self, user_key):
        self.user_key = user_key
    
    @staticmethod
    def _generate_header(api_key: str, api_name: str, user_key: str = None) -> dict:
        """header 생성 함수

        Args:
            api_key (str): 금융 API 키
            api_name (str): 호출할 API 이름
            user_key (str, optional): user key. Defaults to None.

        Returns:
            dict: 생성된 header
        """
        now = datetime.now()
        transmission_date = now.strftime("%Y%m%d")
        transmission_time = now.strftime("%H%M%S")

        header = {
            "Header": {
                "apiName": api_name,
                "transmissionDate": transmission_date,
                "transmissionTime": transmission_time,
                "institutionCode": "00100",
                "fintechAppNo": "001",
                "apiServiceCode": api_name,
                "institutionTransactionUniqueNo": f"{transmission_date}{transmission_time}999999",
                "apiKey": api_key,
                "userKey": user_key
            }
        }
        return header

    # 결제 함수
    def pay(self, account_no: str, balance: int, store: str, store_address: str) -> dict:
        """account_no 계좌에서 balance만큼 결제하는 함수

        Args:
            account_no (int): 계좌 번호
            balance (int): 결제 금액
            store (srt): 가게 이름
            store_address (srt): 가게 주소

        Returns:
            dict: 결제 결과
        """

        payload = {
            "Header": self._generate_header(API_KEY, 'updateDemandDepositAccountWithdrawal', user_key=self.user_key)['Header'],
            "transactionBalance": balance,
            "transactionSummary": f"{store}, {store_address}",
            "accountNo": account_no
        }

        payment_response = requests.post(
            PAYMENT_URL,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )

        return payment_response.json()
    
    # 거래 내역 조회 함수
    def get_transaction_history(self, account_no: str, start_date: str, end_date: str, transaction_type: str, order_by_type:str) -> dict:
        """해당 계좌의 거래 내역을 조회하는 함수

        Args:
            account_no (int): 계좌번호
            start_date (str): 검색 시작 날짜
            end_date (str): 검색 종료 날짜
            transaction_type (str): 거래 유형
            order_by_type (str): 정렬 유형형

        Returns:
            dict: _description_
        """
        payload = {
            "Header": self._generate_header(API_KEY, 'inquireTransactionHistoryList', user_key=self.user_key)['Header'],
            "accountNo": account_no,
            "startDate": start_date,
            "endDate": end_date,
            "transactionType": transaction_type,
            "orderByType": order_by_type
        }

        account_history_response = requests.post(
            ACCOUNT_URL + "inquireTransactionHistoryList",
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )

        return account_history_response.json()

if __name__ == "__main__":
    from pprint import pprint

    # test 변수 선언
    user_key = os.getenv("TEST_USER_KEY")
    account_no = os.getenv("TEST_ACCOUNT_NO")
    print(account_no)
    start_date, end_date = "20250301", "20250331"
    payment = Payment(user_key=user_key)
    print("결제 결과")
    pprint(payment.pay(account_no, 1000, "CU", "서울시 강남구"))
    print("거래 내역 조회 결과")
    pprint(payment.get_transaction_history(account_no, start_date, end_date, "A", "DESC"))