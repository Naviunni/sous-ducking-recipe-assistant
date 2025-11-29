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
