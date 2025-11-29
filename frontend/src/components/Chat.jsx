import React, { useMemo, useState } from 'react' 
import { ask } from '../lib/api.js' 
import { getSessionId } from '../lib/session.js' 
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography'; 
import Grid from '@mui/material/Grid'; 
import ChatUI from './ChatUI.jsx' 
import RecipeCard from './RecipeCard.jsx' 

export default function Chat() { 
    const sessionId = useMemo(() => getSessionId(), []) 
    const [messages, setMessages] = useState([ { role: 'assistant', text: "Hi! Ask me for a recipe, e.g., 'recipe for lasagna'." } ]) 
    const [recipe, setRecipe] = useState(null) 
    async function sendMessage(text) { 
        const msg = text.trim() 
        if (!msg) return 
        const next = [...messages, { role: 'user', text: msg }] 
        setMessages(next) 
        try { const data = await ask(msg, sessionId) 
            setMessages(m => [...m, { role: 'assistant', text: data.reply }]) 
            if (data.recipe) setRecipe(data.recipe) 
        } catch (err) { 
            setMessages(m => [...m, { role: 'assistant', text: 'Error contacting backend.' }]) 
            console.error(err) 
        } 
    }

    return ( 
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}> 
            <div> 
                <Typography variant="h1" gutterBottom> Chat with <font color="#FF8A00">Sous Duckling</font> </Typography> 
                <Typography>Ask away, chef! I've got recipes to share, ingredients to adjust, and culinary magic to help you make something delicious.</Typography> 
            </div> 
            
            <Grid container spacing={2} columns={12}> 
                <Grid size={{ xs: 12, md: 6 }}> 
                    <ChatUI messages={messages} onSend={sendMessage} /> 
                </Grid> 
                <Grid size={{ xs: 12, md: 6 }}> 
                    {recipe && ( <div className="card-ra p-3"> 
                        <RecipeCard recipe={recipe} /> </div> )}
                </Grid> 
            </Grid> 
        </Box> 
    ); 
}