import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useCategories } from '@/hooks/useCategories';
import { useEffect } from 'react';
import { projectService } from '@/services/projects/project.service';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFile?: File | null;
}

export default function CreateProjectModal({ isOpen, onClose, initialFile }: CreateProjectModalProps) {
    const queryClient = useQueryClient();
    const { data: workspaces } = useWorkspaces();
    const currentWorkspaceId = workspaces?.[0]?.id;
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const [title, setTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [category, setCategory] = useState('Architecture');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isOptimizing, setIsOptimizing] = useState(false);

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCategory(categories[0]);
        }
    }, [categories]);

    useEffect(() => {
        if (initialFile) {
            setFile(initialFile);
            // Auto-populate title from filename (without extension)
            const nameWithoutExt = initialFile.name.replace(/\.[^.]+$/, '');
            if (!title) {
                setTitle(nameWithoutExt);
            }
        }
    }, [initialFile]);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'model/gltf-binary': ['.glb'],
            'model/gltf+json': ['.gltf'],
        },
        maxFiles: 1,
    });

    const createProject = useMutation({
        mutationFn: async () => {
            if (!file || !currentWorkspaceId) throw new Error('Incomplete data');

            setUploadProgress(0);
            setIsOptimizing(false);

            return projectService.upload(
                {
                    title,
                    description,
                    workspaceId: currentWorkspaceId,
                    category,
                    clientName
                },
                file,
                (percent) => {
                    setUploadProgress(percent);
                    if (percent === 100) {
                        setIsOptimizing(true);
                    }
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            onClose();
            // Reset form
            setTitle('');
            setClientName('');
            setCategory('Architecture');
            setDescription('');
            setFile(null);
            setUploadProgress(0);
            setIsOptimizing(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createProject.mutate();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Skyline Tower"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        required
                        placeholder="e.g. Martin & Co."
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    {categoriesLoading ? (
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Loading categories...</div>
                    ) : (
                        <select
                            className="form-input form-select"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {categories?.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            {!categories?.length && <option value="Architecture">Architecture</option>}
                        </select>
                    )}
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '80px', resize: 'vertical' }}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">3D Model (GLB)</label>
                    <div
                        {...getRootProps()}
                        className={`upload-area ${isDragActive ? 'active' : ''}`}
                        style={{ padding: '20px', borderStyle: 'dashed' }}
                    >
                        <input {...getInputProps()} />
                        {file ? (
                            <div style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 500 }}>
                                File selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                                    {isDragActive ? 'Drop here' : 'Click or drop GLB model'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {createProject.isPending && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '11px', color: 'var(--ink-2)' }}>
                            <span>{isOptimizing ? 'Optimizing for VR...' : 'Uploading GLB...'}</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--bg-inset)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div
                                style={{
                                    height: '100%',
                                    background: isOptimizing ? 'var(--blue)' : 'var(--ink)',
                                    width: `${uploadProgress}%`,
                                    transition: 'width 0.3s ease',
                                    ...(isOptimizing && { animation: 'pulse 1.5s infinite' })
                                }}
                            />
                        </div>
                        {isOptimizing && (
                            <div style={{ marginTop: 8, fontSize: '10px', color: 'var(--ink-3)', textAlign: 'center' }}>
                                This may take a moment. We are applying Draco compression for faster VR loading.
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: 'center' }}
                        disabled={createProject.isPending || !file}
                    >
                        {createProject.isPending ? 'Uploading...' : 'Create Project'}
                    </button>
                </div>

                {createProject.isError && (
                    <div style={{ marginTop: 12, fontSize: 11, color: 'var(--red)', textAlign: 'center' }}>
                        Error: {(createProject.error as any)?.response?.data?.message || createProject.error.message}
                    </div>
                )}
            </form>
        </Modal>
    );
}
