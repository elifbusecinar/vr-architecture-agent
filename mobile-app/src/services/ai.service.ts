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
        const response = await axiosInstance.post('/ai/chat', { prompt, context });
        return response.data.message;
    }
};
