import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { aiService } from '@/services/ai/ai.service';
import '@/styles/ai-components.css';

// Responses are now handled by aiService.chat

const VrAssistantChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, setMessages } = useChat();
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    if (location.pathname === '/ai-assistant') return null;

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text) return;

        const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const userMsg = {
            id: Date.now().toString(),
            role: 'u' as const,
            text,
            time: now
        };

        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInputText('');
        setIsTyping(true);

        try {
            // Prepare history for Gemini
            const history = currentMessages.map(m => ({
                role: m.role === 'u' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const responseText = await aiService.chat(history);

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: 'ai' as const,
                text: responseText,
                time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('AI Chat Error:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleExpand = () => {
        setIsOpen(false);
        navigate('/ai-assistant');
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 90) + 'px';
        setInputText(el.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* FAB */}
            <button className="w-fab" onClick={() => setIsOpen(!isOpen)}>
                {messages.length === 0 && !isOpen && <span className="w-fab-dot"></span>}
                {!isOpen ? (
                    <svg className="ico-open" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                ) : (
                    <svg className="ico-close" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                )}
            </button>

            {/* PANEL */}
            <div className={`w-panel ${isOpen ? 'open' : ''}`}>
                <div className="w-head">
                    <div className="w-head-icon">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="w-head-info">
                        <div className="w-head-title">VRA Intelligence</div>
                        <div className="w-head-sub"><span className="dot"></span> Online · Workspace context active</div>
                    </div>
                    <div className="w-head-actions">
                        <button className="w-icon-btn" onClick={toggleExpand} title="Expand">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                        </button>
                        <button className="w-icon-btn" onClick={() => setIsOpen(false)}>
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>

                <div className="w-msgs" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="w-welcome">
                            <div className="w-welcome-title">How can I<br />help you <em>today?</em></div>
                            <p className="w-welcome-sub">Ask about your projects, clients, or anything workspace-related.</p>
                            <div className="w-chips">
                                <div className="w-chip" onClick={() => { setInputText('Summarize my active projects'); setTimeout(handleSend, 0); }}>Summarize my active projects</div>
                                <div className="w-chip" onClick={() => { setInputText('Prepare VR walkthrough checklist'); setTimeout(handleSend, 0); }}>Prepare VR walkthrough checklist</div>
                                <div className="w-chip" onClick={() => { setInputText('Draft a client approval email'); setTimeout(handleSend, 0); }}>Draft a client approval email</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(m => (
                                <div key={m.id} className={`wm ${m.role === 'u' ? 'wu' : 'wai'}`}>
                                    <div className="wm-head">{m.role === 'u' ? 'You' : 'VRA Intelligence'} · {m.time}</div>
                                    <div className="wm-bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                                </div>
                            ))}
                            {isTyping && (
                                <div className="wm wai">
                                    <div className="wm-head">VRA Intelligence</div>
                                    <div className="w-typing"><span></span><span></span><span></span></div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="w-input-area">
                    <div className="w-input-row">
                        <textarea
                            placeholder="Ask anything…"
                            rows={1}
                            value={inputText}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="w-send" disabled={!inputText.trim()} onClick={handleSend}>
                            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
                    <div className="w-hint">VRA AI · Workspace context</div>
                </div>
            </div>
        </>
    );
};

export default VrAssistantChat;
