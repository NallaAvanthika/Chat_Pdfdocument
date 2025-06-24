import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.db.database import Document
from app.services.qa_engine import answer_question
import os

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File Upload Endpoint
@app.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    os.makedirs("uploads", exist_ok=True)
    file_location = os.path.join("uploads", file.filename)

    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Save to DB
    db_document = Document(filename=file.filename)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    return {"id": db_document.id, "filename": db_document.filename}

# Ask Question Endpoint
@app.get("/ask/")
def ask_question(
    question: str = Query(...),
    filename: str = Query(...),
    db: Session = Depends(get_db)
):
    try:
        answer = answer_question(question, filename)
        return {"answer": answer}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Global Error Handler
@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )
