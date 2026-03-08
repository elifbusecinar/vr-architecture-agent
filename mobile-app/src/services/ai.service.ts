import axiosInstance from '../api/axiosInstance';
import { Project } from './project.service';

export interface AIResponse {
    message: string;
    suggestions: string[];
}

export const aiService = {
    getDashboardInsights: async (projects: Project[]): Promise<AIResponse> => {
        try {
            const response = await axiosInstance.post('/ai/dashboard-insights', { projects });
            return response.data;
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
            const response = await axiosInstance.post('/ai/chat', { prompt, context });
            return response.data.message;
        } catch (error) {
            const lower = prompt.toLowerCase();
            if (lower.includes("project")) return "Mobile: You have 2 active projects synced to this device: Skyline Tower and Villa Redux.";
            if (lower.includes("hello") || lower.includes("hi")) return "Hi! I'm Archie. I'm currently running in offline simulation mode on your mobile device.";
            return "I'm your AI assistant (Simulation Mode). I can help you with your architectural projects on the go!";
        }
    }
};
