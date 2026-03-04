import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import type { ProjectStatus } from '@/types/project.types';
import RoleGate from '@/components/auth/RoleGate';
import { EmptyState, TableRowSkeleton } from '@/components/common';

export default function ProjectsTable() {
    const navigate = useNavigate();
    const { data: workspaces } = useWorkspaces();
    const currentWorkspaceId = workspaces?.[0]?.id;
    const { data: projectsData, isLoading: projectsLoading, isError, refetch } = useProjects(currentWorkspaceId, 1, 10);

    const getStatusBadge = (status: ProjectStatus) => {
        switch (status) {
            case 'VRReady':
                return <span className="badge badge-vr"><span className="badge-dot"></span>VR Ready</span>;
            case 'VRActive':
                return <span className="badge badge-live"><span className="badge-dot"></span>VR Active</span>;
            case 'Processing':
                return <span className="badge badge-review"><span className="badge-dot" style={{ background: 'var(--blue)', animation: 'livepulse 1s infinite' }}></span>Processing</span>;
            case 'Ready':
                return <span className="badge badge-live"><span className="badge-dot" style={{ background: 'var(--green)' }}></span>Ready</span>;
            case 'InReview':
                return <span className="badge badge-review"><span className="badge-dot"></span>In Review</span>;
            case 'Approved':
                return <span className="badge badge-live"><span className="badge-dot"></span>Approved</span>;
            case 'Draft':
            default:
                return <span className="badge badge-draft"><span className="badge-dot"></span>Draft</span>;
        }
    };

    const getProgressClass = (progress: number) => {
        if (progress >= 100) return 'done';
        if (progress >= 50) return 'mid';
        return 'low';
    };

    const projects = projectsData?.data ?? [];

    return (
        <div className="panel">
            <div className="panel-top">
                <div className="panel-title">Active Projects</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="panel-meta">{projectsData?.total ?? 0} total</span>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 11 }}
                        onClick={() => navigate('/projects')}
                    >
                        View all →
                    </button>
                </div>
            </div>

            {projectsLoading ? (
                <TableRowSkeleton rows={4} />
            ) : isError ? (
                <div className="error-state" style={{ padding: '32px 24px' }}>
                    <div className="error-state-icon red">{'\u26A1'}</div>
                    <div className="error-state-title">Failed to load projects</div>
                    <div className="error-state-desc">Check your connection and try again.</div>
                    <div className="error-state-actions">
                        <button className="btn btn-primary" onClick={() => refetch()}>{'\u21BA'} Retry</button>
                    </div>
                    <div className="error-state-code">ERR_FETCH_PROJECTS</div>
                </div>
            ) : projects.length === 0 ? (
                <EmptyState
                    icon={'\uD83D\uDCC1'}
                    dashed
                    title="No projects yet"
                    description="Create your first project to start organising models and running VR sessions."
                    action={
                        <button className="btn btn-primary" onClick={() => navigate('/projects')}>+ New project</button>
                    }
                    hint="or import from Revit / ArchiCAD"
                    illustration={
                        <div className="ghost-cards">
                            <div className="ghost-card" />
                            <div className="ghost-card" />
                            <div className="ghost-card" />
                        </div>
                    }
                />
            ) : (
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Client</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((p) => (
                            <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/project/${p.id}`)}>
                                <td>
                                    <div className="proj-name">{p.title}</div>
                                    <div className="proj-sub">{p.category}</div>
                                </td>
                                <td>{getStatusBadge(p.status)}</td>
                                <td>
                                    <div className="progress-track">
                                        <div
                                            className={`progress-fill ${getProgressClass(p.progress)}`}
                                            style={{ width: `${p.progress}%` }}
                                        />
                                    </div>
                                    <div
                                        className="progress-label"
                                        style={p.progress === 100 ? { color: 'var(--green)' } : undefined}
                                    >
                                        {p.progress}%
                                    </div>
                                </td>
                                <td style={{ fontSize: 12, color: 'var(--ink-2)', fontFamily: 'var(--sans)' }}>{p.clientName}</td>
                                <td>
                                    <div className="row-actions">
                                        <div
                                            className="row-action-btn"
                                            title="Open in VR"
                                            onClick={(e) => { e.stopPropagation(); window.open(p.modelUrl, '_blank'); }}
                                        >{'\u25B6'}</div>
                                        <div
                                            className="row-action-btn"
                                            title="Details"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/project/${p.id}`); }}
                                        >{'\u2197'}</div>
                                        <RoleGate allowedRoles={['Admin', 'Architect']}>
                                            <div
                                                className="row-action-btn delete"
                                                title="Delete Project"
                                                style={{ color: 'var(--red)' }}
                                                onClick={(e) => { e.stopPropagation(); console.log('Delete logic here'); }}
                                            >{'\u00D7'}</div>
                                        </RoleGate>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
