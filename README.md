# 🏗️ VR Architecture – AI Agent Hybrid Platform
### VR Design Review & Automated Operations System

**VR Architecture** is a cutting-edge platform for architects and real estate developers to experience their projects in full 1:1 scale VR via Meta Quest 3, integrated with an intelligent AI operations agent.

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

### 3. Setup and Run Instructions
To run this project locally, ensure you have **Node.js 18+** installed.

```bash
# Clone the repository
git clone https://github.com/[YOUR_USER]/vr-architecture-agent.git

# Enter the directory
cd vr-architecture-agent

# Install dependencies
npm install

# Run the development server
npm run dev
```
The site will be available at `http://localhost:5173`.

---

## 🧠 AI Agent Integration
The **AI Agent Planning Document** describing the future integration of "Archie AI" (Architecture Assistant) can be found in the `docs/` folder:

- [📄 AI Agent Planning Document (Markdown)](./docs/AI_AGENT_PLAN.md)

---

## 📦 Project Structure
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
