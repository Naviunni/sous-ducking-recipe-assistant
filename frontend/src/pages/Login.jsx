import React from "react";
import LoginForm from "../components/LoginForm.jsx";

export default function Login() {
  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}