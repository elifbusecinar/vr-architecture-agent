import type { FileUploadState } from '@/types/upload.types';
import { clsx } from 'clsx';

interface UploadedFilesListProps {
    files: FileUploadState[];
    onRemove: (id: string) => void;
    onUploadAll: () => void;
    isUploading?: boolean;
}

export default function UploadedFilesList({ files, onRemove, onUploadAll, isUploading }: UploadedFilesListProps) {
    if (files.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">Files ({files.length})</h3>
                {/* Only show Upload All if there are pending files */}
                {files.some(f => f.status === 'idle' || f.status === 'error') && (
                    <button
                        onClick={onUploadAll}
                        className="text-sm font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload All'}
                    </button>
                )}
            </div>
            <ul className="space-y-3">
                {files.map((file) => (
                    <li key={file.id} className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-300 hover:shadow-md">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-md bg-slate-50 flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-slate-100">
                            {file.file.type.startsWith('image/') ? (
                                <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400">
                                    {/* File Icon */}
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1.5">
                                <p className="text-sm font-medium text-slate-900 truncate pr-2 max-w-[200px]" title={file.file.name}>{file.file.name}</p>
                                <button
                                    onClick={() => onRemove(file.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-50"
                                    aria-label="Remove file"
                                    disabled={file.status === 'uploading'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Status & Size */}
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                                <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className={clsx(
                                    'font-medium capitalize',
                                    file.status === 'error' && 'text-red-500',
                                    file.status === 'success' && 'text-green-600',
                                    file.status === 'uploading' && 'text-primary-600'
                                )}>
                                    {file.status === 'uploading' ? `${file.progress}%` : file.status}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            {(file.status === 'uploading' || file.status === 'success' || file.status === 'error') && (
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full">
                                    <div
                                        className={clsx(
                                            "h-full transition-all duration-300 ease-out rounded-full",
                                            file.status === 'error' ? 'bg-red-500 w-full' : 'bg-primary-500',
                                            file.status === 'success' && 'bg-green-500'
                                        )}
                                        style={{ width: file.status === 'error' ? '100%' : `${file.progress}%` }}
                                    />
                                </div>
                            )}

                            {file.error && (
                                <p className="text-xs text-red-500 mt-1 truncate max-w-xs" title={file.error}>
                                    Error: {file.error}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
