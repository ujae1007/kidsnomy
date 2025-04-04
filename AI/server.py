from fastapi import FastAPI

from rag.rag import RAG_Chatbot
from report import report

chatbot = RAG_Chatbot()
app = FastAPI()

@app.post("/api/chat")
async def chat(message: str) -> str:
    response = chatbot.get_chat(message)
    return {"response": response}

# api/report/finance
@app.post("api/report/finance")
async def chat(data: str) -> str:
    weekly_transactions = data["weeklyTransactions"]

    expense_statics = report.ExpenseStatics(weekly_transactions)
    week_expense, category_total_expense = expense_statics.category_expense()
    print(week_expense, category_total_expense)
    # week_expense
    # [500000.0, 500000.0, 250000.0, 500000.0, 0]
    # category_total
    # defaultdict(<class 'int'>, {'카페/간식': 250000.0, '취미': 250000.0})

    return_data = {
        "weekExpense": {
            "week1": week_expense[0],
            "week2": week_expense[1],
            "week3": week_expense[2],
            "week4": week_expense[3],
            "week5": week_expense[4],
        },
        "totalExpense": category_total_expense,
    }

    return {"response": return_data}