import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getProfile, signOut } from "../utils/app";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const profile = getProfile();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    // Redirect to login page after sign out
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary rounded-4 card-ra mt-3 mb-3">
      <div className="container-fluid ra-container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="brand-logo"
            style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden" }}
            aria-hidden
          >
            
            <img src="/assets/logo.png" alt="Sous Duckling logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <strong style={{ display: "block", fontSize: 16 }}>Sous Duckling</strong>
            <small style={{ color: "var(--muted)", fontSize: 12 }}>Recipe Assistant</small>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navLinks"
          aria-controls="navLinks"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navLinks">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/chat">Chat</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/saved">Saved Recipes</NavLink></li>

            {/* spacer on large screens */}
            <li className="nav-item d-none d-lg-block"><div style={{ width: 12 }} /></li>

            {/* auth area */}
            {profile ? (
              <>
                <li className="nav-item d-flex align-items-center">
                  <div style={{ marginRight: 8, fontWeight: 600 }}>{profile.name}</div>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-ra-primary"
                    onClick={handleSignOut}
                    style={{ marginLeft: 8, borderRadius: 10, padding: "8px 12px", color: "#fff" }}
                    aria-label="Sign out"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-ra-primary"
                  onClick={() => navigate("/login")}
                  style={{ marginLeft: 8, borderRadius: 10, padding: "8px 12px", color: "#fff" }}
                >
                  Sign in
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}