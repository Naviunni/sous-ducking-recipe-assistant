import React, { useState } from "react";
import { signInMock, getProfile } from "../utils/app";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInMock(identifier, password);
      const profile = getProfile();
      setUser(profile);
      // redirect to home after login
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("sous_token");
    localStorage.removeItem("sous_profile");
    setUser(null);
    setIdentifier("");
    setPassword("");
  }

  if (user) {
    return (
      <div>
        <p>
          Signed in as <strong>{user.name}</strong> ({user.email})
        </p>
        <button className="button" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">
        Email or username
        <input
          className="input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="label">
        Password
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
      </label>

      {error && <div className="error">{error}</div>}

      <button className="button" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}