import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { vocabulary } from "../data/vocabulary";
import { speakJapanese } from "../utils/speech";
import { fetchImage } from "../utils/fetchImage";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  // Load question and options
  useEffect(() => {
    if (index >= vocabulary.length) return;

    const q = vocabulary[index];
    setQuestion(q);

    // Reset states
    setSelected(null);
    setShowAnswer(false);
    setFetchedImage(null);

    // Generate 4 options: correct + 3 wrong
    let wrongOptions = vocabulary
      .filter((v) => v.meaning !== q.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.meaning);

    const allOptions = [...wrongOptions, q.meaning].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    // Load image if it's an image question
    if (q.type === "image") {
      setLoadingImage(true);
      fetchImage(q.word).then((url) => {
        setFetchedImage(url);
        setLoadingImage(false);
      });
    }
  }, [index]);

  if (index >= vocabulary.length) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" color="primary">
          Quiz Completed 🎉
        </Typography>
        <Typography variant="h5" mt={2}>
          Your Score: {score} / {vocabulary.length}
        </Typography>
      </Box>
    );
  }

  if (!question) return <h2>Loading question...</h2>;

  const handleAnswer = (value) => {
    setSelected(value);
    setShowAnswer(true);

    if (value === question.meaning) setScore(score + 1);

    setTimeout(() => {
      setSelected(null);
      setShowAnswer(false);
      setIndex(index + 1);
    }, 1500); // delay so user sees the correct answer
  };

  return (
    <Box sx={{ maxWidth: 550, margin: "auto", mt: 5, padding: 3, textAlign: "center" }}>
      <Typography variant="h5" mb={3}>
        Question {index + 1} / {vocabulary.length}
      </Typography>

      {/* IMAGE QUESTION */}
      {question.type === "image" && (
        <>
          {loadingImage ? (
            <Typography variant="h6" color="text.secondary" mb={2}>
              Loading image...
            </Typography>
          ) : (
            fetchedImage && (
              <img
                src={fetchedImage}
                alt={question.word}
                style={{ width: "220px", height: "180px", borderRadius: "12px", objectFit: "cover", marginBottom: "15px" }}
              />
            )
          )}
        </>
      )}

      {/* AUDIO QUESTION */}
      {question.type === "audio" && (
        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => {
            const audio = new Audio(question.audio);
            audio.play();
          }}
        >
          🔊 Play Audio
        </Button>
      )}

      {/* TEXT QUESTION */}
      {question.type === "text" && (
        <Typography variant="h4" mb={3}>
          {question.word}
        </Typography>
      )}

      {/* OPTIONS */}
      <Box>
        {options.map((option, i) => (
          <Button
            key={i}
            fullWidth
            variant="contained"
            sx={{
              my: 1,
              background:
                selected === option
                  ? option === question.meaning
                    ? "green"
                    : "red"
                  : "primary.main",
            }}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </Box>

      {/* Show Correct Answer */}
      {showAnswer && (
        <Box mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
          <Typography variant="subtitle1">Correct Answer: {question.meaning}</Typography>

          {question.type === "image" && fetchedImage && (
            <img src={fetchedImage} alt={question.word} style={{ width: 180, height: 140, marginTop: 10, borderRadius: 8 }} />
          )}

          {question.type === "audio" && (
            <Button variant="contained" sx={{ mt: 1 }} onClick={() => new Audio(question.audio).play()}>
              🔊 Play Audio
            </Button>
          )}

          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => speakJapanese(question.meaning)}>
            🔈 Pronounce Japanese
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Quiz;
