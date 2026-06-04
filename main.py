from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import time
import os

load_dotenv(override=True)

from stages.stage1_intent import extract_intent
from stages.stage2_design import design_system
from stages.stage3_schema import generate_schemas
from stages.stage4_repair import validate_and_repair
from models.schemas import PipelineResult, EvalResult
from eval.eval_runner import run_eval_suite, get_eval_results

app = FastAPI(title="AppForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str


# ── Health check ──────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


# ── Individual stage endpoints ────────────────────────────────
@app.post("/extract-intent")
async def route_extract_intent(req: PromptRequest):
    if not req.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty")
    result = await extract_intent(req.prompt)
    return result


@app.post("/design-system")
async def route_design_system(req: dict):
    result = await design_system(req)
    return result


@app.post("/generate-schemas")
async def route_generate_schemas(req: dict):
    result = await generate_schemas(req)
    return result


@app.post("/validate-repair")
async def route_validate_repair(req: dict):
    result = await validate_and_repair(req)
    return result


# ── Full pipeline (single call from frontend) ─────────────────
@app.post("/pipeline/run")
async def run_full_pipeline(req: PromptRequest):
    if not req.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty")

    start = time.time()
    retries = 0
    logs = []

    def log(msg: str):
        ts = time.strftime("%H:%M:%S")
        logs.append(f"[{ts}] {msg}")

    try:
        # STAGE 1 — Intent Extraction
        log("Initializing pipeline...")
        log("Stage 01: Extracting intent from prompt...")
        intent = await extract_intent(req.prompt)
        log(f"Stage 01: Complete. Entities found: {len(intent.get('entities', []))}")

        # STAGE 2 — System Design
        log("Stage 02: Designing system architecture...")
        arch = await design_system(intent)
        tables = len(arch.get("db_design", {}).get("tables", []))
        endpoints = len(arch.get("api_design", {}).get("endpoints", []))
        log(f"Stage 02: Complete. Tables: {tables}, Endpoints: {endpoints}")

        # STAGE 3 — Schema Generation
        log("Stage 03: Generating schemas...")
        schema = await generate_schemas(arch)
        log("Stage 03: Complete. Validating...")

        # STAGE 4 — Repair Engine
        log("Stage 04: Repair engine scanning...")
        repaired, repair_log, r_count = await validate_and_repair(schema)
        retries += r_count
        for entry in repair_log:
            log(f"⚠ {entry}")
        if r_count == 0:
            log("Stage 04: No issues found.")
        else:
            log(f"Stage 04: Complete. {r_count} repair(s) made.")

        latency = int((time.time() - start) * 1000)
        log(f"✓ Pipeline complete. Output ready. ({latency}ms)")

        return {
            "status": "success",
            "stages": {
                "intent": intent,
                "architecture": arch,
                "schema": schema,
                "repaired": repaired,
            },
            "repair_log": repair_log,
            "assumptions": intent.get("assumptions", []),
            "metrics": {
                "latency_ms": latency,
                "retries": retries,
                "tokens_used": intent.get("_tokens", 0)
                              + arch.get("_tokens", 0)
                              + schema.get("_tokens", 0),
                "confidence": repaired.get("_confidence", 85),
            },
            "logs": logs,
        }

    except Exception as e:
        log(f"✗ Pipeline failed: {str(e)}")
        raise HTTPException(500, detail={"message": str(e), "logs": logs})


# ── Eval endpoints ────────────────────────────────────────────
@app.get("/eval/results")
async def eval_results():
    return get_eval_results()


@app.post("/eval/run")
async def eval_run():
    results = await run_eval_suite()
    return results
