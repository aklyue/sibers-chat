import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAppDispatch from "../../hooks/useAppDispatch";
import { login, User } from "../../store/slices/userSlice";
import users from "../../data/users.json";

function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = () => {
    if (!name.trim()) return;

    const userFromJson = users.find((u) => u.username === name.trim());
    if (!userFromJson) {
      alert("User not found");
      return;
    }

    const user: User = {
      ...userFromJson,
      id: String(userFromJson.id),
    };

    dispatch(login(user));
    navigate("/chat");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      maxWidth={300}
      mx="auto"
      mt={10}
    >
      <TextField
        label="Username from json (ex. Wyatt37)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" onClick={handleLogin}>
        Join
      </Button>
    </Box>
  );
}

export default Login;
