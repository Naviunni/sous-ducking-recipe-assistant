# Sous Duckling : an AI-Assisted Recipe Assistant

A smart conversational recipe assistant! Users can ask for recipes, get ingredients and step-by-step instructions, declare dislikes or missing ingredients, and receive suggested substitutions. Conversation context is stored per session.

## Quick Start

### Backend

Requirements: Python 3.10+

1. Create a virtual environment and install deps:

```
cd recipe-assistant
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Run the backend (FastAPI + Uvicorn):

```
uvicorn backend.app:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

Requirements: Node 18+

1. Install dependencies:

```
cd frontend
npm install
```

2. Start the dev server:

```
npm run dev
```

Open `http://localhost:5173`. The frontend points to `http://localhost:8000` by default. You can override with `VITE_API_BASE`.

## Backend Overview

- Framework: FastAPI
- Endpoints:
  - `POST /ask` → Conversational endpoint; returns reply text and optional recipe JSON
  - `GET /recipes/{name}` → Fetch a recipe by name (local data for now)
  - `POST /substitute` → Suggest ingredient substitutions

Modules:

- `backend/app.py` — FastAPI app, routes, models, and orchestration
- `backend/recipe_retrieval.py` — Fetch recipes from local `data/recipes.json` (extensible to APIs)
- `backend/substitution_engine.py` — Rule-based substitutions + helpers to apply them
- `backend/context_manager.py` — In-memory session context (current recipe, dislikes)
- `backend/llm_interface.py` — Placeholder LLM wrapper returning mock responses
- `backend/utils/logging_utils.py` — Lightweight structured logger

## Frontend Overview

- Framework: React (Vite)
- Components:
  - `ChatUI.jsx` — Chat interface (user + assistant)
  - `RecipeCard.jsx` — Displays recipe name, ingredients, steps
  - `App.jsx` — State management, backend calls, session id

## Data

- `data/recipes.json` — Mock recipes for local testing (e.g., Lasagna, Pancakes)

## Extensibility

- Swap `ask_llm` in `llm_interface.py` with OpenAI or Ollama integration
- Extend `recipe_retrieval.py` to use Spoonacular/Edamam
- Replace in-memory session with Redis or DB for multi-user deployments

## Notes

- CORS is enabled for all origins in development.
- Intent parsing in `/ask` is intentionally simple for a starting point.

