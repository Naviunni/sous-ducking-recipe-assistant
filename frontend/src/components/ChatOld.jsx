import React, { useMemo, useState } from 'react'
import ChatUI from './ChatUI.jsx'
import RecipeCard from './RecipeCard.jsx'
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
    <div className="ra-container mx-auto">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card-ra">
            <div className="p-3 border-bottom"><h2 className="h5 m-0">Chat</h2></div>
            <ChatUI messages={messages} onSend={sendMessage} />
          </div>
        </div>
        <div className="col-lg-6">
          {recipe && (
            <div className="card-ra p-3">
              <RecipeCard recipe={recipe} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
