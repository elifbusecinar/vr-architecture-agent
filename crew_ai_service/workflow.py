import os
from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, END
from .crew import VRArcCrew
from dotenv import load_dotenv
from pathlib import Path

# Load env reliably even when uvicorn is run from repo root
load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

# LangSmith Integration for tracing and debugging (opt-in)
# We only enable tracing when LANGCHAIN_API_KEY looks real (not a placeholder),
# so local runs won't spam 403 errors.
_ls_key = os.getenv("LANGCHAIN_API_KEY", "")
if _ls_key and not _ls_key.lower().startswith("your_"):
    os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2", "true")
    os.environ.setdefault("LANGCHAIN_PROJECT", "VR-Architecture-Audit-Flow")
else:
    # Force-disable tracing if the repo .env contains placeholders like "your_langchain_api_key"
    os.environ["LANGCHAIN_TRACING_V2"] = "false"

class GraphState(TypedDict):
    """
    Maintains the state of the VR Architecture Audit workflow.
    """
    model_metadata: str
    audit_report: str
    review_status: str
    iterations: int

def run_crew_audit_node(state: GraphState) -> Dict[str, Any]:
    """
    Orchestrates the CrewAI agents to perform the initial architecture audit.
    """
    print(f"\n--- [Node: CrewAI Audit] Iteration {state.get('iterations', 0) + 1} ---")
    
    # Initialize the VR Architecture Crew
    vr_crew = VRArcCrew().crew()
    
    # Execute the crew with the provided model metadata
    result = vr_crew.kickoff(inputs={'model_metadata': state['model_metadata']})
    
    return {
        "audit_report": str(result),
        "iterations": state.get("iterations", 0) + 1
    }

def review_audit_node(state: GraphState) -> Dict[str, Any]:
    """
    Reviews the generated audit report for completeness and quality.
    In a production system, this could be another LLM-based verification step.
    """
    print("--- [Node: Review Audit] Analyzing output quality ---")
    report = state['audit_report']
    
    # Heuristic validation: Check for presence of essential sections
    required_keywords = ["Structural", "Sustainability", "Budget", "Fixes"]
    missing = [word for word in required_keywords if word.lower() not in report.lower()]
    
    # Limit iterations to prevent infinite loops (max 2 iterations)
    if not missing or state['iterations'] >= 2:
        print("   >>> Audit quality passed (or max iterations reached).")
        return {"review_status": "approved"}
    else:
        print(f"   >>> Audit quality rejected. Missing details: {missing}")
        return {"review_status": "rejected"}

def router(state: GraphState):
    """
    Conditional logic to decide whether to finish or re-run the audit.
    """
    if state["review_status"] == "approved":
        return "end"
    else:
        return "audit"

# ==============================================================================
# Graph Construction
# =================:=============================================================

def create_audit_graph():
    # Initialize Graph with the state schema
    workflow = StateGraph(GraphState)

    # Add Nodes
    workflow.add_node("audit", run_crew_audit_node)
    workflow.add_node("review", review_audit_node)

    # Define Graph structure
    workflow.set_entry_point("audit")

    # Direct Edge from Audit to Review
    workflow.add_edge("audit", "review")

    # Conditional logic after Review
    workflow.add_conditional_edges(
        "review",
        router,
        {
            "audit": "audit",
            "end": END
        }
    )

    # Compile the graph into a runnable app
    return workflow.compile()

# Export the compiled graph app
lang_graph_app = create_audit_graph()
