import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useCategories } from '@/hooks/useCategories';
import type { ProjectStatus } from '@/types/project.types';
import Topbar from '@/components/dashboard/Topbar';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import { EmptyState, ErrorState, TableRowSkeleton } from '@/components/common';

const PAGE_SIZE = 12;

export default function ProjectsListPage() {
    const navigate = useNavigate();
    const { data: workspaces } = useWorkspaces();
    const currentWorkspaceId = workspaces?.[0]?.id;
    const { data: categories } = useCategories();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    const { data: projectsData, isLoading, isError, refetch } = useProjects(currentWorkspaceId, page, PAGE_SIZE);

    const getStatusBadge = (status: ProjectStatus) => {
        const map: Record<string, { label: string; cls: string; dotStyle?: React.CSSProperties }> = {
            VRReady: { label: 'VR Ready', cls: 'badge-vr' },
            VRActive: { label: 'VR Active', cls: 'badge-live' },
            Processing: { label: 'Processing', cls: 'badge-review', dotStyle: { background: 'var(--blue)', animation: 'livepulse 1s infinite' } },
            Ready: { label: 'Ready', cls: 'badge-live', dotStyle: { background: 'var(--green)' } },
            InReview: { label: 'In Review', cls: 'badge-review' },
            Approved: { label: 'Approved', cls: 'badge-live' },
            Draft: { label: 'Draft', cls: 'badge-draft' },
        };
        const s = map[status] || map.Draft;
        return <span className={`badge ${s.cls}`}><span className="badge-dot" style={s.dotStyle} />{s.label}</span>;
    };

    const getProgressClass = (progress: number) => {
        if (progress >= 100) return 'done';
        if (progress >= 50) return 'mid';
        return 'low';
    };

    const filtered = projectsData?.data?.filter(p => {
        const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    }) ?? [];

    const totalPages = Math.ceil((projectsData?.total ?? 0) / PAGE_SIZE);
    const hasFilters = !!search || filterCategory !== 'All';

    return (
        <div className="page" style={{ padding: 0 }}>
            <Topbar
                onNewProjectClick={() => setIsNewProjectModalOpen(true)}
                onSearchClick={() => { }}
            />

            <div style={{ padding: '0 24px 24px 24px' }}>
                <div className="page-header" style={{ marginTop: 24 }}>
                    <div className="page-eyebrow">Workspace Projects</div>
                    <div className="page-title">All Projects</div>
                </div>

                <div style={{
                    display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap'
                }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search projects or clients..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ maxWidth: 280, fontSize: 12, height: 34 }}
                    />
                    <select
                        className="form-input form-select"
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        style={{ maxWidth: 180, fontSize: 12, height: 34 }}
                    >
                        <option value="All">All Categories</option>
                        {categories?.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>
                        {projectsData?.total ?? 0} projects
                    </div>
                </div>

                <div className="panel" style={{ marginTop: 16 }}>
                    {isLoading ? (
                        <TableRowSkeleton rows={5} />
                    ) : isError ? (
                        <ErrorState
                            title="Failed to load projects"
                            description="Unable to reach the server. Check your internet connection and try again."
                            errorCode="ERR_FETCH_PROJECTS"
                            onRetry={() => { refetch(); }}
                        />
                    ) : filtered.length === 0 && hasFilters ? (
                        <EmptyState
                            icon={'\u2315'}
                            dashed
                            size="sm"
                            title={`No results for "${search || filterCategory}"`}
                            description="Try a different search term or check the spelling."
                            action={
                                <button className="btn btn-ghost" onClick={() => { setSearch(''); setFilterCategory('All'); }}>
                                    Clear search
                                </button>
                            }
                            illustration={
                                <div className="search-ghost">
                                    <div className="sg-row" style={{ opacity: 0.6 }} />
                                    <div className="sg-row" style={{ opacity: 0.4 }} />
                                    <div className="sg-row" style={{ opacity: 0.2 }} />
                                </div>
                            }
                        />
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            icon={'\uD83D\uDCC1'}
                            dashed
                            title="No projects yet"
                            description="Create your first project to start organising models and running VR sessions."
                            action={
                                <button className="btn btn-primary" onClick={() => setIsNewProjectModalOpen(true)}>
                                    + New project
                                </button>
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
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr
                                        key={p.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/project/${p.id}`)}
                                    >
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
                                        <td style={{ fontSize: 12, color: 'var(--ink-2)', fontFamily: 'var(--sans)' }}>
                                            {p.clientName}
                                        </td>
                                        <td style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>
                                            {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td>
                                            <div className="row-actions">
                                                <div
                                                    className="row-action-btn"
                                                    title="Open in VR"
                                                    onClick={e => { e.stopPropagation(); window.open(p.modelUrl, '_blank'); }}
                                                >{'\u25B6'}</div>
                                                <div
                                                    className="row-action-btn"
                                                    title="Details"
                                                    onClick={e => { e.stopPropagation(); navigate(`/project/${p.id}`); }}
                                                >{'\u2197'}</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16, alignItems: 'center'
                    }}>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 12px', fontSize: 11 }}
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            {'\u2190'} Previous
                        </button>
                        <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 12px', fontSize: 11 }}
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next {'\u2192'}
                        </button>
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
            />
        </div>
    );
}
