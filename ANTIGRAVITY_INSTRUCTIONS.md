# 🤖 Antigravity Project Handover: VR Architecture Agent (Homework Edition)

## 🎯 Project Objective
This is a **Lite / Draft version** of the VR Architecture platform, tailored for a university assignment. The goal is to demonstrate a working website and a professional AI Agent integration plan.

## 🏗️ Architecture & State
- **Framework:** React 19 + Vite + TypeScript.
- **Backend:** **DISCONNECTED**. Do not attempt to fix API errors or SignalR connections.
- **Data Strategy:** **MOCKED**. All project data, annotations, and auth states are handled by `src/services/mockData.ts`.
- **Services:** `auth.service.ts` and `project.service.ts` have been modified to return static mock data.

## 📍 Key Locations
- **AI Planning Doc:** `docs/AI_AGENT_PLAN.md` (2-4 page required document).
- **Mock Data:** `src/services/mockData.ts` (Edit this for demo data changes).
- **Styles:** `src/styles/` (Professional architecture design system).
- **VR Client Docs:** `vr-client/` (Unity scripts and logic for demonstration).

## 🚀 Next Steps (Action Items)
1. **Design Implementation:** The USER will provide a design/UI specification for the "AI Agent" (Archie). We need to implement this as a UI layer (e.g., Side panel, Floating Chatbot, or AI Insights Tab).
2. **Public Repo Prep:** Ensure all `.env` and private keys are removed before the user pushes this to a Public GitHub repo.
3. **Draft Functionality:** Every "AI Button" should trigger a simulated analysis (using the mock data) to fulfill the "Draft Working Website" requirement.

---
**Current Priority:** Wait for the USER to provide the AI Agent design, then implement it within this clean workspace.
