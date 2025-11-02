import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="ra-modal-backdrop" onClick={onClose}>
      <div className="ra-modal card-ra" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h2 className="h5 m-0">{title}</h2>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  )
}

