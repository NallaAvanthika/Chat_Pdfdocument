import os
from app.services.qa_engine import answer_question

def get_answer_from_document(question: str, filename: str) -> str:
    filepath = os.path.join("uploads", filename)

    if not os.path.exists(filepath):
        raise FileNotFoundError()

    # Call the QA engine to answer the question
    answer = answer_question(question, filename)
    return answer