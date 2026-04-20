# VR Architecture Agent — LangGraph + CrewAI Report

**Student**: <your name>  
**Course / Section**: <course>  
**Date**: 2026-04-20  
**Repository**: <paste your GitHub repo link>

## 1) Goal
Add **LangGraph** to the existing project (alongside **CrewAI**) to orchestrate a stateful audit flow with a review/refine loop, with optional **LangSmith** tracing.

## 2) What I implemented
- **CrewAI multi-agent audit** (`crew_ai_service/crew.py`)
  - Architecture Auditor
  - Structural Safety Analyst
  - Sustainability & Cost Expert
- **LangGraph orchestrator** (`crew_ai_service/workflow.py`)
  - Node `audit`: runs the CrewAI crew kickoff
  - Node `review`: validates output quality via required sections
  - Conditional routing: approve → end, reject → re-run audit (max 2 iterations)
- **API endpoint** (`crew_ai_service/main.py`)
  - `POST /audit` runs the graph with the provided `model_metadata`
- **LangSmith tracing (optional)**
  - Enabled only when `LANGCHAIN_API_KEY` is set (so local runs don’t break)

## 3) How to run (steps)
### 3.1 Backend AI service (CrewAI + LangGraph)
From repo root:

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
pip install -r crew_ai_service/requirements.txt

# Copy env template and fill keys
copy crew_ai_service/.env.example crew_ai_service/.env

uvicorn crew_ai_service.main:app --reload --port 8000
```

Test request (example):

```bash
curl -X POST http://127.0.0.1:8000/audit -H "Content-Type: application/json" -d "{\"model_metadata\":\"3BR apartment, 120m2, seismic zone 2, budget 200k USD\"}"
```

### 3.2 Frontend (optional, if you’re showing UI)
From repo root:

```bash
cd web-app
npm install
npm run dev
```

## 4) Screenshots (required)
Paste screenshots below before exporting to PDF.

### Screenshot A — LangGraph / audit flow running
<paste screenshot here: terminal output or API response showing `iterations` and `audit_report`>

### Screenshot B — UI evidence (if applicable)
<paste screenshot here: your web UI showing audit/orchestration output>

### Screenshot C — LangSmith trace (optional but recommended)
<paste screenshot here: a trace from the LangSmith project>

## 5) Key features to discuss in class
- **Why LangGraph**: stateful orchestration + conditional loops (review/refine) on top of agent execution
- **Why CrewAI**: specialized multi-agent decomposition inside a single graph node
- **State model** (`GraphState`): carries `model_metadata`, `audit_report`, `review_status`, `iterations`
- **Quality gate**: `review` node checks for required sections and routes accordingly
- **Safety**: loop capped at 2 iterations to avoid infinite retries
- **Observability**: LangSmith tracing is opt-in via `LANGCHAIN_API_KEY`

## 6) Export to PDF (submission)
- In VS Code / Cursor: open this file → “Markdown PDF: Export (pdf)” (if installed), or
- Use a browser: render Markdown (or copy to Google Docs) → “File → Download → PDF”.

