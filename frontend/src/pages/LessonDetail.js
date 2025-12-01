// frontend/src/pages/LessonDetail.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLessons, assessPronunciation } from "../api/api";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [score, setScore] = useState(null);
  const recorderRef = useRef(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    getLessons().then(list => {
      const found = list.find(l => l.id === id);
      setLesson(found);
    }).catch(()=>{});
  }, [id]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    recorderRef.current = { mediaRecorder, chunks: [] };
    mediaRecorder.ondataavailable = (e) => recorderRef.current.chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(recorderRef.current.chunks, { type: "audio/wav" });
      const res = await assessPronunciation(lesson?.text || " ", blob);
      setScore(res);
    };
    mediaRecorder.start();
    setRecording(true);
    setTimeout(()=>{ mediaRecorder.stop(); setRecording(false); }, 3000);
  };

  if (!lesson) return <h2>Loading...</h2>;

  return (
    <Box p={3}>
      <Typography variant="h4">{lesson.title}</Typography>
      <Typography variant="body1" mt={2}>{lesson.text}</Typography>

      {lesson.audio_url && <Button variant="contained" sx={{ mt:2 }} onClick={()=>new Audio(lesson.audio_url).play()}>🔊 Play Audio</Button>}

      <Button variant="outlined" sx={{ mt:3 }} disabled={recording} onClick={startRecording}>
        🎤 {recording ? "Recording..." : "Record Pronunciation"}
      </Button>

      {score && (
        <Card sx={{ mt:3 }}>
          <CardContent>
            <Typography variant="h5">Score: {score.score}</Typography>
            <Typography variant="body2" mt={1}>Semantic: {score.breakdown.semantic}</Typography>
            <Typography variant="body2">Edit Distance: {score.breakdown.edit}</Typography>
            <Typography variant="body2" mt={1}>Transcribed: {score.transcribed}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LessonDetail;
