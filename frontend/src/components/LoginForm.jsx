import React, { useState } from "react";
import { signInMock, getProfile } from "../utils/app";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInMock(identifier, password);
      // small success animation (setTimeout allows css hover/active to settle)
      setTimeout(() => navigate("/", { replace: true }), 220);
    } catch (err) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form" aria-label="login form">
      <div>
        <label className="label">Email or username</label>
        <input
          className="input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="username"
        />
      </div>

      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          autoComplete="current-password"
        />
      </div>

      {error && <div className="error" role="alert">{error}</div>}

      <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
        <button className="button btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          className="button btn-ghost"
          onClick={() => {
            setIdentifier("john@example.com");
            setPassword("password123");
          }}
          title="Fill demo credentials"
        >
          Demo
        </button>
      </div>
    </form>
  );
}