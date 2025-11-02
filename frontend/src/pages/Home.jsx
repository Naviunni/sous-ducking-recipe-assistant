import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Welcome to Sous Duckling!</h1>
      <p style={{ color: '#374151' }}>
        Ask for any recipe, get ingredients and step-by-step instructions, and tell me what you want to avoid. I'll adapt the recipe for you.
      </p>
      <ul style={{ color: '#374151', paddingLeft: 18 }}>
        <li>“recipe for lasagna”</li>
        <li>“I don’t like mushrooms”</li>
        <li>“replace milk with oat milk”</li>
      </ul>
      <div style={{ marginTop: 16 }}>
        <Link to="/chat" style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #2563eb', background: '#2563eb', color: '#fff', textDecoration: 'none' }}>
          Start Chatting
        </Link>
      </div>
    </div>
  )
}

