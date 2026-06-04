from gemini_client import call_gemini

SYSTEM = """
You are Stage 03 of AppForge — a multi-stage app compiler.
You receive system architecture from Stage 02 and generate the final 4-layer schema.
This schema must be executable — no vague types, no missing fields.
Output STRICT JSON only. No explanations. No markdown fences.
"""

PROMPT_TEMPLATE = """
Generate the final 4-layer executable schema from this architecture:

{arch_json}

Return this exact JSON structure:

{{
  "meta": {{
    "app_name": "{app_name}",
    "version": "1.0.0",
    "generated_at": "ISO_TIMESTAMP",
    "assumptions": []
  }},
  "ui": {{
    "pages": [
      {{
        "id": "page_id",
        "name": "Page Name",
        "route": "/route",
        "auth_required": true,
        "role_access": ["admin", "user"],
        "components": [
          {{
            "id": "comp_id",
            "type": "table|form|chart|card|modal|nav",
            "title": "Title",
            "data_source": "endpoint_id",
            "fields": [
              {{ "name": "field_name", "label": "Field Label", "type": "text|email|password|number|select|checkbox|date", "required": true }}
            ],
            "props": {{}}
          }}
        ]
      }}
    ],
    "navigation": []
  }},
  "api": {{
    "base_url": "/api/v1",
    "endpoints": [
      {{
        "id": "endpoint_id",
        "method": "GET|POST|PUT|DELETE|PATCH",
        "path": "/resource/:id",
        "auth_required": true,
        "roles": ["admin", "user"],
        "request_body": {{
          "fields": [
            {{ "name": "field_name", "type": "string|number|boolean|array|object", "required": true, "validation": "rule" }}
          ]
        }},
        "response": {{
          "success_status": 200,
          "schema": {{ "field": "type" }}
        }},
        "db_table": "table_name",
        "business_logic": []
      }}
    ]
  }},
  "db": {{
    "tables": [
      {{
        "name": "table_name",
        "columns": [
          {{ "name": "id", "type": "uuid", "nullable": false, "primary_key": true, "default": "gen_random_uuid()" }},
          {{ "name": "created_at", "type": "timestamp", "nullable": false, "default": "now()" }}
        ],
        "indexes": [],
        "foreign_keys": [
          {{ "column": "user_id", "references_table": "users", "references_column": "id", "on_delete": "CASCADE" }}
        ]
      }}
    ],
    "migrations": [
      {{ "order": 1, "description": "Create users table", "table": "users" }}
    ]
  }},
  "auth": {{
    "strategy": "jwt",
    "jwt_secret_env": "JWT_SECRET",
    "token_expiry_hours": 24,
    "roles": ["admin", "user", "guest"],
    "permissions": {{
      "admin": {{}},
      "user": {{}},
      "guest": {{}}
    }},
    "middleware": [
      {{ "path_pattern": "/api/v1/admin/*", "required_role": "admin" }}
    ]
  }}
}}

Critical rules:
- Every UI component's data_source must match an existing API endpoint id
- Every API endpoint's db_table must match an existing DB table name
- Every form field must correspond to a DB column in the relevant table
- Auth permissions must reference real DB tables as resource names
- The migrations array must list tables in dependency order (users first)
- Use realistic data types — no "string" for emails (use "varchar(255)"), no "number" for prices (use "decimal(10,2)")
"""


async def generate_schemas(arch: dict) -> dict:
    import json
    from datetime import datetime

    result = await call_gemini(
        PROMPT_TEMPLATE.format(
            arch_json=json.dumps(arch, indent=2),
            app_name=arch.get("app_name", "MyApp"),
        ),
        system=SYSTEM,
    )

    # Inject real timestamp
    if "meta" in result:
        result["meta"]["generated_at"] = datetime.utcnow().isoformat() + "Z"

    # Guarantee top-level keys
    for key in ["meta", "ui", "api", "db", "auth"]:
        if key not in result:
            result[key] = {}

    return result
