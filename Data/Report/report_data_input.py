import json
from Payment import payment as p
import os
from pprint import pprint

'''
사용자 계정에 결제 내역 데이터 넣는 함수
payment.pay(account_no, 1000, "CU", "서울시 강남구")
'''
def check_pay_list(pay, account_no, start_date="20250301", end_date="20250331", transaction_type="A", order_by_type="DESC"):
    return pay.get_transaction_history(account_no, start_date, end_date, transaction_type, order_by_type)

def put_info(pay, user_key, account_no, start_date="20250301", end_date="20250331", transaction_type="A", order_by_type="DESC"):
    data = check_pay_list(pay, account_no, start_date, end_date, transaction_type, order_by_type)
    pay_list = data['REC']['list']
    pprint(pay_list)




if __name__ == "__main__":
    user_key = os.getenv("TEST_USER_KEY")
    account_no = os.getenv("TEST_ACCOUNT_NO")
    pay = p.Payment(user_key=user_key)
    # pprint(check_pay_list(pay, account_no))
    put_info(pay, account_no, account_no)
