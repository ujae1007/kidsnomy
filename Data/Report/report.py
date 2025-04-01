'''
소비 리포트 분석
1. 이번 주 소비 (지난 주와 비교)
2. 사용자 평균 소비 비율 비교
3. 결제 내역 api를 긁어와서 소비 내역 카테고리 분류 및 합산
'''

'''
결제 내역 api 구조

"Header": {
        "responseCode": "H0000",
        "responseMessage": "정상처리 되었습니다.",
        "apiName": "inquireTransactionHistoryList",
        "transmissionDate": "20250331",
        "transmissionTime": "141703",
        "institutionCode": "00100",
        "apiKey": "265a24cbda3049959c697baf14f51154",
        "apiServiceCode": "inquireTransactionHistoryList",
        "institutionTransactionUniqueNo": "20250331141703999999"
    },
    "REC": {
        "totalCount": "6",
        "list": [
            {
                "transactionUniqueNo": "85085",
                "transactionDate": "20250326",
                "transactionTime": "172109",
                "transactionType": "2",
                "transactionTypeName": "출금",
                "transactionAccountNo": "",
                "transactionBalance": "1000",
                "transactionAfterBalance": "995000",
                "transactionSummary": "CU, 서울시 강남구",
                "transactionMemo": ""
            },
        ]
    }

'''
import json

file_path = f"./expense/data.json"
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data['REC']['list']