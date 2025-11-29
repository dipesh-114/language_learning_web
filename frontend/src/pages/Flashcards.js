import React, { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import vocabularyList from "../data/vocabulary";
import AudioButton from "../components/AudioButton";

function Flashcards() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % vocabularyList.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev - 1 + vocabularyList.length) % vocabularyList.length);
  };

  const currentWord = vocabularyList[index];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Flashcards
      </Typography>

      <Card style={{ margin: "0 auto", maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h5">{currentWord.english}</Typography>

          {showAnswer && (
            <>
              <Typography>Japanese: {currentWord.japanese}</Typography>
              <Typography>Romaji: {currentWord.romaji}</Typography>
              <AudioButton audioSrc={currentWord.audio} />
            </>
          )}
        </CardContent>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Button variant="contained" color="primary" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "Hide" : "Show Meaning"}
        </Button>
      </div>

      <div style={{ marginTop: 12 }}>
        <Button variant="contained" style={{ marginRight: 8 }} onClick={prevCard}>
          Previous
        </Button>
        <Button variant="contained" onClick={nextCard}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default Flashcards;
