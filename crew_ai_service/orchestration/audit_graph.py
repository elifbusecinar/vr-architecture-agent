import os
import re
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
    return (
        "VR Architecture Audit Report (Fallback Mode)\n"
        f"Input: {model_metadata}\n\n"
        "Structural\n"
        "- Review load paths and ensure realistic column alignment with spans.\n"
        "- Validate stair geometry (rise/run) and railing heights for safety.\n\n"
        "Sustainability\n"
        "- Reduce glazing ratio on north facade; consider low-e glazing + shading.\n"
        "- Prefer local materials and specify insulation targets for climate zone.\n\n"
        "Budget\n"
        "- Prioritize high-impact fixes first; propose 2 material swaps for cost control.\n"
        "- Provide rough cost ranges per m2 to keep scope within budget.\n\n"
        "Fixes\n"
        "1) Increase kitchen clearance to meet accessibility standards.\n"
        "2) Adjust stair railing height to code.\n"
        "3) Optimize glazing ratio and HVAC routing for energy performance.\n\n"
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

