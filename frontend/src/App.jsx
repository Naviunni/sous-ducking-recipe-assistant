import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import SavedRecipes from './pages/SavedRecipes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/saved" element={<SavedRecipes />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
