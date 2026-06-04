from gemini_client import call_gemini

SYSTEM = """
You are Stage 01 of a multi-stage app compiler pipeline called AppForge.
Your ONLY job is to extract structured intent from a natural language product description.
Output STRICT JSON. No explanations. No markdown. Only the JSON object.
"""

PROMPT_TEMPLATE = """
Extract structured intent from this product description:

\"\"\"{prompt}\"\"\"

Return this exact JSON structure:

{{
  "app_name": "derived short name",
  "app_type": "crm|ecommerce|saas|social|marketplace|tool|other",
  "entities": [
    {{ "name": "entity name", "description": "what it is" }}
  ],
  "features": [
    {{ "name": "feature name", "description": "what it does", "priority": "must|should|could" }}
  ],
  "user_roles": ["admin", "user", "guest"],
  "auth_required": true,
  "has_payments": false,
  "has_analytics": false,
  "has_notifications": false,
  "assumptions": [
    "assumption 1 you made",
    "assumption 2 you made"
  ],
  "clarifications_needed": [],
  "complexity": "low|medium|high"
}}

Rules:
- If something is vague, make a reasonable assumption and add it to assumptions[]
- If the prompt is too vague to work with at all, add clarifying questions to clarifications_needed[]
- entities should be the core data models (e.g. User, Contact, Order, Product)
- features should be distinct functional capabilities
"""


async def extract_intent(prompt: str) -> dict:
    if len(prompt.strip()) < 10:
        return {
            "app_name": "Unknown",
            "app_type": "other",
            "entities": [],
            "features": [],
            "user_roles": ["user"],
            "auth_required": False,
            "has_payments": False,
            "has_analytics": False,
            "has_notifications": False,
            "assumptions": [],
            "clarifications_needed": ["Prompt is too short. Please describe what your app should do."],
            "complexity": "low",
            "_tokens": 0,
        }

    result = await call_gemini(
        PROMPT_TEMPLATE.format(prompt=prompt),
        system=SYSTEM,
    )

    # guarantee required keys exist
    defaults = {
        "app_name": "MyApp",
        "app_type": "other",
        "entities": [],
        "features": [],
        "user_roles": ["user"],
        "auth_required": True,
        "has_payments": False,
        "has_analytics": False,
        "has_notifications": False,
        "assumptions": [],
        "clarifications_needed": [],
        "complexity": "medium",
    }
    for k, v in defaults.items():
        if k not in result:
            result[k] = v

    return result
