from fastapi import FastAPI, HTTPException, Body, Request
from pydantic import BaseModel
from typing import List, Dict, Optional
from collections import defaultdict

from rag_func.rag import RAG_Chatbot
from report_func.report import ExpenseStatics

chatbot = RAG_Chatbot()
app = FastAPI()


# Pydantic 모델 정의 (입력 데이터)
class Transaction(BaseModel):
    transactionDate: str
    transactionType: int  # 1: 입금, 2: 출금
    transactionBalance: float
    transactionSummary: str


class InputData(BaseModel):
    accountNo: str
    weeklyTransactions: Dict[str, List[Transaction]]


# class InputData(BaseModel):
#     weeklyTransactions: WeeklyTransactions


# Pydantic 모델 정의 (출력 데이터)
class WeekExpense(BaseModel):
    week1: float = 0.0
    week2: float = 0.0
    week3: float = 0.0
    week4: float = 0.0
    week5: float = 0.0


class TotalExpense(BaseModel):
    교육: float = 0.0
    의료: float = 0.0
    취미: float = 0.0
    식비: float = 0.0
    카페_간식: float = 0.0
    쇼핑: float = 0.0
    문구: float = 0.0
    미용: float = 0.0
    문화: float = 0.0
    도서: float = 0.0
    생활: float = 0.0
    교통: float = 0.0


class OutputData(BaseModel):
    weekExpense: WeekExpense
    totalExpense: TotalExpense

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest = Body(...)) -> str:
    print("✅ chat data:", request.message)
    response = chatbot.get_chat(request.message)
    print(response)
    return response


# FastAPI 엔드포인트
@app.post("/api/report/finance", response_model=OutputData)
async def generate_finance_report(data: InputData):
    """
    주간 거래 내역을 받아 주간 지출 및 카테고리별 총 지출을 계산합니다.

    Args:
        data: 입력 데이터 (InputData 모델).

    Returns:
        주간 지출 및 카테고리별 총 지출 (OutputData 모델).
    """

    print("Received data:", data,"\n")

    expense_statics = ExpenseStatics(data.weeklyTransactions)

    week_expense, category_total_expense = expense_statics.category_expense()

    print("Category total expense:", week_expense, "\n")
    print("Category total expense:", category_total_expense, "\n")

    # defaultdict를 Pydantic 모델로 변환
    week_expense_data = WeekExpense(
        week1=week_expense[0],
        week2=week_expense[1],
        week3=week_expense[2],
        week4=week_expense[3],
        week5=week_expense[4],
    )
    total_expense_data = TotalExpense(**category_total_expense)

    print("Week expense data:", week_expense_data, "\n")
    print("Total expense data:", total_expense_data, "\n")

    return OutputData(weekExpense=week_expense_data, totalExpense=total_expense_data)
