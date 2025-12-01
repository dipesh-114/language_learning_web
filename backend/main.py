# backend/main.py
import os
import shutil
import uuid
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from difflib import SequenceMatcher
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "language_learning")

if not MONGO_URI:
    raise Exception("MONGO_URI is not set in .env")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Create uploads folder
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="Language Learning Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Load models (try/except so server still runs if heavy model load fails)
try:
    print("Loading Whisper model... (may take time on first run)")
    import whisper
    whisper_model = whisper.load_model("small")  # adjust to tiny if needed
except Exception as e:
    print("Whisper model failed to load:", e)
    whisper_model = None

try:
    print("Loading SBERT model...")
    sbert = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print("SBERT failed to load:", e)
    sbert = None

# ---------- Pydantic models ----------
class Lesson(BaseModel):
    language: str
    title: str
    text: str
    audio_url: str = ""
    difficulty: str = "Beginner"

# ---------- Helpers ----------
def save_upload_file_tmp(upload_file: UploadFile) -> str:
    suffix = os.path.splitext(upload_file.filename)[1] or ".wav"
    tmp_filename = f"tmp_{uuid.uuid4().hex}{suffix}"
    with open(tmp_filename, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return tmp_filename

def transcribe_audio(path):
    if not whisper_model:
        raise RuntimeError("Whisper model not available on server.")
    result = whisper_model.transcribe(path, language=None)
    text = result.get("text", "").strip()
    return text

def edit_similarity_score(ref, hyp):
    s = SequenceMatcher(None, ref.lower(), hyp.lower()).ratio()
    return s

def semantic_similarity(ref, hyp):
    if not sbert:
        return 0.0
    emb1 = sbert.encode(ref, convert_to_tensor=True)
    emb2 = sbert.encode(hyp, convert_to_tensor=True)
    sim = util.pytorch_cos_sim(emb1, emb2).item()
    return max(0.0, min(1.0, sim))

def compute_pronunciation_score(reference_sentence, transcribed_sentence):
    sem = semantic_similarity(reference_sentence, transcribed_sentence)
    edt = edit_similarity_score(reference_sentence, transcribed_sentence)
    score = (0.6 * sem + 0.4 * edt) * 100.0
    return round(score, 2), {"semantic": round(sem,3), "edit": round(edt,3)}

# ---------- Routes ----------
@app.post("/api/lessons/")
async def create_lesson(lesson: Lesson):
    doc = lesson.dict()
    doc["created_at"] = datetime.utcnow()
    res = db.lessons.insert_one(doc)
    return {"id": str(res.inserted_id)}

@app.get("/api/lessons/")
async def list_lessons(language: str = None):
    q = {}
    if language:
        q["language"] = language
    docs = list(db.lessons.find(q))
    out = []
    for d in docs:
        d["id"] = str(d["_id"])
        d.pop("_id", None)
        out.append(d)
    return out

@app.post("/api/assess/")
async def assess_pronunciation(sentence: str = Form(...), file: UploadFile = File(...), user_id: str = Form(None), lesson_id: str = Form(None)):
    tmp_path = save_upload_file_tmp(file)
    try:
        transcribed = transcribe_audio(tmp_path)
        score, breakdown = compute_pronunciation_score(sentence, transcribed)
        attempt = {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "sentence": sentence,
            "transcribed": transcribed,
            "score": score,
            "breakdown": breakdown,
            "timestamp": datetime.utcnow()
        }
        db.attempts.insert_one(attempt)
        return {"sentence": sentence, "transcribed": transcribed, "score": score, "breakdown": breakdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            os.remove(tmp_path)
        except:
            pass

@app.post("/api/upload/audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        os.makedirs("uploads", exist_ok=True)
        filename = f"audio_{uuid.uuid4().hex}{os.path.splitext(file.filename)[1] or '.wav'}"
        filepath = os.path.join("uploads", filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        url = f"http://127.0.0.1:8000/uploads/{filename}"
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Progress endpoints ----------
@app.post("/api/progress/save")
async def save_progress(data: dict):
    userId = data.get("userId")
    lessonId = data.get("lessonId")
    correct = int(data.get("correct", 0))
    total = int(data.get("total", 0)) or 1
    accuracy = round((correct / total) * 100, 2)
    record = {
        "userId": userId,
        "lessonId": lessonId,
        "correct": correct,
        "incorrect": total - correct,
        "accuracy": accuracy,
        "timestamp": datetime.utcnow()
    }
    db.progress.insert_one(record)
    return {"status": "saved", "accuracy": accuracy}

@app.get("/api/progress/{userId}")
async def get_progress(userId: str):
    result = list(db.progress.find({"userId": userId}, {"_id": 0}))
    return {"progress": result}
