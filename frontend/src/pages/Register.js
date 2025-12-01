// frontend/src/pages/Register.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Register: ${name}, ${email}`);
    setName(""); setEmail(""); setPassword("");
  };
  return (
    <Box sx={{ maxWidth:400, margin:"auto", mt:8, p:3, border:"1px solid #ccc", borderRadius:2}}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e)=>setName(e.target.value)} />
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <Button type="submit" fullWidth variant="contained" sx={{ mt:2 }}>Sign Up</Button>
      </form>
    </Box>
  );
}
