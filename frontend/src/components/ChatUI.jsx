import React, { useState, useRef, useEffect } from 'react'

export default function ChatUI({ messages, onSend }) {
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    onSend(text)
    setInput('')
  }

  return (
    <div className="p-3">
      <div ref={listRef} className="ra-chat-scroll p-3 border-bottom">
        {messages.map((m, idx) => (
          <div key={idx} className={`msg ${m.role}`}>
            <div className="bubble">
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="d-flex gap-2 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message (e.g., recipe for pancakes, I don't like mushrooms)"
          className="form-control form-control-lg"
        />
        <button type="submit" className="btn btn-lg btn-ra-primary">Send</button>
      </form>
    </div>
  )
}
