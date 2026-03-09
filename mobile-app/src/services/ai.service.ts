import { Project } from './project.service';

export interface AIResponse {
    message: string;
    suggestions: string[];
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export const aiService = {
    getDashboardInsights: async (projects: Project[]): Promise<AIResponse> => {
        try {
            if (!GEMINI_API_KEY) throw new Error("API Key missing");

            const prompt = `Based on these architectural projects: ${JSON.stringify(projects)}, provide a short briefing (max 2 sentences) and 2 specific suggestions to improve progress or compliance. Return JSON format: { "message": "...", "suggestions": ["...", "..."] }`;

            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            // Try to parse JSON from response if AI returned it in blocks
            try {
                const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
                return JSON.parse(cleanJson);
            } catch {
                return {
                    message: text.substring(0, 100) || "Insights available on dashboard.",
                    suggestions: ["Review BIM data", "Check project consistency"]
                };
            }
        } catch (error) {
            console.error('Failed to fetch AI insights', error);
            return {
                message: "No current insights. All projects are stable.",
                suggestions: ["Check BIM data consistency", "Review recent annotations"]
            };
        }
    },

    askAssistant: async (prompt: string, context?: Record<string, unknown>): Promise<string> => {
        try {
            if (!GEMINI_API_KEY) throw new Error("API Key missing");

            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Archie, an architectural AI assistant. Context: ${JSON.stringify(context || {})}. User says: ${prompt}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now.";
        } catch (error) {
            console.error('Mobile Chat Error:', error);
            return "I'm having trouble connecting to my brain right now. Please check your internet connection.";
        }
    }
};
