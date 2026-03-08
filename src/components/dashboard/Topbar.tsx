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
    // const location = useLocation(); // removed

    const getBreadcrumb = () => {
        return (
            <div className="breadcrumb">
                <span>VR Architecture</span>
                <span className="sep">/</span>
                <span className="cur">{title || 'Workboard'}</span>
            </div>
        );
    };

    return (
        <>
            <header className="topbar">
                <div className="tb-left">
                    <button
                        className="mobile-menu-btn"
                        onClick={onMenuClick}
                        style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', marginRight: 12 }}
                    >
                        ☰
                    </button>
                    {getBreadcrumb()}
                </div>

                <div className="tb-right topbar-right">
                    <button className="t-btn" onClick={onSearchClick}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        Search or jump to…
                        <span style={{ color: 'var(--light)', fontSize: 10, marginLeft: 2 }}>⌘K</span>
                    </button>

                    <button className="t-btn">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        Upload GLB
                    </button>

                    <button className="t-btn p" onClick={onNewProjectClick}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                        New Project
                    </button>

                    <div className="icon-btn" id="notifBtn" onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); }} style={{ position: 'relative', marginLeft: 8 }}>
                        <BellIcon />
                        {unreadCount > 0 && <div className="notif-dot" id="notifDot" style={{ top: 2, right: 2 }}></div>}
                    </div>
                </div>
            </header>

            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </>
    );
}
