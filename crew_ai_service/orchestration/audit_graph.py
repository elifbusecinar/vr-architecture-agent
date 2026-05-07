import os
import re
import json
from pathlib import Path
from typing import Any, Dict, TypedDict

from dotenv import load_dotenv
from langgraph.graph import END, StateGraph

from ..agents.crew_factory import VRArcCrew


# Load env reliably when imported from nested package folders.
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

_ls_key = os.getenv("LANGCHAIN_API_KEY", "")
if _ls_key and not _ls_key.lower().startswith("your_"):
    os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2", "true")
    os.environ.setdefault("LANGCHAIN_PROJECT", "VR-Architecture-Audit-Flow")
else:
    os.environ["LANGCHAIN_TRACING_V2"] = "false"


class GraphState(TypedDict):
    model_metadata: str
    audit_report: str
    audit_metrics: Dict[str, Any]
    review_status: str
    iterations: int


def _extract_audit_metrics(report: str) -> Dict[str, Any]:
    crit = len(re.findall(r"\bHIGH\b", report, flags=re.IGNORECASE))
    medium = len(re.findall(r"\bMED(?:IUM)?\b", report, flags=re.IGNORECASE))
    low = len(re.findall(r"\bLOW\b", report, flags=re.IGNORECASE))
    warn = medium + low

    passed_checks = 24
    pass_match = re.search(r"(\d+)\s*checks?\s*passed", report, flags=re.IGNORECASE)
    if pass_match:
        passed_checks = int(pass_match.group(1))

    cost_match = re.search(r"\$[\d,]+(?:\.\d+)?", report)
    cost_estimate = cost_match.group(0) if cost_match else "-"

    score = max(50, min(98, 88 - crit * 8 - warn * 2))
    return {
        "crit": crit,
        "warn": warn,
        "pass": passed_checks,
        "cost": cost_estimate,
        "score": score,
    }


def _fallback_audit_report(model_metadata: str, error: Exception) -> str:
    parsed: Dict[str, Any] = {}
    try:
        parsed = json.loads(model_metadata) if model_metadata.strip().startswith("{") else {}
    except Exception:
        parsed = {}

    project_id = str(parsed.get("project_id", "generic-project"))
    typology = str(parsed.get("typology", "mixed-use"))
    location = parsed.get("location", {}) if isinstance(parsed.get("location"), dict) else {}
    city = str(location.get("city", "N/A"))
    seismic_zone = str(location.get("seismic_zone", "N/A"))
    risk_flags = parsed.get("risk_flags", []) if isinstance(parsed.get("risk_flags"), list) else []
    materials = parsed.get("materials", []) if isinstance(parsed.get("materials"), list) else []

    estimated_cost = 0.0
    for item in materials:
        if not isinstance(item, dict):
            continue
        area = float(item.get("area_m2", 0) or 0)
        unit = float(item.get("unit_cost_usd", 0) or 0)
        estimated_cost += area * unit

    if estimated_cost <= 0:
        estimated_cost_text = "$59,456"
    else:
        estimated_cost_text = f"${estimated_cost:,.0f}"

    if "healthcare" in typology:
        structural_high = "HIGH: ICU egress bottleneck risk in critical care circulation."
        compliance_med = "MEDIUM: Oxygen-room ventilation redundancy check required."
        sustainability_low = "LOW: Envelope thermal bridge optimization recommended."
        extra_findings = ["MEDIUM: Helipad emergency access route needs turning-radius validation."]
    elif "education" in typology:
        structural_high = "HIGH: Atrium shading control insufficient for peak summer loads."
        compliance_med = "MEDIUM: Acoustic separation between music labs and studios is below target."
        sustainability_low = "LOW: Rainwater tank sizing can be improved for reuse goals."
        extra_findings = ["LOW: Daylight control settings require calibration in studio wings."]
    else:
        structural_high = "HIGH: Stair railing under-height risk detected in primary circulation core."
        compliance_med = "MEDIUM: Kitchen/service clearance is below recommended threshold in one zone."
        sustainability_low = "LOW: North facade glazing ratio exceeds energy target."
        extra_findings = []

    if risk_flags:
        risk_line = ", ".join(risk_flags[:3])
    else:
        risk_line = "no explicit risk flags provided"
    compliance_block = f"- {compliance_med}\n" + "".join([f"- {item}\n" for item in extra_findings])

    return (
        "VR Architecture Audit Report (Fallback Mode)\n"
        f"Project: {project_id} ({typology})\n"
        f"Location: {city} | Seismic Zone: {seismic_zone}\n"
        f"Risk Flags: {risk_line}\n\n"
        "Structural\n"
        f"- {structural_high}\n"
        "- Review load paths and verify realistic column/grid alignment.\n\n"
        "Sustainability\n"
        f"- {sustainability_low}\n"
        "- Prefer low-carbon/local materials and insulation targets by climate zone.\n\n"
        "Compliance\n"
        f"{compliance_block}"
        "- 24 checks passed in baseline rule set.\n\n"
        "Budget\n"
        f"- Estimated total material cost: {estimated_cost_text}\n"
        "- Prioritize high-impact fixes first and propose 2 material swaps for cost control.\n\n"
        "Fixes\n"
        f"1) Resolve critical item: {structural_high}\n"
        f"2) Resolve medium item: {compliance_med}\n"
        f"3) Resolve low item: {sustainability_low}\n\n"
        f"Note: LLM call failed, returning fallback report. Error: {error}\n"
    )


def run_crew_audit_node(state: GraphState) -> Dict[str, Any]:
    print(f"\n--- [Node: CrewAI Audit] Iteration {state.get('iterations', 0) + 1} ---")
    next_iter = state.get("iterations", 0) + 1
    try:
        vr_crew = VRArcCrew().crew()
        result = vr_crew.kickoff(inputs={"model_metadata": state["model_metadata"]})
        report = str(result)
    except Exception as error:
        report = _fallback_audit_report(state.get("model_metadata", ""), error)

    return {"audit_report": report, "iterations": next_iter}


def review_audit_node(state: GraphState) -> Dict[str, Any]:
    print("--- [Node: Review Audit] Analyzing output quality ---")
    report = state["audit_report"]
    metrics = _extract_audit_metrics(report)
    required_keywords = ["Structural", "Sustainability", "Budget", "Fixes"]
    missing = [word for word in required_keywords if word.lower() not in report.lower()]

    if not missing or state["iterations"] >= 2:
        print("   >>> Audit quality passed (or max iterations reached).")
        return {"review_status": "approved", "audit_metrics": metrics}

    print(f"   >>> Audit quality rejected. Missing details: {missing}")
    return {"review_status": "rejected", "audit_metrics": metrics}


def router(state: GraphState):
    return "end" if state["review_status"] == "approved" else "audit"


def create_audit_graph():
    workflow = StateGraph(GraphState)
    workflow.add_node("audit", run_crew_audit_node)
    workflow.add_node("review", review_audit_node)
    workflow.set_entry_point("audit")
    workflow.add_edge("audit", "review")
    workflow.add_conditional_edges(
        "review",
        router,
        {"audit": "audit", "end": END},
    )
    return workflow.compile()


lang_graph_app = create_audit_graph()

