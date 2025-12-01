// frontend/src/api/api.js
const API_BASE = "http://127.0.0.1:8000";

const BASE_URL = "http://127.0.0.1:8000/api";

export const fetchLessons = async () => {
  const res = await fetch(`${BASE_URL}/lessons/`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return await res.json();
};


export async function getLessons() {
  const res = await fetch(`${API_BASE}/api/lessons/`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return await res.json();
}

export async function createLesson(data) {
  const res = await fetch(`${API_BASE}/api/lessons/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload/audio`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

export async function assessPronunciation(sentence, audioBlob) {
  const formData = new FormData();
  formData.append("sentence", sentence);
  formData.append("file", audioBlob, "audio.wav");
  const res = await fetch(`${API_BASE}/api/assess/`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

export async function saveProgress(payload) {
  const res = await fetch(`${API_BASE}/api/progress/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function getProgress(userId) {
  const res = await fetch(`${API_BASE}/api/progress/${userId}`);
  return await res.json();
}

export async function deleteLesson(id) {
  const res = await fetch(`${API_BASE}/api/lessons/${id}`, { method: "DELETE" });
  return await res.json();
}
