import { GoogleGenerativeAI } from '@google/generative-ai';
import { MOCK_PROJECTS, MOCK_ACTIVITIES } from '../mockData';

// Initialize Gemini SDK with API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const AI_SERVICE_BASE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
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

export interface CritiqueResult {
    projectId: string;
    summary: string;
    findings: string[];
    suggestedTheme: string;
    safetyWarning: boolean;
    source: string;
}

export const aiService = {
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

    critiqueProject: async (projectId: string, bimSummary: string): Promise<CritiqueResult> => {
        if (!API_KEY) {
            const project = MOCK_PROJECTS.data.find(p => p.id === projectId) || MOCK_PROJECTS.data[0];
            
            const results: CritiqueResult[] = [
                {
                    projectId: project.id,
                    summary: `Spatial analysis for ${project.title} completed. Layout is efficient but circulation around the core could be optimized.`,
                    findings: [
                        "Staircase clearance in N-Wing is 5% below standard.",
                        "North facade glazing ratio (34%) is high for the climate zone.",
                        "HVAC routing in Floor 2 has minor structural clearance issues."
                    ],
                    suggestedTheme: "Optimized Brutalism",
                    safetyWarning: true,
                    source: "Archie Engine (Simulated)"
                },
                {
                    projectId: project.id,
                    summary: `Material study for ${project.title} suggests high sustainability potential.`,
                    findings: [
                        "Foundations exceed loading requirements by 12%.",
                        "Material swap: Italian Marble ($185/m²) to Local Granite ($120/m²) saves $12k.",
                        "Lighting levels in internal rooms depend heavily on active cooling."
                    ],
                    suggestedTheme: "Eco-Industrial",
                    safetyWarning: false,
                    source: "Archie Engine (Simulated)"
                }
            ];

            return results[Math.floor(Math.random() * results.length)];
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        const prompt = `As 'Archie', an AI Architecture Specialist, critique this BIM data summary for Project ${projectId}: ${bimSummary}. 
        Return a JSON object with: summary (string), findings (array of strings), suggestedTheme (string), and safetyWarning (boolean).`;

        const result = await model.generateContent(prompt);
        let parsed;
        try {
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text, findings: [], suggestedTheme: "Modern", safetyWarning: false };
        } catch (e) {
            parsed = { summary: result.response.text(), findings: [], suggestedTheme: "Modern", safetyWarning: false };
        }

        return {
            ...parsed,
            projectId,
            source: "Google Gemini"
        };
    },

    chat: async (history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
        const lastMsgText = history[history.length - 1].parts[0].text;
        const lowerMsg = lastMsgText.toLowerCase();

        if (!API_KEY) {
            // Context injection from mock data
            if (lowerMsg.includes("project")) {
                const names = MOCK_PROJECTS.data.map(p => p.title).join(", ");
                const top = MOCK_PROJECTS.data[0].title;
                return `You have ${MOCK_PROJECTS.data.length} active projects in your workspace: **${names}**. **${top}** has the most activity with ${MOCK_PROJECTS.data[0].progress}% completion.`;
            }
            if (lowerMsg.includes("summarize") || lowerMsg.includes("overview") || lowerMsg.includes("status")) {
                const total = MOCK_PROJECTS.data.length;
                const active = MOCK_PROJECTS.data.filter(p => p.status === 'VRActive').length;
                return `Your workspace summary:
                - **Total Projects:** ${total}
                - **VR Active:** ${active}
                - **Recent Activity:** ${MOCK_ACTIVITIES[0].message}
                - **Critical Issues:** 1 (Staircase clearance in Skyline Tower)
                Would you like me to generate a detailed compliance report for your active projects?`;
            }
            if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
                return "Hello! I'm Archie, your VRA Intelligence assistant. I've scanned your workspace and detected **${MOCK_PROJECTS.data.length} projects**. How can I assist you with your designs today?";
            }
            if (lowerMsg.includes("client")) {
                const clients = Array.from(new Set(MOCK_PROJECTS.data.map(p => p.clientName))).join(", ");
                return `Currently collaborating with: **${clients}**. Most active participant is Client John (42 sessions in Skyline Tower).`;
            }

            return "I'm Archie, your AI assistant. I can help you with BIM data, material suggestions, and code compliance. Try asking about your projects, clients, or a workspace summary!";
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        // Inject workspace context into the first message if it's the start
        const context = `Context: User has ${MOCK_PROJECTS.data.length} projects (${MOCK_PROJECTS.data.map(p => p.title).join(", ")}). 
        Current active project with most revisions is ${MOCK_PROJECTS.data[0].title}.`;
        
        const systemPrompt = `You are Archie, a premium AI architecture assistant for VRA (VR Architecture). 
        Help with BIM, compliance, and project management. ${context}`;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: "Understood. I am Archie, your architectural expert. How can I help with your projects today?" }] },
                ...history.slice(0, -1)
            ],
        });

        const result = await chat.sendMessage(lastMsgText);
        return result.response.text();
    },

    triggerCrewAudit: async (modelMetadata: string): Promise<any> => {
        try {
            const response = await fetch(`${AI_SERVICE_BASE_URL}/audit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model_metadata: modelMetadata })
            });
            if (!response.ok) throw new Error('CrewAI Service Offline');
            return await response.json();
        } catch (err) {
            // Strategic simulation for UI/UX
            await new Promise(res => setTimeout(res, 2000));
            return {
                status: "simulated_success",
                iterations: 1,
                audit_metrics: { crit: 1, warn: 2, pass: 24, cost: "$59,456", score: 78 },
                audit_report: {
                    summary: "Multi-agent audit completed successfully.",
                    results: [
                        { agent: "BIM Analyst", result: "12 rooms parsed. All geometries manifold." },
                        { agent: "Compliance", result: "3 violations found: Kitchen clearance (High), Railing height (Med), Glazing ratio (Low)." },
                        { agent: "Cost Estimator", result: "Total estimated material cost: $59,456 USD." }
                    ],
                    stats: { crit: 1, warn: 2, pass: 24, score: 78 }
                }
            };
        }
    },

    triggerMcpDemo: async (): Promise<any> => {
        try {
            const response = await fetch(`${AI_SERVICE_BASE_URL}/mcp-tools`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('MCP Demo Service Offline');
            return await response.json();
        } catch (_err) {
            await new Promise(res => setTimeout(res, 900));
            return {
                status: "simulated_success",
                mcp_demo: {
                    server: "server.py",
                    tools: [
                        { name: "estimate_project_risk", description: "Estimate design risk level from simple project inputs." },
                        { name: "suggest_next_action", description: "Suggest one practical next step based on risk level." }
                    ],
                    risk_result: "Risk Level: HIGH\n- Seismic Zone: 3\n- Floors: 12\n- Sustainability Score: 55\n- Risk Points: 5",
                    risk_level: "HIGH",
                    action_result: "Run full structural simulation and hold design review this week."
                }
            };
        }
    }
};

