import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm.jsx";

export default function Login() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Welcome back 👋
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 3 }}
        >
          Sign in to save preferences, grocery lists, and personalized recipes.
        </Typography>

        <LoginForm />
      </Paper>
    </Box>
  );
}
