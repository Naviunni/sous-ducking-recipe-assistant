import React, { useMemo, useState } from 'react'
import ChatUI from './components/ChatUI.jsx'
import RecipeCard from './components/RecipeCard.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function genSessionId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return 'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

export default function App() {
  const sessionId = useMemo(() => genSessionId(), [])
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! Ask me for a recipe, e.g., 'recipe for lasagna'." }
  ])
  const [recipe, setRecipe] = useState(null)

  async function sendMessage(text) {
    const msg = text.trim()
    if (!msg) return
    const next = [...messages, { role: 'user', text: msg }]
    setMessages(next)
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, session_id: sessionId })
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', text: data.reply }])
      if (data.recipe) setRecipe(data.recipe)
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error contacting backend.' }])
      console.error(err)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C9.239 3 7 5.239 7 8C7 10.761 9.239 13 12 13C14.761 13 17 10.761 17 8C17 5.239 14.761 3 12 3ZM5 20C5 16.686 7.686 14 11 14H13C16.314 14 19 16.686 19 20V21H5V20Z" fill="#111827"/></svg>
          <h1>Recipe Assistant</h1>
        </div>
        <ChatUI messages={messages} onSend={sendMessage} />
      </div>
      {recipe && (
        <div style={{ marginTop: 16 }}>
          <RecipeCard recipe={recipe} />
        </div>
      )}
    </div>
  )
}

