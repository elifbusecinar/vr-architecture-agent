import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import type { WorkspaceRole } from '@/types/workspace.types';

interface InvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceId: string;
}

export default function InvitationModal({ isOpen, onClose, workspaceId }: InvitationModalProps) {
    const queryClient = useQueryClient();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<WorkspaceRole>('Viewer');

    const inviteMember = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post('/workspaces/invite', {
                email,
                workspaceId,
                targetRole: role
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'members'] });
            onClose();
            setEmail('');
            setRole('Viewer');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inviteMember.mutate();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                        className="form-input form-select"
                        value={role}
                        onChange={e => setRole(e.target.value as WorkspaceRole)}
                    >
                        <option value="Viewer">Viewer (Read-only)</option>
                        <option value="Editor">Editor (Can edit projects)</option>
                        <option value="Owner">Owner (Full access)</option>
                    </select>
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
                        disabled={inviteMember.isPending}
                    >
                        {inviteMember.isPending ? 'Sending Invite...' : 'Send Invitation'}
                    </button>
                </div>

                {inviteMember.isError && (
                    <div style={{ marginTop: 12, fontSize: 11, color: 'var(--red)', textAlign: 'center' }}>
                        Error: {(inviteMember.error as any)?.response?.data?.message || inviteMember.error.message}
                    </div>
                )}
            </form>
        </Modal>
    );
}
