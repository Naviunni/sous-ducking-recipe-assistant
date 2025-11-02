import React from 'react'

export default function RecipeCard({ recipe }) {
  if (!recipe) return null
  return (
    <div>
      <h2 className="h4 mb-3">{recipe.name}</h2>
      <div className="row g-3">
        <div className="col-md-5">
          <h3 className="h6">Ingredients</h3>
          <ul className="list-group list-group-flush">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} className="list-group-item px-0">
                {ing.quantity ? <strong className="me-1">{ing.quantity}</strong> : null}
                {ing.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-7">
          <h3 className="h6">Steps</h3>
          <ol className="ps-3">
            {recipe.steps?.map((s, i) => (
              <li key={i} className="mb-2">{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
