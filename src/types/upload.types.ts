export type UploadStatus = 'idle' | 'preparing' | 'uploading' | 'success' | 'error';

export interface FileUploadState {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: UploadStatus;
    error?: string;
}

export interface UploadResponse {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}
