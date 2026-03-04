import React from 'react';
import { useNotifications, useNotificationActions } from '@/hooks/useNotifications';

export const XIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l8 8m0-8l-8 8" /></svg>;


interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
    const { data: notifications = [] } = useNotifications();
    const { markAsRead } = useNotificationActions();

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: '52px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        backdropFilter: 'blur(1px)',
                        zIndex: 2000,
                        transition: 'opacity 0.2s',
                        pointerEvents: 'auto'
                    }}
                />
            )}

            <div
                style={{
                    position: 'fixed',
                    top: '64px',
                    right: '12px',
                    bottom: '12px',
                    width: '320px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-md)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 20px 48px -12px rgba(0,0,0,0.18)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
                    visibility: isOpen ? 'visible' : 'hidden',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s',
                    zIndex: 2001,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-inset)' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>Notifications</h2>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--ink-3)',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <XIcon />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-3)', fontSize: '13px' }}>
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                style={{
                                    padding: '14px 20px',
                                    borderBottom: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'background 0.1s',
                                    backgroundColor: notif.isRead ? 'transparent' : 'var(--blue-soft)',
                                    opacity: notif.isRead ? 0.7 : 1
                                }}
                                onClick={() => !notif.isRead && markAsRead.mutate(notif.id)}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.background = notif.isRead ? 'transparent' : 'var(--blue-soft)')}
                            >
                                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 2, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {!notif.isRead && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)' }} />}
                                    {notif.title}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginBottom: 4, lineHeight: 1.4 }}>
                                    {notif.message}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--ink-4)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {new Date(notif.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
