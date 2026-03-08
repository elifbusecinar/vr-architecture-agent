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
            return {
                text: "Simulation: Archie detected a voice command for floor plan changes.",
                confidence: 0.98,
                timestamp: new Date().toISOString()
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
            return {
                projectId,
                critique: "Simulation: BIM data analyzed. Recommendation: Increase staircase clearance by 15cm to meet regional accessibility standards.",
                source: "Gemini 1.5 Flash (Simulated)"
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `As 'Archie', an AI Architecture Specialist, critique this BIM data summary for Project ${projectId}: ${bimSummary}`;

        const result = await model.generateContent(prompt);
        return {
            projectId,
            critique: result.response.text(),
            source: "Google Gemini"
        };
    },

    chat: async (history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
        if (!API_KEY) {
            return "I'm Archie, your AI assistant. (Simulation Mode: API Key missing). I can help you with BIM data, material suggestions, and code compliance.";
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: history.slice(0, -1),
        });

        const lastMessage = history[history.length - 1].parts[0].text;
        const result = await chat.sendMessage(lastMessage);
        return result.response.text();
    }
};

