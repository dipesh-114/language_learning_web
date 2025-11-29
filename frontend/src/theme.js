// src/theme.js
import { createTheme } from "@mui/material/styles";

// Soft Japanese Theme: light, soft pinks and warm accents
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F48FB1", // soft pink
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFB74D", // warm accent (soft orange)
      contrastText: "#1f1f1f",
    },
    background: {
      default: "#FFF8FA", // very light pink background
      paper: "#ffffff",
    },
    text: {
      primary: "#2b2b2b",
      secondary: "#6b6b6b",
    },
  },
  typography: {
    fontFamily:
      "'Noto Sans JP', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          background:
            "linear-gradient(90deg, rgba(244,143,177,1) 0%, rgba(255,183,77,1) 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 2px 10px rgba(20,20,20,0.06)",
        },
      },
    },
  },
});

export default theme;
