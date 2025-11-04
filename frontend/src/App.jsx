import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import SavedRecipes from "./pages/SavedRecipes.jsx";
import Login from "./pages/Login.jsx";
import { getProfile } from "./utils/app.js";

function RequireAuth({ children }) {
  // simple client-side guard — replace with real session check when you have a backend
  const profile = getProfile();
  return profile ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/chat"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />
          <Route
            path="/saved"
            element={
              <RequireAuth>
                <SavedRecipes />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}