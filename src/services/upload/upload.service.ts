import type { UploadResponse } from '@/types/upload.types';

interface UploadOptions {
    onProgress?: (progress: number) => void;
}

export const uploadService = {
    uploadFile: async (_file: File, options?: UploadOptions): Promise<UploadResponse> => {
        // Mock progress
        if (options?.onProgress) {
            options.onProgress(50);
            setTimeout(() => options.onProgress!(100), 500);
        }

        return {
            url: '/mock-upload-url.glb',
            fileName: 'mock.glb',
            fileSize: 1024 * 1024,
            fileType: 'model/gltf-binary'
        } as any;
    },

    uploadMultiple: async (files: File[]): Promise<UploadResponse[]> => {
        const promises = files.map(file => uploadService.uploadFile(file));
        return Promise.all(promises);
    }
};
