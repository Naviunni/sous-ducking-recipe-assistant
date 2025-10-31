"""LLM interface wrapper (mock).

Replace `ask_llm` with calls to a real model (OpenAI, Ollama, etc.).
"""

from typing import Dict


def ask_llm(prompt: str) -> Dict[str, str]:
    """Return a mock LLM response.

    Args:
        prompt: The user/system prompt to send to the LLM.

    Returns:
        A dict with a 'text' field containing a mock response.
    """
    prompt = prompt.strip()
    if not prompt:
        return {"text": "I'm here to help with recipes!"}
    return {
        "text": (
            "[Mock LLM] I understood your request: '"
            + prompt[:160]
            + "'. For now, try asking for a recipe like 'recipe for lasagna'."
        )
    }

