// frontend/src/pages/Home.js
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Home(){
  return (
    <Box sx={{ p:3 }}>
      <Typography variant="h4" gutterBottom>Welcome</Typography>
      <Typography>Learn English & Japanese with audio, quizzes and pronunciation assessment.</Typography>
    </Box>
  );
}
