import type { Annotation, CreateAnnotation } from '../../types/annotation.types';
import { MOCK_ANNOTATIONS } from '@/services/mockData';

export const annotationService = {
    getProjectAnnotations: async (projectId: string): Promise<Annotation[]> => {
        return MOCK_ANNOTATIONS.filter(a => a.projectId === projectId) as any;
    },

    createAnnotation: async (data: CreateAnnotation): Promise<Annotation> => {
        return {
            id: 'an_' + Date.now(),
            authorName: 'Demo Architect',
            createdAt: new Date().toISOString(),
            ...data
        } as any;
    },

    searchAnnotations: async (query: string): Promise<Annotation[]> => {
        return MOCK_ANNOTATIONS.filter(a => a.text.toLowerCase().includes(query.toLowerCase())) as any;
    },

    deleteAnnotation: async (id: string): Promise<void> => {
        console.log('Deleted annotation:', id);
    }
};

