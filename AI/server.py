from fastapi import FastAPI

from rag_func.rag import RAG_Chatbot
from report_func.report import ExpenseStatics

chatbot = RAG_Chatbot()
app = FastAPI()


@app.post("/api/chat")
async def chat(message: str) -> str:
    print("chat data:", message)
    response = chatbot.get_chat(message)
    print("chat response:", response)
    return {"response": response}


# api/report/finance
@app.post("api/report/finance")
async def chat(data: str) -> str:
    print("data값:", data)
    weekly_transactions = data["weeklyTransactions"]

    expense_statics = ExpenseStatics(weekly_transactions)
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

    print("return 값: ", return_data)
    return {"response": return_data}
