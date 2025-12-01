# main.py
import os
import shutil
import uuid
from datetime import datetime, timedelta

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from difflib import SequenceMatcher
from dotenv import load_dotenv

import whisper
from sentence_transformers import SentenceTransformer, util
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import jwt

# ---------------- Load env ----------------
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME = os.getenv("DB_NAME", "language_learning")
SECRET_KEY = os.getenv("SECRET_KEY", "Dipesh22@")
JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", "86400"))  # default 1 day
ALGORITHM = "HS256"


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------- User Models ----------
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# ---------- Helpers ----------
def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_jwt(data: dict, expires_minutes=60):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ---------- AUTH ROUTES ----------
@app.post("/api/auth/register")
async def register_user(user: UserRegister):
    # check if email exists
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw
    }
    db.users.insert_one(new_user)

    return {"message": "User registered successfully"}

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_jwt({"user_id": str(db_user["_id"]), "email": db_user["email"]})

    return {
        "message": "Login successful",
        "token": token,
        "name": db_user["name"]
    }


# ---------------- DB ----------------
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ---------------- FastAPI ----------------
app = FastAPI(title="Language Learning Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Models & Security ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Lesson(BaseModel):
    language: str
    title: str
    text: str
    audio_url: str = ""
    difficulty: str = "Beginner"

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str

# ---------------- Load AI Models (Whisper + SBERT) ----------------
print("Loading Whisper model... (may take time on first run)")
whisper_model = whisper.load_model("small")  # change to tiny for speed if needed

print("Loading SBERT model...")
sbert = SentenceTransformer('all-MiniLM-L6-v2')

# ---------------- Helper functions ----------------
def save_upload_file_tmp(upload_file: UploadFile) -> str:
    suffix = os.path.splitext(upload_file.filename)[1]
    tmp_filename = f"tmp_{uuid.uuid4().hex}{suffix}"
    with open(tmp_filename, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return tmp_filename

def transcribe_audio(path):
    result = whisper_model.transcribe(path, language=None)
    return result.get("text", "").strip()

def edit_similarity_score(ref, hyp):
    s = SequenceMatcher(None, (ref or "").lower(), (hyp or "").lower()).ratio()
    return s

def semantic_similarity(ref, hyp):
    if not ref or not hyp:
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

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=(expires_delta or JWT_EXP_SECONDS))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return token

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalid")

# Dependency to get current user from Authorization: Bearer <token>
def get_current_user(token: str = Depends(lambda: None)):
    # Note: FastAPI standard pattern is to use OAuth2PasswordBearer; here we keep it simple.
    # We'll accept token via query param for quick testing OR Authorization header.
    # In production, use OAuth2PasswordBearer and proper header parsing.
    raise HTTPException(status_code=400, detail="Use get_current_user_with_header in actual requests")

from fastapi import Header
def get_current_user_with_header(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth scheme")
    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    # payload should contain 'user_id' and 'email'
    user = db.users.find_one({"_id": payload.get("user_id")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user_out = {"id": str(user["_id"]), "name": user.get("name"), "email": user.get("email")}
    return user_out

# ---------------- Routes: User Auth ----------------
@app.post("/api/users/register")
def register_user(body: UserRegister):
    existing = db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(body.password)
    doc = {"name": body.name, "email": body.email, "password": hashed, "created_at": datetime.utcnow()}
    res = db.users.insert_one(doc)
    return {"id": str(res.inserted_id), "email": body.email}

@app.post("/api/users/login")
def login_user(email: str = Form(...), password: str = Form(...)):
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/users/me")
def users_me(current_user: dict = Depends(get_current_user_with_header)):
    return current_user

# ---------------- Routes: Lessons & Attempts ----------------
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
        # Save attempt to DB with metadata
        attempt = {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "sentence": sentence,
            "transcribed": transcribed,
            "score": score,
            "breakdown": breakdown,
            "created_at": datetime.utcnow()
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

@app.get("/api/attempts/")
def list_attempts(user_id: str = None, lesson_id: str = None):
    q = {}
    if user_id:
        q["user_id"] = user_id
    if lesson_id:
        q["lesson_id"] = lesson_id
    docs = list(db.attempts.find(q).sort("created_at", -1).limit(200))
    out = []
    for d in docs:
        d["id"] = str(d["_id"])
        d.pop("_id", None)
        out.append(d)
    return out

@app.get("/api/progress/{user_id}")
def user_progress(user_id: str):
    docs = list(db.attempts.find({"user_id": user_id}))
    if not docs:
        return {"user_id": user_id, "attempts": 0, "average_score": 0.0}
    scores = [d.get("score", 0) for d in docs]
    avg = sum(scores) / len(scores)
    return {"user_id": user_id, "attempts": len(scores), "average_score": round(avg,2)}

# ---------------- Simple health ----------------
@app.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}
