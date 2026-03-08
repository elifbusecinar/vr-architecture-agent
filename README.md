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
# VR Architecture Platform

A high-fidelity project management and VR visualization platform for architects and clients. 

## Project Structure

This project is organized into a monorepo structure:

-   **`web-app/`**: The core web platform (React + Vite). High-end dashboard, project management, and AI assistant.
-   **`mobile-app/`**: The companion mobile application (Expo + React Native). On-the-go project tracking and AI assistant.
-   **`vr-client/`**: VR visualization specialized modules.
-   **`docs/`**: Platform documentation and internal roadmap.

## Getting Started

In the root directory, you can use the following commands:

-   `npm run dev`: Start the **Web App** (default)
-   `npm run dev:mobile`: Start the **Mobile App** (Expo)
-   `npm run install:all`: Install dependencies for both projects
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
