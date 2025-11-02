"""FastAPI backend for the AI-assisted recipe assistant."""

from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .utils.logging_utils import get_logger
from . import context_manager as ctx
from . import recipe_retrieval as rr
from . import substitution_engine as se
from .llm_interface import ask_llm, generate_recipe, has_llm, modify_recipe
from .intent_parser import parse_intent
import re


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
    """Heuristic extraction of a disliked or unavailable ingredient/category.

    Handles phrases like:
    - I don't like X / I dont like X / I do not like X
    - I don't have X / I have no X / I can't have X / I cannot have X
    - I'm allergic to X / I am allergic to X
    - no X / without X / avoid X / skip X / leave out X
    """
    m = msg.lower()
    patterns = [
        r"\b(i\s*(?:do\s*not|don't|dont)\s*like)\s+([^\n\r\t.,:;!?]+)",
        r"\b(i\s*(?:do\s*not|don't|dont)\s*have)\s+([^\n\r\t.,:;!?]+)",
        r"\b(i\s*(?:can\s*not|can't|cannot)\s*have)\s+([^\n\r\t.,:;!?]+)",
        r"\b(i\s*(?:am|\'m)\s*allergic\s*to)\s+([^\n\r\t.,:;!?]+)",
        r"\b(no)\s+([^\n\r\t.,:;!?]+)",
        r"\b(without)\s+([^\n\r\t.,:;!?]+)",
        r"\b(avoid|skip|leave\s*out)\s+([^\n\r\t.,:;!?]+)",
    ]
    for pat in patterns:
        match = re.search(pat, m)
        if match:
            val = match.group(2).strip().strip(" .!?,:;\"")
            return val
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


