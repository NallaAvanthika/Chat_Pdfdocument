from fastapi import APIRouter, Query, HTTPException
from app.services.qa_engine import answer_question

router = APIRouter()

@router.get("/ask/")
def ask_question(
    question: str = Query(...),
    filename: str = Query(...),
):
    try:
        answer = answer_question(question, filename)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))