import React from 'react'

export default function SavedRecipes() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Saved Recipes</h1>
      <p style={{ color: '#374151' }}>Coming soon. You’ll be able to save and revisit your favorite recipes here.</p>
      <ul style={{ color: '#6b7280' }}>
        <li>Hook to backend/database or localStorage</li>
        <li>List cards with recipe name, quick actions</li>
        <li>Open a saved recipe to continue the chat</li>
      </ul>
    </div>
  )
}

