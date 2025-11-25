# main.py
import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil, uuid
import whisper
from sentence_transformers import SentenceTransformer, util
from difflib import SequenceMatcher
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://11_user:<Dipesh22>@language-learning.daakxk2.mongodb.net/")
DB_NAME = os.getenv("DB_NAME", "language_learning")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

app = FastAPI(title="Language Learning Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # only for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Whisper model... (may take time on first run)")
whisper_model = whisper.load_model("small")  # "small" balances speed & accuracy; change to "tiny" for faster

print("Loading SBERT model...")
sbert = SentenceTransformer('all-MiniLM-L6-v2')

# ---------- Pydantic models ----------
class Lesson(BaseModel):
    language: str
    title: str
    text: str
    audio_url: str = ""
    difficulty: str = "Beginner"

# ---------- Helpers ----------
def save_upload_file_tmp(upload_file: UploadFile) -> str:
    suffix = os.path.splitext(upload_file.filename)[1]
    tmp_filename = f"tmp_{uuid.uuid4().hex}{suffix}"
    with open(tmp_filename, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return tmp_filename

def transcribe_audio(path):
    result = whisper_model.transcribe(path, language=None)  # let whisper detect language
    text = result.get("text", "").strip()
    return text

def edit_similarity_score(ref, hyp):
    s = SequenceMatcher(None, ref.lower(), hyp.lower()).ratio()
    return s

def semantic_similarity(ref, hyp):
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
        # Save attempt to DB
        attempt = {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "sentence": sentence,
            "transcribed": transcribed,
            "score": score,
            "breakdown": breakdown
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
