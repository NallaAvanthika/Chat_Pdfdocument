from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_utils import save_pdf
from app.services.pdf_processor import extract_text_from_pdf

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")

        path = save_pdf(file)
        text = extract_text_from_pdf(path)

        return {"filename": file.filename, "message": "Uploaded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))