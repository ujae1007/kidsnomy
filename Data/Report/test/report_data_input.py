import json
from Payment import payment as p
import os
from pprint import pprint
import requests
import json
from datetime import datetime
import random
import time

USER_KEY = "32f154ed-f444-41ab-a073-c292e61565cf"
ACCOUNT_NO = "9994364739163546"
FIN_BASE_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/"
ACCOUNT_URL = FIN_BASE_URL + "edu/demandDeposit/"
API_KEY = os.getenv("FIN_API_KEY")


pay = p.Payment(user_key=USER_KEY)

def generate_header(api_key, api_name, user_key=None):
    """현재 시간을 적용하여 헤더를 생성합니다."""
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

def account_deposit():
    # 계좌 입금

    payload = {
        "Header": generate_header(API_KEY, 'updateDemandDepositAccountDeposit', user_key=USER_KEY)['Header'],
        "accountNo": ACCOUNT_NO,
        "transactionBalance": 1_000_000,
        "transactionSummary": "입금"
    }

    account_update_response = requests.post(
        ACCOUNT_URL + "updateDemandDepositAccountDeposit",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )

    pprint(f"응답 코드: {account_update_response.status_code}")
    pprint(f"응답 내용: {account_update_response.json()}")

    # 계좌 잔액 조회
    payload = {
        "Header": generate_header(API_KEY, 'inquireDemandDepositAccountBalance', user_key=USER_KEY)['Header'],
        "accountNo": ACCOUNT_NO,
    }

    account_balance_response = requests.post(
        ACCOUNT_URL + "inquireDemandDepositAccountBalance",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    print("계좌 잔액 조회")
    pprint(f"응답 코드: {account_balance_response.status_code}")
    pprint(f"응답 내용: {account_balance_response.json()}")

def payment_log(cnt):
    """
    cnt 개수 만큼 결제 내역 넣는 함수
    """

    with open(f"./expense/data_with_meta.json", "r", encoding="utf-8") as f:
        data = json.load(f)["total_data"]

    for item in range(cnt):
        random_num = random.randint(0, len(data))
        pay.pay(ACCOUNT_NO, data[random_num]['price'], data[random_num]['place_name'], data[random_num]['road_address_name'])
        time.sleep(5)

if __name__ == "__main__":
    ## 입금
    # account_deposit()
    
    ## 결제
    input_data_num = 3
    payment_log(input_data_num)

    ## 계좌 조회
    start_date = "20250301"
    end_date = datetime.now().strftime("%Y%m%d")
    transaction_type = "A"
    order_by_type = "DESC"
    pprint(pay.get_transaction_history(ACCOUNT_NO, start_date, end_date, transaction_type, order_by_type))


