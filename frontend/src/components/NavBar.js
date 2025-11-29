// src/components/NavBar.js
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar position="static" color="primary" elevation={3}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Language Learning
          </Typography>

          <Button color="inherit" component={Link} to="/english">
            English
          </Button>
          <Button color="inherit" component={Link} to="/japanese">
            Japanese
          </Button>
          <Button color="inherit" component={Link} to="/vocabulary">
            Vocabulary
          </Button>
          <Button color="inherit" component={Link} to="/flashcards">
            Flashcards
          </Button>
          <Button color="inherit" component={Link} to="/quiz">
            Quiz
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
