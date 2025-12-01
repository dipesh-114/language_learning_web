import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import vocabularyList from "../data/vocabulary";

function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Shuffle options
  const getOptions = (correctWord) => {
    let options = [correctWord];
    while (options.length < 4) {
      const randomWord =
        vocabularyList[Math.floor(Math.random() * vocabularyList.length)];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    return shuffleArray(options);
  };

  const shuffleArray = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const word = vocabularyList[questionIndex];
  const options = getOptions(word);

  const handleAnswer = (option) => {
    setSelectedOption(option);

    if (option.japanese === word.japanese) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (questionIndex + 1 < vocabularyList.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setShowResult(true);
      }
      setSelectedOption(null);
    }, 800);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  if (showResult) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h4">Quiz Completed!</Typography>
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          Your Score: {score} / {vocabularyList.length}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={restartQuiz}
        >
          Restart Quiz
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Quiz</Typography>
      <Typography variant="h6" style={{ marginTop: "15px" }}>
        What is the Japanese word for:
      </Typography>

      <Card style={{ marginTop: "10px" }}>
        <CardContent>
          <Typography variant="h5">{word.english}</Typography>
        </CardContent>
      </Card>

      {/* Options */}
      {options.map((option, index) => (
        <Button
          key={index}
          variant="contained"
          style={{
            display: "block",
            marginTop: "15px",
            backgroundColor:
              selectedOption === option
                ? option.japanese === word.japanese
                  ? "green"
                  : "red"
                : "",
          }}
          onClick={() => handleAnswer(option)}
        >
          {option.japanese} ({option.romaji})
        </Button>
      ))}
    </div>
  );
}

export default Quiz;
