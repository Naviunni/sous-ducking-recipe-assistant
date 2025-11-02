import React, { useMemo, useState } from 'react'
import ChatUI from '../components/ChatUI.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import { ask } from '../lib/api.js'
import { getSessionId } from '../lib/session.js'

export default function ChatPage() {
  const sessionId = useMemo(() => getSessionId(), [])
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
      const data = await ask(msg, sessionId)
      setMessages(m => [...m, { role: 'assistant', text: data.reply }])
      if (data.recipe) setRecipe(data.recipe)
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error contacting backend.' }])
      console.error(err)
    }
  }

  return (
    <>
      <div className="card">
        <div className="header">
          <h1 style={{ margin: 0, fontSize: 18 }}>Chat</h1>
        </div>
        <ChatUI messages={messages} onSend={sendMessage} />
      </div>
      {recipe && (
        <div style={{ marginTop: 16 }}>
          <RecipeCard recipe={recipe} />
        </div>
      )}
    </>
  )
}

