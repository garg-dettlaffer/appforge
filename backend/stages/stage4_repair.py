import json
from gemini_client import call_gemini

SYSTEM = """
You are Stage 04 of AppForge — the Repair Engine.
You receive a generated 4-layer schema and fix ALL inconsistencies.
Output STRICT JSON only. No explanations. No markdown fences.
"""

REPAIR_PROMPT = """
You are the repair engine. Scan this schema for inconsistencies and fix them.

{schema_json}

Issues to detect and fix:
1. UI component data_source references an endpoint id that doesn't exist → fix by matching to closest real endpoint
2. API endpoint db_table references a table that doesn't exist → fix by matching to closest real table
3. Form fields in UI that don't exist as columns in the referenced DB table → remove or add the column
4. Auth permissions that reference resources not in DB tables → remove them
5. Missing required fields (id, created_at) in any DB table → add them
6. Endpoints with no db_table assigned → assign the most logical table
7. Auth middleware paths that reference non-existent routes → remove them

Return:
{{
  "repaired_schema": {{ ...the full corrected schema identical structure to input... }},
  "repairs_made": [
    {{ "layer": "ui|api|db|auth", "issue": "description", "fix": "what was changed" }}
  ],
  "confidence_score": 85,
  "is_valid": true
}}

If no repairs needed, return repairs_made as empty array and is_valid as true.
"""


def _check_structure(schema: dict) -> list[str]:
    """
    Fast local checks before sending to Gemini.
    Returns list of issue descriptions.
    """
    issues = []

    # collect known endpoint ids
    endpoint_ids = {
        ep.get("id")
        for ep in schema.get("api", {}).get("endpoints", [])
        if ep.get("id")
    }

    # collect known table names
    table_names = {
        t.get("name")
        for t in schema.get("db", {}).get("tables", [])
        if t.get("name")
    }

    # check UI → API consistency
    for page in schema.get("ui", {}).get("pages", []):
        for comp in page.get("components", []):
            ds = comp.get("data_source")
            if ds and ds not in endpoint_ids:
                issues.append(
                    f"UI component '{comp.get('id')}' references unknown endpoint '{ds}'"
                )

    # check API → DB consistency
    for ep in schema.get("api", {}).get("endpoints", []):
        tbl = ep.get("db_table")
        if tbl and tbl not in table_names:
            issues.append(
                f"API endpoint '{ep.get('id')}' references unknown table '{tbl}'"
            )

    # check every table has id + created_at
    for tbl in schema.get("db", {}).get("tables", []):
        col_names = {c.get("name") for c in tbl.get("columns", [])}
        if "id" not in col_names:
            issues.append(f"Table '{tbl.get('name')}' missing primary key 'id'")
        if "created_at" not in col_names:
            issues.append(f"Table '{tbl.get('name')}' missing 'created_at' column")

    return issues


async def validate_and_repair(schema: dict) -> tuple[dict, list[str], int]:
    """
    Returns: (repaired_schema, repair_log, retry_count)
    """
    issues = _check_structure(schema)

    # If no local issues found, do a light Gemini pass anyway
    # to catch semantic issues the local checker misses
    result = await call_gemini(
        REPAIR_PROMPT.format(schema_json=json.dumps(schema, indent=2)),
        system=SYSTEM,
    )

    repaired = result.get("repaired_schema", schema)
    repairs = result.get("repairs_made", [])
    confidence = result.get("confidence_score", 85)
    retries = 1 if repairs else 0

    # Merge local issue descriptions into repair log
    all_logs = [r.get("issue", "") + " → " + r.get("fix", "") for r in repairs]
    all_logs += [f"Local check: {i}" for i in issues]

    repaired["_confidence"] = confidence
    repaired["_repaired"] = bool(repairs)

    return repaired, all_logs, retries
