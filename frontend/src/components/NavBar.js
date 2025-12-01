import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

export default function NavBar() {
  // Menu State Management
  const [japaneseAnchor, setJapaneseAnchor] = useState(null);
  const [englishAnchor, setEnglishAnchor] = useState(null);
  const [toolsAnchor, setToolsAnchor] = useState(null);

  // Open Menus
  const openJapaneseMenu = (event) => setJapaneseAnchor(event.currentTarget);
  const openEnglishMenu = (event) => setEnglishAnchor(event.currentTarget);
  const openToolsMenu = (event) => setToolsAnchor(event.currentTarget);

  // Close Menus
  const closeJapaneseMenu = () => setJapaneseAnchor(null);
  const closeEnglishMenu = () => setEnglishAnchor(null);
  const closeToolsMenu = () => setToolsAnchor(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#1e88e5" }}>
        <Toolbar>

          {/* App Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Language Learning App
          </Typography>

          {/* Home Button */}
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {/* Japanese Dropdown */}
          <Button color="inherit" onClick={openJapaneseMenu}>
            Japanese ▼
          </Button>
          <Menu
            anchorEl={japaneseAnchor}
            open={Boolean(japaneseAnchor)}
            onClose={closeJapaneseMenu}
          >
            <MenuItem onClick={closeJapaneseMenu} component={Link} to="/vocabulary">
              Vocabulary
            </MenuItem>
            <MenuItem onClick={closeJapaneseMenu} component={Link} to="/flashcards">
              Flashcards
            </MenuItem>
            <MenuItem onClick={closeJapaneseMenu} component={Link} to="/japanese/hiragana">
              Hiragana
            </MenuItem>
          </Menu>

          {/* English Dropdown */}
          <Button color="inherit" onClick={openEnglishMenu}>
            English ▼
          </Button>
          <Menu
            anchorEl={englishAnchor}
            open={Boolean(englishAnchor)}
            onClose={closeEnglishMenu}
          >
            <MenuItem onClick={closeEnglishMenu} component={Link} to="/english/vocabulary">
              Vocabulary
            </MenuItem>
            <MenuItem onClick={closeEnglishMenu} component={Link} to="/flashcards">
              Flashcards
            </MenuItem>
          </Menu>

          {/* Learning Tools Dropdown */}
          <Button color="inherit" onClick={openToolsMenu}>
            Learning Tools ▼
          </Button>
          <Menu
            anchorEl={toolsAnchor}
            open={Boolean(toolsAnchor)}
            onClose={closeToolsMenu}
          >
            <MenuItem onClick={closeToolsMenu} component={Link} to="/quiz">
              Quiz
            </MenuItem>
            <MenuItem onClick={closeToolsMenu} component={Link} to="/flashcards">
              Flashcards
            </MenuItem>
          </Menu>

          {/* Login */}
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>

          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
