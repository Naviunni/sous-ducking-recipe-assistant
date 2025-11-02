"""Minimal OpenAI (gpt-4o) interface for recipe assistant.

Uses the modern OpenAI SDK (v1+) and returns a simple dict: {"text": ...}.
Falls back to a mock response if the package or API key is missing.
"""

from typing import Dict, Optional
import os

try:  # keep a small guard for missing package
    from openai import OpenAI  # type: ignore
except Exception:  # pragma: no cover - package not installed
    OpenAI = None  # type: ignore


_client = None


def _get_client():
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        _client = None
        return None
    base_url = os.getenv("OPENAI_BASE_URL")  # optional (Azure/proxy)
    _client = OpenAI(api_key=api_key, base_url=base_url) if base_url else OpenAI(api_key=api_key)
    return _client


def ask_llm(
    prompt: str,
    system: Optional[str] = None,
    model: Optional[str] = None,
    temperature: float = 0.3,
    max_tokens: int = 300,
) -> Dict[str, str]:
    """Query GPT and return a dict with 'text'."""
    prompt = (prompt or "").strip()
    client = _get_client()
    model_name = model or os.getenv("OPENAI_MODEL", "gpt-4o")
    sys_msg = system or "You are a helpful cooking assistant. Answer clearly and succinctly."

    if not client:
        # Clean mock fallback
        text = "I'm here to help with recipes!" if not prompt else (
            f"[Mock LLM] '{prompt[:160]}'. Configure OPENAI_API_KEY to enable real responses."
        )
        return {"text": text}

    try:
        resp = client.chat.completions.create(
            model=model_name,
            temperature=temperature,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": prompt},
            ],
        )
        text = resp.choices[0].message.content if resp.choices else ""
        return {"text": text or ""}
    except Exception as e:  # pragma: no cover - runtime/network errors
        return {"text": f"LLM error: {e}"}
