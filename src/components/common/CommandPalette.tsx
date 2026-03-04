import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandSearch, type CommandPaletteItem } from '@/hooks/useCommandSearch';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    const { results: searchResults, loading: searchLoading } = useCommandSearch(query);

    // Static Mock Data for Default View (match user's request)
    const recentItems: CommandPaletteItem[] = [
        { type: 'Project', icon: '📁', title: 'Skyline Tower — Unit 14B', meta: 'Project · 2 active sessions', tags: ['skyline', 'tower', 'unit'], action: () => navigate('/projects') },
        { type: 'Model', icon: '📦', title: 'Skyline_Tower_Unit14B_v4.glb', meta: 'Model · 142 MB · v4.2', tags: ['skyline', 'glb', 'model'], action: () => navigate('/models') },
        { type: 'Session', icon: '🥽', title: 'Client walkthrough #3 — Skyline Tower', meta: 'Session · Feb 19 · 47 min', tags: ['session', 'walkthrough', 'skyline'], action: () => navigate('/sessions') },
    ];

    const quickActions: CommandPaletteItem[] = [
        { type: 'Action', icon: '+', title: 'New project', meta: 'Create a new project in this workspace', tags: ['new', 'create', 'project'], cls: 'blue', kbd: 'N', action: () => alert('New project') },
        { type: 'Action', icon: '↑', title: 'Upload 3D model', meta: 'Add a GLB, GLTF, or OBJ to the library', tags: ['upload', 'model', 'file'], cls: 'blue', kbd: 'U', action: () => alert('Upload model') },
        { type: 'Action', icon: '🥽', title: 'Start VR session', meta: 'Launch a new session and invite participants', tags: ['start', 'session', 'vr'], cls: 'green', kbd: 'S', action: () => alert('Start session') },
        { type: 'Action', icon: '✉', title: 'Invite team member', meta: 'Send an invite to your workspace', tags: ['invite', 'team'], cls: 'amber', action: () => alert('Invite member') },
        { type: 'Action', icon: '⚙', title: 'Go to Settings', meta: 'Account, notifications, integrations', tags: ['settings', 'account', 'profile'], action: () => navigate('/settings') },
    ];

    // Combine for navigation calculation
    const visibleItems = useMemo(() => {
        if (!query.trim()) return [...recentItems, ...quickActions];
        return searchResults;
    }, [query, searchResults]);

    // Handle initial focus
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Key handling
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, visibleItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = visibleItems[selectedIndex];
                if (item) {
                    onClose();
                    item.action ? item.action() : alert(`Selected: ${item.title}`);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, visibleItems, selectedIndex, onClose]);

    // Scroll active item into view
    useEffect(() => {
        const el = document.getElementById(`cp-item-${selectedIndex}`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    if (!isOpen) return null;

    // Helper for highlighting text
    const Highlight = ({ text, highlight }: { text: string, highlight: string }) => {
        if (!highlight.trim()) return <>{text}</>;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase()
                        ? <span key={i} className="hl">{part}</span>
                        : part
                )}
            </>
        );
    };

    const renderSearchResults = () => {
        const groups: Record<string, CommandPaletteItem[]> = {};
        searchResults.forEach(item => {
            if (!groups[item.type]) groups[item.type] = [];
            groups[item.type].push(item);
        });

        let globalIndex = 0;

        return Object.entries(groups).map(([type, items]) => (
            <div key={type}>
                <div className="cp-section-label">{type}s</div>
                {items.map((item) => {
                    const currentIndex = globalIndex++;
                    const isActive = currentIndex === selectedIndex;
                    return (
                        <div
                            key={currentIndex}
                            id={`cp-item-${currentIndex}`}
                            className={`cp-item ${isActive ? 'focused' : ''}`}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            onClick={() => {
                                onClose();
                                item.action ? item.action() : alert(`Selected: ${item.title}`);
                            }}
                        >
                            <div className={`cp-item-icon ${item.cls || ''}`}>{item.icon}</div>
                            <div className="cp-item-body">
                                <div className="cp-item-title">
                                    <Highlight text={item.title} highlight={query} />
                                </div>
                                <div className="cp-item-meta">{item.meta}</div>
                            </div>
                            <div className="cp-item-right">
                                <span className="cp-item-badge">{item.type}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        ));
    };

    const renderDefaultView = () => {
        let globalIndex = 0;

        return (
            <>
                <div className="cp-section-label">Recent</div>
                {recentItems.map((item) => {
                    const currentIndex = globalIndex++;
                    const isActive = currentIndex === selectedIndex;
                    return (
                        <div
                            key={currentIndex}
                            id={`cp-item-${currentIndex}`}
                            className={`cp-item ${isActive ? 'focused' : ''}`}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            onClick={() => { onClose(); item.action ? item.action() : alert(`Selected: ${item.title}`); }}
                        >
                            <div className={`cp-item-icon ${item.cls || ''}`}>{item.icon}</div>
                            <div className="cp-item-body">
                                <div className="cp-item-title">{item.title}</div>
                                <div className="cp-item-meta">{item.meta}</div>
                            </div>
                            <div className="cp-item-right">
                                <span className="cp-item-badge">{item.type}</span>
                            </div>
                        </div>
                    );
                })}

                <div className="cp-divider" />
                <div className="cp-section-label">Quick Actions</div>
                {quickActions.map((item) => {
                    const currentIndex = globalIndex++;
                    const isActive = currentIndex === selectedIndex;
                    return (
                        <div
                            key={currentIndex}
                            id={`cp-item-${currentIndex}`}
                            className={`cp-item ${isActive ? 'focused' : ''}`}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            onClick={() => { onClose(); item.action ? item.action() : alert(`Selected: ${item.title}`); }}
                        >
                            <div className={`cp-item-icon ${item.cls || ''}`}>{item.icon}</div>
                            <div className="cp-item-body">
                                <div className="cp-item-title">{item.title}</div>
                                <div className="cp-item-meta">{item.meta}</div>
                            </div>
                            {item.kbd && (
                                <div className="cp-item-right">
                                    <span className="cp-item-kbd">{item.kbd}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div className={`cp-backdrop ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="cp-modal">
                <div className="cp-input-row">
                    <span className="cp-icon">⌕</span>
                    <input
                        ref={inputRef}
                        className="cp-input"
                        placeholder="Search projects, models, sessions, or run a command…"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {searchLoading ? (
                        <div className="cp-loading-container">
                            <div className="cp-loading-spinner" />
                        </div>
                    ) : (
                        <span className="cp-esc" onClick={onClose}>ESC</span>
                    )}
                </div>

                <div className="cp-body">
                    {!query && renderDefaultView()}
                    {query && searchResults.length > 0 && renderSearchResults()}
                    {query && !searchLoading && searchResults.length === 0 && (
                        <div className="cp-empty">
                            <div className="cp-empty-icon">⌕</div>
                            <div className="cp-empty-text">No results for "{query}"</div>
                        </div>
                    )}
                </div>

                <div className="cp-footer">
                    <div className="cpf-hint"><span className="kbd">↑↓</span> Navigate</div>
                    <div className="cpf-hint"><span className="kbd">↵</span> Open</div>
                    <div className="cpf-hint"><span className="kbd">ESC</span> Close</div>
                    <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.05em' }}>
                        {visibleItems.length === 1 ? '1 result' : `${visibleItems.length} items`}
                    </div>
                </div>
            </div>
        </div>
    );
}
