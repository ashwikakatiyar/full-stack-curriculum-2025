import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  // Access the MUI theme for potential theme-related functionalities.
  const theme = useTheme();

  // Extract login function and error from our authentication context.
  const { loginError, login, register } = useAuth();

  // State to hold the username and password entered by the user.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registered, setRegistered] = useState(false);

  // TODO: Handle login function.
  const handleLogin = () => {
    login(username, password);
  };

  const handleRegister = () => {
    register(username, password);
  }

  const toggleRegister = () => {
    setRegistered(!registered);
    setUsername("");
    setPassword("");
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            marginBottom: 2,
            height: 200,
            width: 200,
          }}
          alt="UT Longhorn"
          src="/longhorn.jpg"
        ></Box>
        <Typography component="h1" variant="h4" fontWeight="bold">
          {registered ? "Register" : "Login"}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            InputLabelProps={{ shrink: true }}
            placeholder="Enter your username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            InputLabelProps={{ shrink: true }}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={registered ? handleRegister : handleLogin}
          >
            {registered ? "Register" : "Login"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link
              component="button"
              variant="body2"
              onClick={toggleRegister}
              sx={{ cursor: "pointer" }}
            >
            {registered ? "Login to existing account" : "Register new account"}
            </Link>
            </Box>
        </Box>
        {/* Display Login Error if it exists */}
        {loginError && (
          <Alert severity="error">
            {loginError}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default LoginPage;