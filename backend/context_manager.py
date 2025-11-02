"""Conversation context manager (in-memory).

Stores per-session state: current recipe and disliked ingredients.
Suitable for development; replace with Redis/DB for production.
"""

from typing import Dict, Optional, Set, Any, List
from copy import deepcopy


_SESSIONS: Dict[str, Dict[str, Any]] = {}


def get_or_create_session(session_id: str) -> Dict[str, Any]:
    session = _SESSIONS.get(session_id)
    if session is None:
        session = {"current_recipe": None, "dislikes": set(), "messages": []}
        _SESSIONS[session_id] = session
    return session


def get_dislikes(session_id: str) -> Set[str]:
    return set(get_or_create_session(session_id)["dislikes"])  # copy


def add_dislike(session_id: str, ingredient: str) -> None:
    session = get_or_create_session(session_id)
    session["dislikes"].add(ingredient.lower())


def set_current_recipe(session_id: str, recipe: Dict[str, Any]) -> None:
    session = get_or_create_session(session_id)
    session["current_recipe"] = deepcopy(recipe)


def get_current_recipe(session_id: str) -> Optional[Dict[str, Any]]:
    recipe = get_or_create_session(session_id).get("current_recipe")
    return deepcopy(recipe) if recipe else None


def reset_session(session_id: str) -> None:
    if session_id in _SESSIONS:
        del _SESSIONS[session_id]


def _trim_messages(messages: List[Dict[str, str]], max_len: int = 50) -> List[Dict[str, str]]:
    return messages[-max_len:]


def get_messages(session_id: str, limit: int = 20) -> list:
    session = get_or_create_session(session_id)
    msgs = session.get("messages", [])
    return msgs[-limit:]


def append_user_message(session_id: str, text: str) -> None:
    session = get_or_create_session(session_id)
    session.setdefault("messages", []).append({"role": "user", "content": text})
    session["messages"] = _trim_messages(session["messages"]) 


def append_assistant_message(session_id: str, text: str) -> None:
    session = get_or_create_session(session_id)
    session.setdefault("messages", []).append({"role": "assistant", "content": text})
    session["messages"] = _trim_messages(session["messages"]) 
