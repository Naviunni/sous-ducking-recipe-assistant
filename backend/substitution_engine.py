"""Ingredient substitution engine.

Provides common swaps and helpers to apply substitutions to a recipe.
Falls back to LLM (mocked) if a substitution is unknown.
"""

from typing import Dict, List, Set, Any
from copy import deepcopy
from .llm_interface import ask_llm


SUBSTITUTIONS: Dict[str, List[str]] = {
    "mushroom": ["zucchini", "eggplant", "bell pepper"],
    "milk": ["oat milk", "almond milk", "soy milk"],
    "butter": ["olive oil", "coconut oil"],
    "egg": ["flax egg", "chia egg", "applesauce"],
    "cheese": ["nutritional yeast", "vegan cheese"],
    "beef": ["lentils", "mushrooms", "tofu"],
    "chicken": ["tofu", "tempeh", "jackfruit"],
    "pork": ["jackfruit", "seitan"],
    "cream": ["coconut cream", "cashew cream"],
}


def suggest_substitutes(ingredient: str) -> List[str]:
    key = ingredient.lower().strip()
    # direct match
    if key in SUBSTITUTIONS:
        return SUBSTITUTIONS[key]
    # contains match (e.g., "button mushrooms")
    for k, subs in SUBSTITUTIONS.items():
        if k in key:
            return subs
    # fallback to mocked LLM
    resp = ask_llm(f"Suggest simple home-friendly substitutes for {ingredient}.")
    return [resp.get("text", "Try a similar vegetable or plant-based alternative.")]


def apply_substitutions(recipe: Dict[str, Any], dislikes: Set[str]) -> Dict[str, Any]:
    """Return a new recipe with disliked ingredients substituted where possible."""
    new_recipe = deepcopy(recipe)
    dislike_list = sorted({d.lower() for d in dislikes})
    if not dislike_list:
        return new_recipe

    # Replace ingredients
    for ing in new_recipe.get("ingredients", []):
        name = ing.get("name", "").lower()
        for d in dislike_list:
            if d and d in name:
                subs = suggest_substitutes(d)
                if subs:
                    # choose the first suggested substitute
                    ing["name"] = ing["name"].replace(d, subs[0])

    # Best-effort update in steps
    updated_steps = []
    for step in new_recipe.get("steps", []):
        s_lower = step.lower()
        for d in dislike_list:
            if d in s_lower:
                subs = suggest_substitutes(d)
                if subs:
                    step = step.replace(d, subs[0])
        updated_steps.append(step)
    new_recipe["steps"] = updated_steps

    return new_recipe

