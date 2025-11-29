import React, { useEffect, useState } from 'react'
import { isSavedByName, saveRecipe, removeSavedByName } from '../lib/saved.js'

export default function RecipeCard({ recipe }) {
  if (!recipe) return null
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isSavedByName(recipe.name))
  }, [recipe?.name])

  function toggleSave() {
    if (saved) {
      removeSavedByName(recipe.name)
      setSaved(false)
    } else {
      saveRecipe(recipe)
      setSaved(true)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">{recipe.name}</h2>
        <button type="button" onClick={toggleSave} className={`btn ${saved ? 'btn-danger' : 'btn-danger'} btn-sm`} title={saved ? 'Remove from saved' : 'Save recipe'}>
          {saved ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg>
          )}
        </button>
      </div>
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