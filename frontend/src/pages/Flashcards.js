import React, { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import vocabularyList from "../data/vocabulary";

function Flashcards() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % vocabularyList.length);
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
            </>
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {showAnswer ? "Hide" : "Show Meaning"}
      </Button>

      <br />

      <Button
        variant="contained"
        style={{ marginTop: "10px" }}
        onClick={nextCard}
      >
        Next Card
      </Button>
    </div>
  );
}

export default Flashcards;
