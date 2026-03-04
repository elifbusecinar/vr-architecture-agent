import { useState } from 'react';
import { useWorkspaces, useWorkspaceMembers } from '@/hooks/useWorkspaces';
import InvitationModal from '@/components/dashboard/InvitationModal';
import { EmptyState, TableRowSkeleton } from '@/components/common';

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export default function TeamPanel() {
    const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspaces();
    const activeWorkspace = workspaces?.[0];
    const { data: members, isLoading: isMembersLoading } = useWorkspaceMembers(activeWorkspace?.id);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    if (isWorkspacesLoading) {
        return (
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="panel-top"><div className="panel-title">Team</div></div>
                <TableRowSkeleton rows={3} />
            </div>
        );
    }

    if (!activeWorkspace) {
        return (
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="panel-top"><div className="panel-title">Team</div></div>
                <EmptyState
                    size="sm"
                    icon={'\uD83D\uDC65'}
                    title="No workspace"
                    description="Create a workspace to get started."
                />
            </div>
        );
    }

    const hasMembers = members && members.length > 1;

    return (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-top" style={{ justifyContent: 'space-between' }}>
                <div>
                    <div className="panel-title">{activeWorkspace.name} Team</div>
                    <span className="panel-meta">{members?.length || 0} members</span>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ fontSize: 11, padding: '4px 8px', height: 24 }}
                    onClick={() => setIsInviteModalOpen(true)}
                >
                    + Invite
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {isMembersLoading ? (
                    <TableRowSkeleton rows={3} />
                ) : !hasMembers ? (
                    <EmptyState
                        size="sm"
                        title="Just you for now"
                        description="Invite architects, designers, or clients to collaborate in VR."
                        action={
                            <button className="btn btn-primary" onClick={() => setIsInviteModalOpen(true)}>
                                {'\u2709'} Invite member
                            </button>
                        }
                        illustration={
                            <div className="ghost-avatars">
                                <div className="ghost-av" />
                                <div className="ghost-av" />
                                <div className="ghost-av" />
                                <div className="ghost-av add">+</div>
                            </div>
                        }
                    />
                ) : (
                    members?.map((m) => (
                        <div key={m.userId} className="session-row">
                            <div className="session-name" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div
                                        className="avatar"
                                        style={{
                                            background: 'var(--bg-inset)',
                                            color: 'var(--ink)',
                                            border: '1px solid var(--border-md)',
                                            marginLeft: 0,
                                            fontSize: 11,
                                            fontWeight: 600
                                        }}
                                    >
                                        {getInitials(m.username || m.email)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
                                            {m.username || m.email.split('@')[0]}
                                        </div>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                                            {m.role}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink-3)' }}>
                                    {m.email}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <InvitationModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                workspaceId={activeWorkspace.id}
            />
        </div>
    );
}
