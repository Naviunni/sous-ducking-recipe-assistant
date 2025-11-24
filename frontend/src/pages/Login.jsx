import React from "react";
import LoginForm from "../components/LoginForm.jsx";

export default function Login() {
  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Welcome back 👋</h1>
        <p className="subtitle">Sign in to save preferences, grocery lists and personalized recipes.</p>
        <LoginForm />
      </div>
    </div>
  );
}