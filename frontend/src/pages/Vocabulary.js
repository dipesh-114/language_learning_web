// frontend/src/pages/Vocabulary.js
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import vocabularyList from "../data/vocabulary";
import AudioButton from "../components/AudioButton";

function Vocabulary() {
  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Vocabulary List</Typography>
      {vocabularyList.map((word) => (
        <Card key={word.id} style={{ marginBottom: "15px" }}>
          <CardContent>
            <Typography variant="h6">{word.word}</Typography>
            <Typography>Japanese: {word.meaning}</Typography>
            <AudioButton audioSrc={word.audio} text={word.meaning} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Vocabulary;
