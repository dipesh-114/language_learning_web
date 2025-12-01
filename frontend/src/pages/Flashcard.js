import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { vocabulary } from "../data/vocabulary";

const Flashcard = () => {
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const card = vocabulary[index];

  const handleNext = () => {
    setShowMeaning(false);
    setIndex((prev) => (prev + 1) % vocabulary.length);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, textAlign: "center" }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h5">{card.word}</Typography>
          {showMeaning && (
            <Typography variant="subtitle1" mt={2}>
              {card.meaning}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => setShowMeaning(!showMeaning)}
          >
            {showMeaning ? "Hide Meaning" : "Show Meaning"}
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 2, ml: 1 }}
            onClick={handleNext}
          >
            Next Card
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Flashcard;
