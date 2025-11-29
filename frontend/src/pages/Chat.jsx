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
    <div className="ra-container mx-auto">
      <div className="row g-4 chat-layout-row">
        {/* Chat column (left on wide screens, stacked above on small screens) */}
        <div className="col-12 col-lg-6 order-1 ra-chat-column">
          <div className="card-ra card-ra2 h-100 d-flex flex-column">
            <div className="p-3 border-bottom"><h2 className="h5 m-0">Chat</h2></div>
            {/* Chat content grows and provides its own scroll */}
            <div className="chat-card-body flex-grow-1 d-flex flex-column">
              <ChatUI messages={messages} onSend={sendMessage} />
            </div>
          </div>
        </div>

        {/* Recipe column (right on wide screens, stacked below on small screens) */}
        <div className="col-12 col-lg-6 order-2 ra-recipe-column">
          <div className="card-ra p-3 recipe-side h-100 d-flex flex-column">
            {recipe ? (
              <div className="recipe-scroll">
                <RecipeCard recipe={recipe} />
              </div>
            ) : (
              <div className="recipe-placeholder">
                <svg className="recipe-placeholder-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 2a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v9a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7a2 2 0 0 0-2-2h-3V4a2 2 0 0 0-2-2h-2zM9 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1H9V5zm-1 8h8v2H8v-2zm0-4h8v2H8V9z" />
                </svg>
                <h3 className="h6 m-0">Your recipe will appear here</h3>
                <p className="muted small mb-0">Ask for a recipe in chat — e.g., "recipe for lasagna" or "chicken tikka masala"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}