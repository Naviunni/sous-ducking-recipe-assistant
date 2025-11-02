import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary rounded-4 card-ra mt-3 mb-3">
      <div className="container-fluid ra-container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <strong>Sous Duckling</strong>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navLinks" aria-controls="navLinks" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navLinks">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/chat">Chat</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/saved">Saved Recipes</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
