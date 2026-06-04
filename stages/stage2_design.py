from gemini_client import call_gemini

SYSTEM = """
You are Stage 02 of AppForge — a multi-stage app compiler.
You receive structured intent from Stage 01 and output a complete system architecture.
Output STRICT JSON only. No explanations. No markdown fences.
"""

PROMPT_TEMPLATE = """
You are designing the system architecture for an app based on this intent:

{intent_json}

Generate a complete system architecture. Return this exact JSON:

{{
  "app_name": "{app_name}",
  "db_design": {{
    "tables": [
      {{
        "name": "table_name",
        "purpose": "what this table stores",
        "columns": [
          {{ "name": "col_name", "type": "uuid|text|varchar|int|boolean|timestamp|decimal|jsonb", "nullable": false, "primary_key": false, "foreign_key": null }}
        ],
        "indexes": ["col_name"],
        "relations": [
          {{ "type": "one_to_many|many_to_many|one_to_one", "with": "other_table", "via": "foreign_key_col" }}
        ]
      }}
    ]
  }},
  "api_design": {{
    "base_path": "/api/v1",
    "endpoints": [
      {{
        "id": "unique_id",
        "method": "GET|POST|PUT|DELETE|PATCH",
        "path": "/resource",
        "description": "what it does",
        "auth_required": true,
        "roles": ["admin", "user"],
        "request_body": {{ "field": "type" }},
        "response_schema": {{ "field": "type" }},
        "db_table": "table_name",
        "business_logic": "any special rules"
      }}
    ]
  }},
  "auth_design": {{
    "strategy": "jwt",
    "token_expiry": "24h",
    "roles": ["admin", "user", "guest"],
    "permissions": {{
      "admin": {{ "contacts": ["read", "write", "delete"], "analytics": ["read"] }},
      "user": {{ "contacts": ["read", "write"] }},
      "guest": {{ "contacts": ["read"] }}
    }},
    "protected_routes": ["/dashboard", "/admin"]
  }},
  "ui_design": {{
    "pages": [
      {{
        "id": "page_id",
        "name": "Page Name",
        "route": "/route",
        "auth_required": true,
        "role_access": ["admin", "user"],
        "layout": "dashboard|auth|landing|detail",
        "components": [
          {{
            "id": "comp_id",
            "type": "table|form|chart|card|modal|nav|list|stats",
            "title": "Component Title",
            "data_source_endpoint": "endpoint_id",
            "props": {{}}
          }}
        ]
      }}
    ],
    "navigation": {{
      "type": "sidebar|topbar|both",
      "items": [ {{ "label": "label", "route": "/route", "icon": "icon_name", "role_access": ["admin", "user"] }} ]
    }}
  }},
  "business_logic": [
    {{
      "rule": "rule name",
      "description": "what the rule enforces",
      "affects": ["endpoint_id or component_id"]
    }}
  ]
}}

Rules:
- ALWAYS include a users table with: id, email, password_hash, role, created_at
- Every table MUST have an id (uuid, primary_key: true) and created_at (timestamp)
- Every POST/PUT endpoint must have a matching db_table
- Role permissions must cover all roles defined in auth_design.roles
- Generate realistic endpoints for all features in the intent
"""


async def design_system(intent: dict) -> dict:
    import json

    result = await call_gemini(
        PROMPT_TEMPLATE.format(
            intent_json=json.dumps(intent, indent=2),
            app_name=intent.get("app_name", "MyApp"),
        ),
        system=SYSTEM,
    )

    # guarantee top-level keys
    for key in ["db_design", "api_design", "auth_design", "ui_design", "business_logic"]:
        if key not in result:
            result[key] = {}

    if "tables" not in result.get("db_design", {}):
        result["db_design"]["tables"] = []

    if "endpoints" not in result.get("api_design", {}):
        result["api_design"]["endpoints"] = []

    if "pages" not in result.get("ui_design", {}):
        result["ui_design"]["pages"] = []

    return result
