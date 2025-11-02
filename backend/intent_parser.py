"""Intent parsing (LLM-based).

Maps free-form user utterances to structured intents so the backend can
handle them deterministically.

Intent schema:
{
  "intent": "get_recipe" | "add_dislike" | "replace" | "smalltalk" | "unknown",
  "recipe_name": string | null,
  "dislikes": string[],
  "replacements": [{"src": string, "dst": string}]
}

If LLM is not available or returns invalid JSON, returns a best-effort empty/unknown intent.
"""

from typing import Dict, List, Optional
from .llm_interface import chat_json, has_llm


def parse_intent(message: str, history: Optional[List[Dict]] = None) -> Dict:
    """Parse a user message into a structured intent using the LLM (JSON mode).

    history: optional prior chat turns as list of {role, content}
    """
    message = (message or "").strip()
    if not message or not has_llm():
        return {"intent": "unknown", "recipe_name": None, "dislikes": [], "replacements": []}

    sys = (
        "You are an intent parser for a recipe assistant. Return ONLY JSON following this schema: "
        "{intent: one of [get_recipe, add_dislike, replace, smalltalk, unknown], "
        "recipe_name: string|null, dislikes: string[], replacements: [{src:string, dst:string}]}. "
        "Normalize typos. If user asks for a recipe by name, set intent=get_recipe and fill recipe_name. "
        "If user expresses a dislike or allergy or can't have something, set intent=add_dislike and put those terms in dislikes. "
        "If user requests replacements (e.g., 'replace milk with oat milk', 'use oat milk instead of milk'), set intent=replace and fill replacements. "
        "If the message is just chit-chat, set intent=smalltalk."
    )

    msgs = [{"role": "system", "content": sys}]
    if history:
        for m in history[-6:]:
            if m.get("role") in ("user", "assistant") and m.get("content"):
                msgs.append({"role": m["role"], "content": m["content"]})
    msgs.append({"role": "user", "content": message})

    out = chat_json(msgs, max_tokens=300)
    if not isinstance(out, dict):
        return {"intent": "unknown", "recipe_name": None, "dislikes": [], "replacements": []}

    intent = out.get("intent") or "unknown"
    recipe_name = out.get("recipe_name") if isinstance(out.get("recipe_name"), str) else None
    dislikes = out.get("dislikes") if isinstance(out.get("dislikes"), list) else []
    replacements = out.get("replacements") if isinstance(out.get("replacements"), list) else []
    # Normalize replacement items
    norm_repl = []
    for r in replacements:
        if isinstance(r, dict):
            src = r.get("src") or r.get("from")
            dst = r.get("dst") or r.get("to")
            if src and dst:
                norm_repl.append({"src": str(src), "dst": str(dst)})

    return {
        "intent": intent,
        "recipe_name": recipe_name,
        "dislikes": [str(d) for d in dislikes if isinstance(d, str)],
        "replacements": norm_repl,
    }

