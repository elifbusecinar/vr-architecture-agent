import React from 'react';
import type { Story } from '@/types/stories.types';
import { StoryType } from '@/types/stories.types';

interface StoryViewerModalProps {
    story: Story | null;
    onClose: () => void;
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose }) => {
    if (!story) return null;

    const renderContent = () => {
        switch (story.type) {
            case StoryType.Recording:
                return (
                    <video
                        src={story.mediaUrl}
                        controls
                        autoPlay
                        style={{ width: '100%', borderRadius: 8, maxHeight: '70vh' }}
                    />
                );
            case StoryType.Screenshot:
            case StoryType.Panorama:
                return (
                    <img
                        src={story.mediaUrl}
                        alt={story.title}
                        style={{ width: '100%', borderRadius: 8, maxHeight: '70vh', objectFit: 'contain' }}
                    />
                );
            case StoryType.VoiceNote:
                return (
                    <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-inset)', borderRadius: 12 }}>
                        <div style={{ fontSize: 48, marginBottom: 20 }}>🎙️</div>
                        <audio src={story.mediaUrl} controls autoPlay style={{ width: '100%' }} />
                    </div>
                );
            default:
                return <div style={{ padding: 20 }}>Unsupported media type</div>;
        }
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg)', width: '90%', maxWidth: 1000,
                    borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    position: 'relative', border: '1px solid var(--border)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{story.title}</h2>
                        <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                            {new Date(story.createdAt).toLocaleString()} · {
                                story.type === StoryType.Recording ? 'Session Recording' :
                                    story.type === StoryType.Screenshot ? 'VR Snapshot' :
                                        story.type === StoryType.Panorama ? '360° Panorama' : 'Voice Annotation'
                            }
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--bg-inset)', border: 'none', color: 'var(--ink)',
                            width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18
                        }}
                    >✕</button>
                </div>
                <div style={{ padding: 24, display: 'flex', gap: 24, flexDirection: 'column' }}>
                    <div style={{ background: '#000', borderRadius: 12, overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {renderContent()}
                    </div>
                    {story.description && (
                        <div style={{ padding: '0 8px' }}>
                            <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Description</h4>
                            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{story.description}</p>
                        </div>
                    )}
                </div>
                <div style={{ padding: '16px 24px', background: 'var(--bg-inset)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <a href={story.mediaUrl} download className="btn btn-primary" style={{ textDecoration: 'none' }}>Download Media</a>
                </div>
            </div>
        </div>
    );
};

export default StoryViewerModal;
