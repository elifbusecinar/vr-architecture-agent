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
- **`mobile-app/`**: Companion mobile application (Expo + React Native).
- **`vr-client/`**: VR visualization specialized modules.
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
