import fitz
import os
import nltk
import re
import numpy as np
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def extract_text_from_pdf(path: str) -> str:
    try:
        doc = fitz.open(path)
        return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def preprocess_text(text: str) -> str:
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text)
    tokens = [t.lower() for t in tokens if t.isalpha() and t.lower() not in stop_words]
    tokens = [lemmatizer.lemmatize(token, pos='v') for token in tokens]
    return ' '.join(tokens)

def extract_qa_pairs(text: str):
    """
    Extracts QA pairs like: '2. Why we use Python?' followed by an answer, 
    until the next question line (starting with number dot).
    """
    pattern = r"(\d{1,3}\.\s+[^\n?]+\?)\s+([^0-9]+\s*)"
    matches = re.findall(pattern, text)
    cleaned_matches = []
    
    for q, a in matches:
        # stop answer at next question manually
        lines = a.strip().splitlines()
        cleaned_answer = []
        for line in lines:
            if re.match(r"^\d{1,3}\.\s+", line.strip()):
                break
            cleaned_answer.append(line)
        cleaned_matches.append((q.strip(), '\n'.join(cleaned_answer).strip()))
        
    return cleaned_matches

def answer_question(question: str, filename: str) -> str:
    try:
        filepath = os.path.join("uploads", filename)
        if not os.path.exists(filepath):
            raise FileNotFoundError("PDF file not found.")

        text = extract_text_from_pdf(filepath)
        qa_pairs = extract_qa_pairs(text)

        if not qa_pairs:
            return "❗ No Q&A pairs found in the document."

        questions = [preprocess_text(q) for q, _ in qa_pairs]
        vectorizer = TfidfVectorizer()
        question_vectors = vectorizer.fit_transform(questions)

        preprocessed_question = preprocess_text(question)
        question_vector = vectorizer.transform([preprocessed_question])

        scores = cosine_similarity(question_vector, question_vectors).flatten()
        top_idx = np.argmax(scores)
        top_score = scores[top_idx]

        if top_score < 0.3:
            return "❗ No relevant answer found for your question."

        top_q, top_a = qa_pairs[top_idx]
        return f"\n{top_a.strip()}"

    except Exception as e:
        return f"❌ Error: {str(e)}"
