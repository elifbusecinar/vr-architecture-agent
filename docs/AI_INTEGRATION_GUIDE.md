# 🏗️ VR Architecture Platform: AI Agent Integration Guide (v1.7)

This document is the definitive guide for migrating the **Archie AI Agent** features into your production environment. It covers **Web Dashboard** styling, **Mobile App** intelligence, and **Unity VR** native action mapping.

---

## 🎨 1. Web Dashboard (React / Vite)
*Focus: Obsidian aesthetics, navbar transformation, and interactive AI components.*

### 🌓 Dark Theme & Navbar
-   **Navbar Shift:** The globally dominant white navbar has been transitioned to **Obsidian Black**.
    -   **File:** `src/styles/vr-interface.css`
    -   **CSS Selector:** `.vr-ui .vr-nav`
    -   **Style:** `background: rgba(13, 12, 11, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.06);`
    -   **Logo/Text:** Update colors to `rgba(245, 243, 239, 0.8)` (var `--vr-paper`).

### ✨ Design Tokens
-   **Typography:** Maintain the **Instrument Serif** / **Geist Sans** pairing for a high-end architectural portfolio feel.
-   **Glassmorphism:** All AI cards should use `--vr-glass` (rgba 26, 25, 23, 0.55).
-   **Visual cleanup:** Redundant chat placeholders (like Screen 27) were pruned to simplify the user journey.

---

## 📱 2. Mobile Companion (React Native / Expo)
*Focus: Automated project insights and assistant chat logic.*

### 📂 Service Integration
Copy `mobile-app/src/services/ai.service.ts` to your project.
-   **Dashboard Briefing:** Use `getDashboardInsights(projects)` to summarize project status into 2 sentences + 2 suggestions.
-   **Assistant:** Use `askAssistant(prompt, context)` to provide a persistent, context-aware architectural guide on mobile.

### 🔑 Environment Setup
Add to `.env` (and ensure it's in `.gitignore`):
```bash
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...your_key
```

---

## 🎮 3. Unity VR Client (C#)
*Focus: Multimodal audio processing and intent mapping.*

### 🎤 Native Multimodal Pipeline
Instead of relying on a middleman server, Unity now speaks directly to Gemini's **Multimodal API**.
-   **WAV Encoder:** Integrated into `VoiceCaptureManager.cs` to convert microphone buffers to Base64 WAV.
-   **GeminiService:** Sends audio with a specialized architectural prompt.

### 📂 File Migration List
| Directory | Files to Move |
| :--- | :--- |
| `Services/AI/` | `GeminiService.cs`, `GeminiDTOs.cs`, `GeminiConfig.cs` |
| `UI/Overlays/` | `VoiceCommandOverlayUI.cs`, `AIAssistantChatUI.cs` |
| `Audio/` | `VoiceCaptureManager.cs` (Update with WAV encoder) |

### ⌨️ Virtual Keyboard Fallback
-   **Accessibility:** Subscribes to `VRKeyboardController.OnKeyTyped`.
-   **Logic:** Allows users to issue commands ("Make floor wood") via sanal klavye when audio is unavailable.

---

## 🏁 4. Mapping Intents to Real Tools
The AI returns a specific JSON structure: `{"action": "...", "feedback": "..."}`.
Ensure your `ExecuteIntent` methods point to your production Singletons:
- `VRSnapshotTool.TakeSnapshot()`
- `MaterialManager.Instance.ChangeMaterial()`
- `AnnotationController.CompleteAnnotation()`

---
*End of Integration Guide — Prepared for VR Architecture Project*
