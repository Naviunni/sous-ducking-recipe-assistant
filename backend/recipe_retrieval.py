"""Recipe retrieval from local data (extensible).

For development/offline mode, load from data/recipes.json.
You can extend this to call Spoonacular/Edamam later.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional

from .utils.logging_utils import get_logger


logger = get_logger(__name__)


def _data_path() -> Path:
    return Path(__file__).resolve().parent.parent / "data" / "recipes.json"


def _load_all() -> Dict[str, Any]:
    path = _data_path()
    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        logger.warning("recipes.json not found; returning empty dataset")
        return {"recipes": []}


def get_recipe_by_name(name: str) -> Optional[Dict[str, Any]]:
    name_l = name.lower().strip()
    data = _load_all()
    for r in data.get("recipes", []):
        if r.get("name", "").lower() == name_l:
            return r
        # simple contains match
        if name_l in r.get("name", "").lower():
            return r
    return None

