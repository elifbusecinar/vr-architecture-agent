import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axiosInstance.get<string[]>('/lookups/categories');
            return response.data;
        }
    });
};
