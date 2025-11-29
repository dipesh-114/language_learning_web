import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import vocabularyList from "../data/vocabulary";
import AudioButton from "../components/AudioButton";

function Vocabulary() {
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Vocabulary List
      </Typography>

      {vocabularyList.map((word) => (
        <Card key={word.id} style={{ marginBottom: "15px" }}>
          <CardContent>
            <Typography variant="h6">{word.english}</Typography>
            <Typography>Japanese: {word.japanese}</Typography>
            <Typography>Romaji: {word.romaji}</Typography>
            <AudioButton text={word.japanese} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Vocabulary;
