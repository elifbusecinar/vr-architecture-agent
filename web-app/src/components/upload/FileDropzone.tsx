import { useCallback } from 'react';
import { useDropzone, type FileRejection, type DropEvent } from 'react-dropzone';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface FileDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    className?: string;
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
    disabled?: boolean;
}

export default function FileDropzone({
    onDrop,
    className,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        'application/pdf': ['.pdf'],
    },
    maxSize = 10 * 1024 * 1024, // 10MB default
    disabled = false,
}: FileDropzoneProps) {

    const handleDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], _event: DropEvent) => {
        if (fileRejections.length > 0) {
            console.warn('Files rejected:', fileRejections);
            // Could trigger generic toast or callback for error
        }
        if (acceptedFiles.length > 0) {
            onDrop(acceptedFiles);
        }
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop: handleDrop,
        accept,
        maxSize,
        disabled,
    });

    return (
        <div
            {...getRootProps()}
            className={twMerge(
                clsx(
                    'border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-4',
                    isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50',
                    isDragReject && 'border-red-500 bg-red-50',
                    disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                ),
                className
            )}
        >
            <input {...getInputProps()} />
            <div className={clsx('p-4 rounded-full', isDragActive ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500')}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">
                    {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    SVG, PNG, JPG or PDF (max. 10MB)
                </p>
            </div>
        </div>
    );
}
