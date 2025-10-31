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
    <div style={{ padding: 16 }}>
      <div
        ref={listRef}
        style={{
          height: 320,
          overflowY: 'auto',
          padding: 8,
          borderBottom: '1px solid #e5e7eb',
          background: '#fafafa'
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              margin: '8px 0'
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                background: m.role === 'user' ? '#e0f2fe' : '#eef2ff',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '8px 12px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, paddingTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message (e.g., recipe for pancakes, I don't like mushrooms)"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #2563eb', background: '#2563eb', color: '#fff' }}
        >
          Send
        </button>
      </form>
    </div>
  )
}

