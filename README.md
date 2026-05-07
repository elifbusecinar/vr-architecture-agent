# 🏗️ VR Architecture – AI Agent Hybrid Platform
### VR Design Review & Automated Operations System

**VR Architecture** is a cutting-edge platform for architects and real estate developers to experience their projects in full 1:1 scale VR via Meta Quest 3, integrated with an intelligent AI operations agent.

🌍 **Live Demo:** [https://vr-architecture-agent.vercel.app](https://vr-architecture-agent.vercel.app)

---

## 🚀 Getting Started

### 1. Project Overview
This repository contains the **Draft Version** of the VR Architecture website, built for the "Web Development and AI Integration" assignment.

### 2. Technologies Used
- **Frontend:** React 19 + TypeScript (Vite)
- **Styling:** Vanilla CSS (Advanced Design System)
- **3D Engine:** Three.js / @react-three/fiber (Web Preview)
- **Backend (Proposed):** .NET 8 (ASP.NET Core API) + PostgreSQL
- **AI Engine (Proposed):** OpenAI GPT-4o Vision + Whisper STT
## 📱 Mobile Access
### 🌐 Web PWA (iOS & Android)
Since the web application is built as a **Progressive Web App (PWA)**, you can access the [Live Demo](https://vr-architecture-agent.vercel.app) from your mobile browser and use the **"Add to Home Screen"** feature to install it as a native-like application.

### 🤖 Android Beta App (Native APK)
You can download the native Android version of the platform directly:

👉 **[Download Android APK](https://expo.dev/accounts/elifbusecinar/projects/mobile/builds/7584e5ad-9c0b-4af7-8490-cdb70cb99c7a)**

![Android Build QR](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://expo.dev/accounts/elifbusecinar/projects/mobile/builds/7584e5ad-9c0b-4af7-8490-cdb70cb99c7a)

## 📦 Project Structure
This project is organized into a monorepo structure:

- **`web-app/`**: The core web platform (React + Vite). High-end dashboard, project management, and AI assistant.
- **`crew_ai_service/`**: Python-based AI service orchestrating multiple agents using **CrewAI** and **LangGraph**.
- **`mobile-app/`**: Companion mobile application (Expo + React Native).
- **`vr-client/`**: VR visualization specialized modules.

## 🧠 AI Agent Architecture
The system utilizes a hybrid AI architecture for architectural auditing:
1.  **CrewAI**: Manages specialized agents (Auditor, Analyst, Expert) for detailed technical tasks.
2.  **LangGraph**: Acts as the master orchestrator, managing stateful flows and a "Review-Refine" loop to ensure audit quality.
3.  **LangSmith**: Integrated for full traceability and performance monitoring of agentic reasoning.
- **`docs/`**: Internal architecture.
```text
/
├── docs/                 # Assignment Planning Documents
├── src/
│   ├── components/       # UI Components (Sidebar, Navbar, Modals)
│   ├── pages/            # Page Views (Landing, Dashboard, Project Detail)
│   ├── services/         # API Service Definitions (Mocked for Draft)
│   ├── styles/           # Global Design System & CSS Variables
│   └── types/            # TypeScript Interface Definitions
├── public/               # Static Assets & 3D Textures
├── index.html            # Entry Point
└── vite.config.ts        # Vite Configuration
```

---
*Assignment: Web Development Fundamentals & AI System Planning*

## ✅ CrewAI + LangGraph (runs locally)
The monorepo includes a Python AI service in `crew_ai_service/` that runs **CrewAI** agents inside a **LangGraph** workflow.

### 1) Start the AI service
```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
pip install -r crew_ai_service/requirements.txt
copy crew_ai_service/.env.example crew_ai_service/.env
uvicorn crew_ai_service.main:app --reload --port 8000
```

### 2) Call the LangGraph workflow
```bash
curl -X POST http://127.0.0.1:8000/audit -H "Content-Type: application/json" -d "{\"model_metadata\":\"3BR apartment, 120m2, seismic zone 2, budget 200k USD\"}"
```

### 3) LangSmith (optional but recommended)
- Add `LANGCHAIN_API_KEY` to `crew_ai_service/.env`
- Tracing is **enabled automatically only when** `LANGCHAIN_API_KEY` is present.

## 🧾 Report (PDF submission)
Fill out `REPORT.md`, paste screenshots, then export it to PDF for submission.

## 🔌 MCP Demo (for class)
The repository includes a runnable **Model Context Protocol (MCP)** demo that shows connection, tool discovery, tool calls, and outputs.

```bash
cd crew_ai_service
pip install -r requirements.txt
python -m crew_ai_service.mcp.client_runner
```

Or via API:

```bash
uvicorn crew_ai_service.main:app --reload --port 8000
# GET http://127.0.0.1:8000/mcp-tools
```

Rich scenario dataset endpoint (for Crew Audit demo):

```bash
# GET http://127.0.0.1:8000/demo-scenarios
```

Presentation guide: `crew_ai_service/docs/MCP_GUIDE.md`

### Crew AI Service folder map

```text
crew_ai_service/
├── api/                # FastAPI routes and HTTP entrypoints
├── agents/             # CrewAI agent factory and role wiring
├── orchestration/      # LangGraph workflow/state orchestration
├── mcp/                # MCP server/client integration layer
├── data/               # Demo scenario datasets
├── docs/               # Service-specific documentation
├── config/             # Agent/task YAML configs
└── main.py             # Compatibility entrypoint (imports api.app)
```
