import axiosInstance from '../api/axiosInstance';

export interface DashboardStats {
    activeProjects: number;
    storageUsed: string;
    storagePercent: number;
    inReview: number;
    vrSessions: number;
    activeSessions: number;
    totalSize: string;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        try {
            // In a real app, this would be a single endpoint like /dashboard/stats
            // For now, we simulate it with some logic or a mock call
            // const response = await axiosInstance.get('/dashboard/stats');
            // return response.data;

            // Mocking for demonstration based on the current state
            return {
                activeProjects: 12, // This could be derived from projectService.getAll()
                storageUsed: '3.4GB',
                storagePercent: 68,
                inReview: 4,
                vrSessions: 9,
                activeSessions: 2,
                totalSize: '5.0GB'
            };
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
            return {
                activeProjects: 0,
                storageUsed: '0GB',
                storagePercent: 0,
                inReview: 0,
                vrSessions: 0,
                activeSessions: 0,
                totalSize: '5GB'
            };
        }
    }
};
