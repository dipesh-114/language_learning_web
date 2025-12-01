// frontend/src/pages/Admin.js
import React, { useEffect, useState } from "react";
import { createLesson, uploadAudio, getLessons, deleteLesson } from "../api/api";
import { Card, CardContent, Typography, Button, Box, TextField, Select, MenuItem } from "@mui/material";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [lessons, setLessons] = useState([]);
  const [language, setLanguage] = useState("Japanese");
  const [difficulty, setDifficulty] = useState("Beginner");

  useEffect(()=>{ loadLessons(); }, []);

  const loadLessons = () => { getLessons().then(setLessons).catch(()=>{}); };

  const handleUploadAudio = async () => {
    if (!audioFile) return alert("Select an audio file");
    const res = await uploadAudio(audioFile);
    if (res?.url) setAudioURL(res.url);
    else alert("Upload failed");
  };

  const handleCreateLesson = async () => {
    if (!title || !text) return alert("Please fill fields");
    await createLesson({ title, text, audio_url: audioURL, language, difficulty });
    setTitle(""); setText(""); setAudioFile(null); setAudioURL("");
    loadLessons();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Admin Panel</Typography>
      <Card sx={{ p:3, mb:4 }}>
        <Typography variant="h5" mb={2}>Add Lesson</Typography>
        <TextField label="Lesson Title" fullWidth value={title} onChange={(e)=>setTitle(e.target.value)} sx={{ mb:2 }} />
        <TextField label="Lesson Text" fullWidth multiline rows={4} value={text} onChange={(e)=>setText(e.target.value)} sx={{ mb:2 }} />
        <Select fullWidth value={language} onChange={(e)=>setLanguage(e.target.value)} sx={{ mb:2 }}>
          <MenuItem value="Japanese">Japanese</MenuItem>
          <MenuItem value="English">English</MenuItem>
        </Select>
        <Select fullWidth value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} sx={{ mb:2 }}>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
        <input type="file" accept="audio/*" onChange={(e)=>setAudioFile(e.target.files[0])} />
        <Button variant="outlined" sx={{ mt:1 }} onClick={handleUploadAudio}>Upload Audio</Button>
        {audioURL && <Typography variant="body2" color="green">Audio Uploaded ✔</Typography>}
        <Button variant="contained" sx={{ mt:2 }} onClick={handleCreateLesson}>Save Lesson</Button>
      </Card>

      <Typography variant="h5">Existing Lessons</Typography>
      {lessons.map((lesson) => (
        <Card key={lesson.id} sx={{ mb:2 }}>
          <CardContent>
            <Typography variant="h6">{lesson.title}</Typography>
            <Typography variant="body2" mb={1}>{(lesson.text || "").slice(0,80)}...</Typography>
            <Button variant="outlined" color="error" onClick={() => deleteLesson(lesson.id).then(loadLessons)}>Delete</Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Admin;
