"""FastAPI backend for the AI-assisted recipe assistant."""

from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .utils.logging_utils import get_logger
from . import context_manager as ctx
from . import recipe_retrieval as rr
from . import substitution_engine as se
from .llm_interface import ask_llm, generate_recipe, has_llm


logger = get_logger(__name__)

app = FastAPI(title="Recipe Assistant API", version="0.1.0")

# Development CORS: allow all
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Ingredient(BaseModel):
    name: str
    quantity: Optional[str] = None


class Recipe(BaseModel):
    name: str
    ingredients: List[Ingredient]
    steps: List[str]


class AskRequest(BaseModel):
    message: str = Field(..., description="User message")
    session_id: str = Field(..., description="Client-generated session identifier")


class AskResponse(BaseModel):
    reply: str
    recipe: Optional[Recipe] = None


class SubstituteRequest(BaseModel):
    ingredient: str
    dislikes: Optional[List[str]] = None


class SubstituteResponse(BaseModel):
    substitutes: List[str]


@app.get("/recipes/{name}", response_model=Recipe)
async def get_recipe(name: str):
    """Fetch a recipe by name from local data."""
    recipe = rr.get_recipe_by_name(name)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@app.post("/substitute", response_model=SubstituteResponse)
async def substitute(req: SubstituteRequest):
    """Suggest substitutes for a given ingredient."""
    subs = se.suggest_substitutes(req.ingredient)
    return {"substitutes": subs}


def _extract_dislike(msg: str) -> Optional[str]:
    msg_l = msg.lower()
    triggers = ["i don't like", "i do not like", "i don’t like", "i don't have", "i have no"]
    for t in triggers:
        if t in msg_l:
            after = msg_l.split(t, 1)[1].strip(" .!?,:")
            return after
    return None


def _extract_recipe_name(msg: str) -> Optional[str]:
    msg_l = msg.lower()
    if "recipe for" in msg_l:
        after = msg_l.split("recipe for", 1)[1].strip(" .!?,:")
        return after
    if msg_l.startswith("recipe "):
        return msg_l.replace("recipe ", "").strip()
    if msg_l.startswith("give me a recipe for"):
        return msg_l.replace("give me a recipe for", "").strip()
    return None


@app.post("/ask", response_model=AskResponse)
async def ask(req: AskRequest):
    """Conversational endpoint coordinating retrieval, substitutions, and state.

    - If user asks for a recipe, fetch it, save in session, apply any known dislikes.
    - If user states a dislike or missing ingredient, update session and apply subs to current recipe.
    - Otherwise, return a mock LLM response.
    """
    session_id = req.session_id
    message = req.message.strip()
    if not message:
        return {"reply": "Please type something like 'recipe for lasagna'."}

    # Dislike or missing ingredient
    dislike = _extract_dislike(message)
    if dislike:
        ctx.add_dislike(session_id, dislike)
        current = ctx.get_current_recipe(session_id)
        if not current:
            return {
                "reply": f"Got it. I'll keep '{dislike}' in mind for substitutions.",
                "recipe": None,
            }
        dislikes = ctx.get_dislikes(session_id)
        # Prefer regenerating via LLM to fully adapt the recipe
        if has_llm():
            regenerated = _normalize_recipe(generate_recipe(current.get("name", "current recipe"), list(dislikes)))
            ctx.set_current_recipe(session_id, regenerated)
            return {
                "reply": f"Regenerated the recipe to avoid '{dislike}'.",
                "recipe": regenerated,
            }
        # Fallback: local substitution engine
        updated = se.apply_substitutions(current, dislikes)
        ctx.set_current_recipe(session_id, updated)
        return {"reply": f"Updated the recipe to avoid '{dislike}'.", "recipe": updated}

    # Ask for a recipe
    recipe_name = _extract_recipe_name(message)
    if recipe_name:
        dislikes = ctx.get_dislikes(session_id)
        if has_llm():
            generated = _normalize_recipe(generate_recipe(recipe_name, list(dislikes)))
            ctx.set_current_recipe(session_id, generated)
            return {
                "reply": f"Here's a recipe for {generated.get('name', recipe_name)}.",
                "recipe": generated,
            }
        # Fallback: local data + substitution engine
        found = rr.get_recipe_by_name(recipe_name)
        if found:
            adjusted = se.apply_substitutions(found, dislikes)
            ctx.set_current_recipe(session_id, adjusted)
            return {
                "reply": f"Here's a recipe for {adjusted['name']} (local data).",
                "recipe": adjusted,
            }
        return {"reply": f"Couldn't find a local recipe for '{recipe_name}'. Configure OPENAI_API_KEY for AI-generated recipes.", "recipe": None}

    # Fallback: mock LLM
    resp = ask_llm(message)
    return {"reply": resp.get("text", "I'm here to help with recipes!"), "recipe": None}
def _normalize_recipe(data: Dict[str, Any]) -> Dict[str, Any]:
    name = str(data.get("name", "recipe")).strip() or "recipe"
    raw_ings = data.get("ingredients", []) or []
    ingredients: List[Dict[str, str]] = []
    for it in raw_ings:
        if isinstance(it, dict):
            n = it.get("name") or it.get("ingredient") or it.get("item") or "ingredient"
            q = it.get("quantity") or it.get("qty") or ""
            ingredients.append({"name": str(n), "quantity": str(q) if q is not None else ""})
        elif isinstance(it, str):
            ingredients.append({"name": it, "quantity": ""})
    raw_steps = data.get("steps", [])
    if isinstance(raw_steps, str):
        steps = [s.strip() for s in raw_steps.split("\n") if s.strip()]
    else:
        steps = [str(s) for s in (raw_steps or [])]
    return {"name": name, "ingredients": ingredients, "steps": steps}
