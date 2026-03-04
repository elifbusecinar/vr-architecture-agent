import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '@/services/upload/upload.service';
import type { UploadStatus, FileUploadState } from '@/types/upload.types';

export const useFileUpload = () => {
    const [files, setFiles] = useState<FileUploadState[]>([]);
    const queryClient = useQueryClient();

    const addFiles = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'idle' as UploadStatus,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const removeFile = useCallback((id: string) => {
        setFiles((prev) => {
            const file = prev.find((f) => f.id === id);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter((f) => f.id !== id);
        });
    }, []);

    // Single file upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (fileState: FileUploadState) => {
            return uploadService.uploadFile(fileState.file, {
                onProgress: (progress) => {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === fileState.id ? { ...f, progress } : f
                        )
                    );
                },
            });
        },
        onSuccess: (_data, variables) => {
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === variables.id ? { ...f, status: 'success', progress: 100 } : f
                )
            );
            // Invalidate projects list query to refresh dashboard if a new project was created (or file added)
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (error: Error, variables) => {
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === variables.id ? { ...f, status: 'error', error: error.message } : f
                )
            );
        },
    });

    const startUpload = useCallback((id: string) => {
        setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: 'uploading' } : f))
        );
        const fileState = files.find((f) => f.id === id);
        if (fileState) {
            uploadMutation.mutate(fileState);
        }
    }, [files, uploadMutation]);

    const startAllUploads = useCallback(() => {
        files.filter(f => f.status === 'idle' || f.status === 'error').forEach(f => {
            startUpload(f.id);
        });
    }, [files, startUpload]);

    return {
        files,
        addFiles,
        removeFile,
        startUpload,
        startAllUploads,
        isUploading: uploadMutation.isPending,
    };
};
