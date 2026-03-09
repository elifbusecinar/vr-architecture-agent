import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK with API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface STTResult {
    text: string;
    confidence: number;
    timestamp: string;
}

export interface VisionAnalysisResult {
    analysisId: string;
    topFinding: string;
    confidence: number;
}

export const aiService = {
    // Note: STT typically uses Whisper or Gemini Multimodal audio. 
    // For this Lite version, we use a simulated response if no API key is present.
    transcribeAudio: async (base64Audio: string): Promise<STTResult> => {
        if (!API_KEY) {
            const responses = [
                "Archie detected a request for floor plan modifications in the East Wing.",
                "Voice command received: Show me all annotations for the HVAC system.",
                "User requested a material swap: change marble to polished concrete."
            ];
            return {
                text: responses[Math.floor(Math.random() * responses.length)],
                confidence: 0.98,
                timestamp: new Date().toISOString()
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent([
            "Transcribe this audio signal contextually for an architecture app",
            { inlineData: { data: base64Audio, mimeType: "audio/wav" } }
        ]);

        return {
            text: result.response.text(),
            confidence: 0.95,
            timestamp: new Date().toISOString()
        };
    },

    analyzeSnapshot: async (imageBase64: string): Promise<VisionAnalysisResult> => {
        if (!API_KEY) {
            return {
                analysisId: `sim_${Date.now()}`,
                topFinding: "Simulation: Detected potential issue with window spacing in modern living room.",
                confidence: 0.92
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent([
            "Analyze this architectural snapshot and find one key layout or material issue.",
            { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]);

        return {
            analysisId: `gem_${Date.now()}`,
            topFinding: result.response.text(),
            confidence: 0.88
        };
    },

    critiqueProject: async (projectId: string, bimSummary: string): Promise<any> => {
        if (!API_KEY) {
            const critiques = [
                "BIM data analyzed. Recommendation: Increase staircase clearance by 15cm to meet regional accessibility standards.",
                "Structural conflict detected: HVAC ducting on Floor 2 intersects with primary load-bearing beam B-12.",
                "Material efficiency tip: Swapping the current glazing for Triple-Low-E glass will reduce cooling load by 14%."
            ];
            return {
                projectId,
                critique: critiques[Math.floor(Math.random() * critiques.length)],
                source: "Gemini 1.5 Flash (Simulated)"
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        const prompt = `As 'Archie', an AI Architecture Specialist, critique this BIM data summary for Project ${projectId}: ${bimSummary}`;

        const result = await model.generateContent(prompt);
        return {
            projectId,
            critique: result.response.text(),
            source: "Google Gemini"
        };
    },

    chat: async (history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
        const lastMsgText = history[history.length - 1].parts[0].text;
        const lowerMsg = lastMsgText.toLowerCase();

        if (!API_KEY) {
            if (lowerMsg.includes("project")) {
                return "You have 3 active projects: Skyline Tower, Villa Redux, and the Arctic Hub. Skyline Tower has the most recent activity (BIM update 2 hours ago).";
            }
            if (lowerMsg.includes("summarize") || lowerMsg.includes("overview")) {
                return "Your workspace is healthy. 1 critical issue in Skyline Tower (staircase clearance) and 2 warnings in Villa Redux. Would you like me to generate a detailed compliance report?";
            }
            if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
                return "Hello! I'm Archie, your VRA Intelligence assistant. I'm currently running in **Simulation Mode** because a Gemini API key isn't set, but I can still show you around your workspace!";
            }

            return "I'm Archie, your AI assistant. (Simulation Mode). I can help you with BIM data, material suggestions, and code compliance. Try asking about your projects!";
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const chat = model.startChat({
            history: history.slice(0, -1),
        });

        const result = await chat.sendMessage(lastMsgText);
        return result.response.text();
    }
};

