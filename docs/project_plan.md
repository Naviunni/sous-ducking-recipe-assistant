# Project Plan — AI-Assisted Recipe Assistant

## Goal
Build a conversational recipe assistant that provides recipes, ingredients, and step-by-step instructions, supporting dislikes/missing ingredients with substitutions, and maintaining conversational context.

## Architecture

- Backend: FastAPI
  - `/ask` (POST): conversation coordinator
  - `/recipes/{name}` (GET): recipe retrieval
  - `/substitute` (POST): substitution suggestions
  - Modules: retrieval, substitutions, context manager, LLM interface, logging utils

- Frontend: React (Vite)
  - Components: `ChatUI`, `RecipeCard`, `App`
  - State: messages, current recipe, session id
  - API: Fetch to backend base URL (configurable via `VITE_API_BASE`)

## Milestones

1. Scaffold backend with endpoints and mock data
2. Implement substitution engine and context manager
3. Add LLM mock wrapper
4. Scaffold frontend with chat and recipe display
5. Documentation and setup instructions

## Future Enhancements

- Integrate real LLM (OpenAI or local LLM via Ollama)
- Use external recipe APIs (Spoonacular/Edamam) with caching
- Advanced NLU for intent and entity extraction
- Persistent session store (Redis/Postgres)
- Auth and multi-user management
- Rating, favorites, and sharing

