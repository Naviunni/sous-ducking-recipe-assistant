import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Avatar,
} from '@mui/material';
import DuckIcon from './DuckIcon.jsx';
import ChefIcon from './ChefIcon.jsx'

export default function ChatUI({ messages, onSend }) {
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Chat messages */}
      <Paper
        ref={listRef}
        elevation={0}
        sx={{
          p: 2,
          maxHeight: 350,
          overflowY: 'auto',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {messages.map((m, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {/* Wrap avatar + bubble together */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              {/* Avatar */}
              {m.role === 'assistant' ? (
                <Avatar
                  alt="Sous Duckling"
                  sx={{
                    bgcolor: 'transparent',
                    width: 40,
                    height: 40,
                    p: 0,
                  }}
                >
                  <DuckIcon sx={{ width: '100%', height: '100%' }} />
                </Avatar>
              ) : (
                <Avatar
                  alt="You"
                  sx={{
                    bgcolor: '#FFC34D',
                    color: '#000',       // black text looks best on this shade
                    fontWeight: 'bold'
                  }}
                >
                  <ChefIcon sx={{ width: 24, height: 24 }} />
                </Avatar>
              )}

              {/* Bubble */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  maxWidth: '75%',
                  borderRadius: 2,
                  bgcolor:
                    m.role === 'user'
                      ? '#FFC34D'
                      : 'grey.200',
                  color:
                    m.role === 'user'
                      ? '#000'
                      : 'text.primary',
                  boxShadow: 1,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Input bar */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message (e.g., recipe for pancakes, I don't like mushrooms)"
        />

        <Button type="submit" variant="contained" size="large" sx={{ px: 3 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
