import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Registration failed");
        return;
      }

      setMessage("Registration successful! Now you can login.");
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "40px auto" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Register</Typography>

        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" fullWidth onClick={handleRegister} sx={{ mt: 2 }}>
          Register
        </Button>

        <Typography sx={{ mt: 2 }} color="primary">
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Register;
