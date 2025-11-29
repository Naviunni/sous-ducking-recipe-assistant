import React, { useMemo, useState } from 'react';
import ChatUI from './ChatUI';
import RecipeCard from './RecipeCard';
import { ask } from '../lib/api';
import { getSessionId } from '../lib/session';
import { Box, Grid, Paper, Typography } from '@mui/material';

export default function ChatPage() {
  const sessionId = useMemo(() => getSessionId(), []);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! Ask me for a recipe, e.g., 'recipe for lasagna'."
    }
  ]);
  const [recipe, setRecipe] = useState(null);
  const [thinking, setThinking] = useState(false);

  async function sendMessage(text) {
    const msg = text.trim();
    if (!msg) return;

    setMessages(m => [...m, { role: 'user', text: msg }]);
    setThinking(true);

    try {
      const data = await ask(msg, sessionId);

      setThinking(false);
      setMessages(m => [...m, { role: 'assistant', text: data.reply }]);

      if (data.recipe) setRecipe(data.recipe);
    } catch (err) {
      setThinking(false);
      setMessages(m => [
        ...m,
        { role: 'assistant', text: 'Error contacting backend.' }
      ]);
    }
  }

  return (
    <Box sx={{ maxWidth: '1200px', mt: 4 }}>
       <div>
          <Typography variant="h1" gutterBottom>
            Chat with <font color="#FF8A00">Sous Duckling</font>
          </Typography>
          <Typography>Ask away, chef! I've got recipes to share, ingredients to adjust, and culinary magic to help you make something delicious</Typography>
        </div>

        <Grid container spacing={2} columns={12} sx={{ mt: 3 }}>
        
        {/* Left Column: Chat */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: 3,
              bgcolor: "background.paper"
            }}
          >
            {/* Chat Header Bar */}
            <Box
              sx={{
                background: "linear-gradient(90deg, #FF8A00 0%, #FFC34D 100%)",
                color: "white",
                px: 2,
                py: 1.2,
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "12px 12px 0 0",
                letterSpacing: "0.5px",
              }}
            >
              Quack & Cook Chat
            </Box>

            {/* Actual Chat UI */}
            <ChatUI messages={messages} onSend={sendMessage} />
          </Box>
        </Grid>

        {/* Right Column: Recipe */}
        <Grid item xs={12} md={6}>
          {recipe && (
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <RecipeCard recipe={recipe} />
            </Paper>
          )}
        </Grid>

      </Grid>
    </Box>
  );
}