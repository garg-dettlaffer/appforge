import google.genai as genai
from google.genai import types
import os
import json
import re

client = None

def get_client():
    global client
    if client is None:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return client

async def call_gemini(prompt: str, system: str = "") -> dict:
    """
    Call Gemini and always return a parsed dict.
    Handles JSON extraction if the model wraps it in markdown fences.
    """
    full_prompt = f"{system}\n\n{prompt}" if system else prompt

    try:
        c = get_client()
        response = c.models.generate_content(
            model="gemini-1.5-flash",
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,          # low temp = more deterministic
                top_p=0.8,
                response_mime_type="application/json",  # force JSON output
            )
        )
        raw = response.text.strip()

        # strip markdown fences if present
        raw = re.sub(r"^```json\s*", "", raw)
        raw = re.sub(r"^```\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        parsed = json.loads(raw)

        # attach token usage if available
        try:
            usage = response.usage_metadata
            parsed["_tokens"] = usage.total_token_count
        except Exception:
            parsed["_tokens"] = 0

        return parsed

    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\nRaw: {raw[:300]}")
    except Exception as e:
        raise ValueError(f"Gemini API error: {str(e)}")
