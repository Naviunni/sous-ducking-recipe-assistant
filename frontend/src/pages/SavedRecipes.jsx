import React, { useEffect, useState } from 'react'
import { listSaved, removeSavedByName } from '../lib/saved.js'
import Modal from '../components/Modal.jsx'
import RecipeCard from '../components/RecipeCard.jsx'

export default function SavedRecipes() {
  const [items, setItems] = useState([])

  function refresh() { setItems(listSaved()) }
  useEffect(() => { refresh() }, [])

  function remove(name) {
    removeSavedByName(name)
    refresh()
  }

  return (
    <div className="ra-container mx-auto">
      <div className="card-ra p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h4 m-0">Saved Recipes</h1>
        </div>
        {items.length === 0 ? (
          <p className="text-muted mb-0">No saved recipes yet. Click the heart on a recipe to save it.</p>
        ) : (
          <List items={items} onRemove={remove} />
        )}
      </div>
      <Viewer items={items} />
    </div>
  )
}

function List({ items, onRemove }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="row g-3">
        {items.map((r, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="card-ra p-3 h-100" role="button" onClick={() => setSelected(r)}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 m-0">{r.name}</h2>
                <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); onRemove(r.name) }}>Remove</button>
              </div>
              <div className="small text-muted mb-2">Saved {new Date(r.savedAt).toLocaleString()}</div>
              <div className="row g-2">
                <div className="col-6">
                  <div className="border rounded p-2 bg-white">
                    <strong>{r.ingredients?.length || 0}</strong> ingredients
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-2 bg-white">
                    <strong>{r.steps?.length || 0}</strong> steps
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!selected} title={selected?.name} onClose={() => setSelected(null)}>
        {selected && <RecipeCard recipe={selected} />}
      </Modal>
    </>
  )
}

function Viewer() { return null }
