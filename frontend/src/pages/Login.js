import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple frontend validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // For now, just alert the values (we'll connect backend later)
    alert(`Email: ${email}\nPassword: ${password}`);

    // Clear form
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 10,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={3}>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
