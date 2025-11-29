import React from 'react';
import { Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Home from './components/Home';
import Chat from './components/Chat';  
import Saved from './components/Saved';
import Explore from './components/Explore';
import Grocery from './components/Grocery';
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

export default function App(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />

      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/grocery" element={<Grocery />} />
        </Routes>
      </Container>
    </AppTheme>
  );
}
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
