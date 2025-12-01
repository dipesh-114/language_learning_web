// frontend/src/pages/Quiz.js
import React, { useState, useEffect } from "react";
import { Button, Typography, Box, LinearProgress } from "@mui/material";
import { vocabulary } from "../data/vocabulary";
import { speakJapanese } from "../utils/speech";
import { fetchImage } from "../utils/fetchImage";
import { saveProgress } from "../api/api";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (index >= vocabulary.length) return;
    const q = vocabulary[index];
    setQuestion(q);
    const wrongOptions = vocabulary.filter(v=>v.meaning !== q.meaning).sort(()=>Math.random()-0.5).slice(0,3).map(v=>v.meaning);
    setOptions([...wrongOptions, q.meaning].sort(()=>Math.random()-0.5));
    setFetchedImage(null);
    if (q.type === "image") {
      setLoadingImage(true);
      fetchImage(q.word).then(url => setFetchedImage(url)).finally(()=>setLoadingImage(false));
    }
  }, [index]);

  if (index >= vocabulary.length) {
    // save progress for demo user
    saveProgress({ userId: "demo-user", lessonId: "quiz-1", correct: score, total: vocabulary.length }).catch(()=>{});
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" color="primary">Quiz Completed 🎉</Typography>
        <Typography variant="h5" mt={2}>Your Score: {score} / {vocabulary.length}</Typography>
      </Box>
    );
  }

  if (!question) return <h2>Loading question...</h2>;

  const handleAnswer = (value) => {
    setSelected(value);
    setShowAnswer(true);
    if (value === question.meaning) setScore(prev => prev + 1);
    setTimeout(()=> {
      setSelected(null);
      setShowAnswer(false);
      setIndex(prev => prev + 1);
    }, 1500);
  };

  const progress = (index / vocabulary.length) * 100;

  return (
    <Box sx={{ maxWidth:550, margin:"auto", mt:5, p:3, textAlign:"center" }}>
      <Box sx={{ width:"100%", mb:2 }}>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2" color="text.secondary" mt={1}>{Math.round(progress)}% completed</Typography>
      </Box>

      <Typography variant="h5" mb={3}>Question {index+1} / {vocabulary.length}</Typography>

      {question.type === "image" && (
        <>
          {loadingImage ? <Typography variant="h6" color="text.secondary" mb={2}>Loading image...</Typography> : fetchedImage && <img src={fetchedImage} alt={question.word} style={{ width:220, height:180, borderRadius:12, objectFit:"cover", marginBottom:15 }} />}
        </>
      )}

      {question.type === "audio" && (
        <Button variant="contained" sx={{ mb:3 }} onClick={()=>new Audio(question.audio).play()}>🔊 Play Audio</Button>
      )}

      {question.type === "text" && (
        <Typography variant="h4" mb={3}>{question.word}</Typography>
      )}

      <Button variant="outlined" sx={{ mb:2 }} onClick={()=>speakJapanese(question.meaning)}>🔈 Pronounce Japanese</Button>

      <Box>
        {options.map((opt, i) => (
          <Button key={i} fullWidth variant="contained" sx={{ my:1, background: selected===opt ? (opt===question.meaning ? "green" : "red") : "primary.main" }} onClick={()=>handleAnswer(opt)}>
            {opt}
          </Button>
        ))}
      </Box>

      {showAnswer && (
        <Box mt={2} p={2} sx={{ border: "1px solid #eee", borderRadius:2 }}>
          <Typography variant="subtitle1">Correct Answer: {question.meaning}</Typography>
          {question.type === "image" && fetchedImage && <img src={fetchedImage} alt="correct" style={{ width:160, height:120, borderRadius:8, marginTop:8 }} />}
          {question.type === "audio" && <Button variant="contained" sx={{ mt:1 }} onClick={()=>new Audio(question.audio).play()}>🔊 Play Audio</Button>}
          <Button variant="outlined" sx={{ mt:1 }} onClick={()=>speakJapanese(question.meaning)}>🔈 Pronounce Japanese</Button>
        </Box>
      )}
    </Box>
  );
};

export default Quiz;
