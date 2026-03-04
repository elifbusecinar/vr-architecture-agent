import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import { useCategories } from '@/hooks/useCategories';

interface UpdateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

export default function UpdateProjectModal({ isOpen, onClose, project }: UpdateProjectModalProps) {
    const queryClient = useQueryClient();
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const [title, setTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setClientName(project.clientName);
            setCategory(project.category);
            setDescription(project.description);
        }
    }, [project, isOpen]);

    const updateProject = useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.patch(`/projects/${project.id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', project.id] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProject.mutate({ title, clientName, category, description });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Project Details">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
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
                        </select>
                    )}
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', resize: 'vertical' }}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>

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
                        disabled={updateProject.isPending}
                    >
                        {updateProject.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
