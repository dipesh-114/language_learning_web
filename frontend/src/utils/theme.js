// frontend/src/utils/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F48FB1", contrastText: "#fff" },
    secondary: { main: "#FFB74D", contrastText: "#1f1f1f" },
    background: { default: "#FFF8FA", paper: "#fff" },
    text: { primary: "#2b2b2b" },
  },
  typography: {
    fontFamily: "'Noto Sans JP', 'Roboto', sans-serif",
  },
  components: {
    MuiAppBar: { styleOverrides: { colorPrimary: { background: "linear-gradient(90deg,#F48FB1,#FFB74D)" } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 10, textTransform: "none" } } }
  },
});

export default theme;
