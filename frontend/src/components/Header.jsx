import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const linkStyle = ({ isActive }) => ({
    padding: '8px 10px',
    borderRadius: 8,
    color: isActive ? '#fff' : '#111827',
    background: isActive ? '#2563eb' : 'transparent',
    textDecoration: 'none',
  })

  return (
    <header className="card" style={{ marginBottom: 16 }}>
      <div className="header" style={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#111827' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C9.239 3 7 5.239 7 8C7 10.761 9.239 13 12 13C14.761 13 17 10.761 17 8C17 5.239 14.761 3 12 3ZM5 20C5 16.686 7.686 14 11 14H13C16.314 14 19 16.686 19 20V21H5V20Z" fill="#111827"/></svg>
          <strong>Recipe Assistant</strong>
        </Link>
        <nav style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/" style={linkStyle} end>Home</NavLink>
          <NavLink to="/chat" style={linkStyle}>Chat</NavLink>
          <NavLink to="/saved" style={linkStyle}>Saved Recipes</NavLink>
        </nav>
      </div>
    </header>
  )
}

