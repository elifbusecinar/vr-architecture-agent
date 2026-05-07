import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ..mcp.client_runner import run_mcp_client
from ..orchestration.audit_graph import lang_graph_app


load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
os.environ.setdefault("CREWAI_DISABLE_TELEMETRY", "true")
os.environ.setdefault("OTEL_SDK_DISABLED", "true")

app = FastAPI(title="VR Architecture Crew AI Service")


def _has_real_key(value: str | None) -> bool:
    if not value:
        return False
    normalized = value.strip().lower()
    return bool(normalized) and not normalized.startswith("your_")


class AuditRequest(BaseModel):
    model_metadata: str


@app.post("/audit")
async def run_audit(request: AuditRequest):
    try:
        if not _has_real_key(os.getenv("GOOGLE_API_KEY")) and not _has_real_key(os.getenv("OPENAI_API_KEY")):
            raise HTTPException(status_code=500, detail="Missing API Key in environment")

        initial_state = {"model_metadata": request.model_metadata, "iterations": 0}
        final_state = lang_graph_app.invoke(initial_state)
        return {
            "status": "success",
            "iterations": int(final_state.get("iterations", 0)),
            "audit_report": final_state.get("audit_report", ""),
            "audit_metrics": final_state.get("audit_metrics", {}),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/")
def home():
    return {"message": "VR Architecture Crew AI Service is running"}


@app.get("/mcp-tools")
async def mcp_tools():
    try:
        result = await run_mcp_client(verbose=False)
        return {"status": "success", "mcp_demo": result}
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"MCP tools flow failed: {error}")


@app.get("/mcp-demo")
async def mcp_demo_alias():
    return await mcp_tools()


@app.get("/demo-scenarios")
def get_demo_scenarios():
    try:
        scenarios_path = Path(__file__).resolve().parent.parent / "data" / "demo_scenarios.json"
        with scenarios_path.open("r", encoding="utf-8") as file:
            scenarios = json.load(file)
        return {"status": "success", "scenarios": scenarios}
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Could not load demo scenarios: {error}")

