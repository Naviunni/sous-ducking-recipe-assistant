import React from 'react'

export default function RecipeCard({ recipe }) {
  if (!recipe) return null
  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 style={{ margin: '0 0 8px 0' }}>{recipe.name}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <div>
          <h3 style={{ margin: '8px 0' }}>Ingredients</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>{ing.quantity ? `${ing.quantity} ` : ''}{ing.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ margin: '8px 0' }}>Steps</h3>
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {recipe.steps?.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

