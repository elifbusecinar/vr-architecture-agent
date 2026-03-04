import { useState } from 'react';
import { NotificationDrawer, BellIcon } from './NotificationDrawer';
import { useUnreadCount } from '@/hooks/useNotifications';

interface TopbarProps {
    onMenuClick?: () => void;
    onSearchClick?: () => void;
    onNewProjectClick?: () => void;
    title?: string;
}

export default function Topbar({ onMenuClick, onSearchClick, onNewProjectClick, title }: TopbarProps) {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { data: unreadCount = 0 } = useUnreadCount();

    return (
        <>
            <header className="topbar">
                <div className="tb-left">
                    <button
                        className="mobile-menu-btn"
                        onClick={onMenuClick}
                        style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', display: 'none' }}
                    >
                        ☰
                    </button>
                    <div className="tb-title">{title || 'Workboard'}</div>
                </div>

                <div className="tb-right">
                    <div className="search-trigger" onClick={onSearchClick} id="searchTrigger">
                        <span className="st-icon">⌕</span>
                        <span className="st-placeholder">Search or jump to…</span>
                        <div className="st-kbd">
                            <span className="kbd">⌘</span>
                            <span className="kbd">K</span>
                        </div>
                    </div>

                    <div className="icon-btn" onClick={() => { }}>
                        ↑<span style={{ fontSize: 9, marginLeft: 1 }}>GLB</span>
                    </div>

                    <div className="icon-btn" onClick={() => { }}>🥽</div>

                    {onNewProjectClick && (
                        <div className="icon-btn" title="New project" onClick={onNewProjectClick} style={{ color: 'var(--blue)', border: '1px solid rgba(45,91,227,0.2)', backgroundColor: 'rgba(45,91,227,0.05)' }}>
                            <span style={{ fontWeight: 600 }}>+</span>
                        </div>
                    )}

                    <div className="icon-btn" id="notifBtn" onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); }} style={{ position: 'relative', color: isNotifOpen ? 'var(--ink)' : 'var(--ink-2)' }}>
                        <BellIcon />
                        {unreadCount > 0 && <div className="notif-dot" id="notifDot" style={{ top: 2, right: 2 }}></div>}
                    </div>
                </div>
            </header>

            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </>
    );
}