def _extract_replacement(msg: str) -> Optional[tuple]:
    """Extract simple replacement intent: 'replace X with Y' or 'use X instead of Y'."""
    m = msg.lower()
    if "replace" in m and " with " in m:
        try:
            after = m.split("replace", 1)[1].strip()
            src, rest = after.split(" with ", 1)
            src = src.strip(" .!?,:")
            dst = rest.strip(" .!?,:")
            if src and dst:
                return (src, dst)
        except Exception:
            return None
    if "use" in m and " instead of " in m:
        try:
            after = m.split("use", 1)[1].strip()
            dst, rest = after.split(" instead of ", 1)
            dst = dst.strip(" .!?,:")
            src = rest.strip(" .!?,:")
            if src and dst:
                return (src, dst)
        except Exception:
            return None
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

    # Record user message
    ctx.append_user_message(session_id, message)

    # First, try LLM-based intent parsing for robust mapping
    intent = None
    if has_llm():
        parsed = parse_intent(message, ctx.get_messages(session_id))
        intent = parsed.get("intent")

        if intent == "replace":
            current = ctx.get_current_recipe(session_id)
            if not current:
                reply = "Tell me which recipe first (e.g., 'recipe for lasagna')."
                ctx.append_assistant_message(session_id, reply)
                return {"reply": reply, "recipe": None}
            replacements = parsed.get("replacements", [])
            dislikes = ctx.get_dislikes(session_id)
            for r in replacements:
                src = r.get("src")
                if src:
                    dislikes.add(src)
            updated = _normalize_recipe(
                modify_recipe(current, list(dislikes), [(r["src"], r["dst"]) for r in replacements if r.get("src") and r.get("dst")], ctx.get_messages(session_id))
            )
            ctx.set_current_recipe(session_id, updated)
            if replacements:
                first = replacements[0]
                reply = f"Updated the recipe: replaced '{first['src']}' with '{first['dst']}'."
            else:
                reply = "Updated the recipe with requested substitutions."
            ctx.append_assistant_message(session_id, reply)
            return {"reply": reply, "recipe": updated}

        if intent == "add_dislike":
            dislikes_in = parsed.get("dislikes", [])
            if dislikes_in:
                for d in dislikes_in:
                    ctx.add_dislike(session_id, d)
                current = ctx.get_current_recipe(session_id)
                if current and has_llm():
                    regenerated = _normalize_recipe(
                        modify_recipe(current, list(ctx.get_dislikes(session_id)), None, ctx.get_messages(session_id))
                    )
                    ctx.set_current_recipe(session_id, regenerated)
                    reply = "Regenerated the recipe based on your dislikes."
                    ctx.append_assistant_message(session_id, reply)
                    return {"reply": reply, "recipe": regenerated}

        if intent == "get_recipe" and parsed.get("recipe_name"):
            rn = parsed.get("recipe_name")
            generated = _normalize_recipe(generate_recipe(rn, list(ctx.get_dislikes(session_id)), ctx.get_messages(session_id)))
            ctx.set_current_recipe(session_id, generated)
            reply = f"Here's a recipe for {generated.get('name', rn)}."
            ctx.append_assistant_message(session_id, reply)
            return {"reply": reply, "recipe": generated}

    # Fallback heuristics: Replacement intent
    replacement = _extract_replacement(message)
    if replacement:
        current = ctx.get_current_recipe(session_id)
        if not current:
            return {"reply": "Tell me which recipe first (e.g., 'recipe for lasagna').", "recipe": None}
        src, dst = replacement
        dislikes = ctx.get_dislikes(session_id)
        dislikes.add(src)
        if has_llm():
            updated = _normalize_recipe(modify_recipe(current, list(dislikes), [(src, dst)], ctx.get_messages(session_id)))
            ctx.set_current_recipe(session_id, updated)
            reply = f"Updated the recipe: replaced '{src}' with '{dst}'."
        else:
            updated = se.apply_substitutions(current, dislikes)
            ctx.set_current_recipe(session_id, updated)
            reply = f"Updated the recipe to avoid '{src}'."
        ctx.append_assistant_message(session_id, reply)
        return {"reply": reply, "recipe": updated}

    # Fallback heuristics: Dislike or missing ingredient
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
            regenerated = _normalize_recipe(modify_recipe(current, list(dislikes), None, ctx.get_messages(session_id)))
            ctx.set_current_recipe(session_id, regenerated)
            reply = f"Regenerated the recipe to avoid '{dislike}'."
            ctx.append_assistant_message(session_id, reply)
            return {"reply": reply, "recipe": regenerated}
        # Fallback: local substitution engine
        updated = se.apply_substitutions(current, dislikes)
        ctx.set_current_recipe(session_id, updated)
        reply = f"Updated the recipe to avoid '{dislike}'."
        ctx.append_assistant_message(session_id, reply)
        return {"reply": reply, "recipe": updated}

    # Ask for a recipe
    recipe_name = _extract_recipe_name(message)
    if recipe_name:
        dislikes = ctx.get_dislikes(session_id)
        if has_llm():
            generated = _normalize_recipe(generate_recipe(recipe_name, list(dislikes), ctx.get_messages(session_id)))
            ctx.set_current_recipe(session_id, generated)
            reply = f"Here's a recipe for {generated.get('name', recipe_name)}."
            ctx.append_assistant_message(session_id, reply)
            return {"reply": reply, "recipe": generated}
        # Fallback: local data + substitution engine
        found = rr.get_recipe_by_name(recipe_name)
        if found:
            adjusted = se.apply_substitutions(found, dislikes)
            ctx.set_current_recipe(session_id, adjusted)
            reply = f"Here's a recipe for {adjusted['name']} (local data)."
            ctx.append_assistant_message(session_id, reply)
            return {"reply": reply, "recipe": adjusted}
        reply = f"Couldn't find a local recipe for '{recipe_name}'. Configure OPENAI_API_KEY for AI-generated recipes."
        ctx.append_assistant_message(session_id, reply)
        return {"reply": reply, "recipe": None}

    # Fallback: mock LLM
    resp = ask_llm(message)
    reply = resp.get("text", "I'm here to help with recipes!")
    ctx.append_assistant_message(session_id, reply)
    return {"reply": reply, "recipe": None}
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
