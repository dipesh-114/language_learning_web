// frontend/src/pages/NotFound.js
import React from "react";
import { Box, Typography } from "@mui/material";

export default function NotFound(){
  return (
    <Box sx={{ p:3, textAlign:"center" }}>
      <Typography variant="h4">404 - Page not found</Typography>
      <Typography>Check the URL or go back home.</Typography>
    </Box>
  );
}
