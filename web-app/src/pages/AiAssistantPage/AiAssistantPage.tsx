import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { aiService } from '@/services/ai/ai.service';
import '@/styles/ai-assistant.css';


export default function AiAssistantPage() {
    const { messages, setMessages } = useChat();
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const chatWrapRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        if (chatWrapRef.current) {
            chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 160) + 'px';
        setInputText(el.value);
    };

    const getTime = () => {
        return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'u' as const,
            text,
            time: getTime()
        };

        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInputText('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        setIsTyping(true);

        try {
            // Prepare history for Gemini
            const history = currentMessages.map(m => ({
                role: m.role === 'u' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await aiService.chat(history);

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: 'ai' as const,
                text: response,
                time: getTime()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error("AI Chat Error Detail:", error);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'ai' as const,
                text: `I'm having trouble connecting to my brain right now. 
                <br/><br/><strong>Technical Detail:</strong> ${error.message || 'Unknown error'}
                <br/><br/>Please check your internet connection and verify your API key in the .env file.`,
                time: getTime()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const useSug = (title: string) => {
        setInputText(title);
        // Focus and trigger send in next tick
        setTimeout(() => {
            handleSend();
        }, 0);
    };

    const copyToClipboard = (text: string, e: React.MouseEvent) => {
        navigator.clipboard.writeText(text).catch(() => { });
        const btn = e.currentTarget as HTMLButtonElement;
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11" height="11"><rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copied`;
        setTimeout(() => {
            btn.innerHTML = originalContent;
        }, 1500);
    };

    return (
        <div className="ai-assistant-page">
            {/* Page Header */}
            <div className="topbar">
                <div className="breadcrumb">
                    <span>VR Architecture</span>
                    <span className="sep">/</span>
                    <span className="cur">AI Assistant</span>
                </div>
                <div className="topbar-right">
                    <button className="t-btn">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        Search or jump to…
                        <span style={{ color: "var(--light)", fontSize: "10px", marginLeft: "2px" }}>⌘K</span>
                    </button>
                    <button className="t-btn">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        Upload GLB
                    </button>
                    <button className="t-btn p" onClick={() => { setMessages([]); }}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                        New Session
                    </button>
                </div>
            </div>

            <div className="chat-wrap" ref={chatWrapRef}>
                <div className="chat-scroll">
                    {messages.length === 0 ? (
                        <div className="welcome">
                            <div className="w-eye">— AI Chat</div>
                            <h1 className="w-title">Ask anything about<br />your <em>workspace.</em></h1>
                            <p className="w-sub">Projects, models, clients, VR sessions — everything in your workspace is within reach.</p>
                            <div className="sugs">
                                <div className="sug" onClick={() => useSug('Summarize my active projects')}>
                                    <div className="sug-t">Summarize my active projects</div>
                                    <div className="sug-s">Active status & next steps</div>
                                </div>
                                <div className="sug" onClick={() => useSug('Prepare VR walkthrough checklist')}>
                                    <div className="sug-t">Prepare VR walkthrough checklist</div>
                                    <div className="sug-s">Pre-session checklist</div>
                                </div>
                                <div className="sug" onClick={() => useSug('Material palette ideas')}>
                                    <div className="sug-t">Material palette ideas</div>
                                    <div className="sug-s">For residential projects</div>
                                </div>
                                <div className="sug" onClick={() => useSug('Draft a client approval email')}>
                                    <div className="sug-t">Draft a client approval email</div>
                                    <div className="sug-s">Approval request</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="msgs">
                            {messages.map(m => (
                                <div key={m.id} className={`msg ${m.role}`}>
                                    <div className="mh">
                                        <span className="mn">{m.role === 'u' ? 'You' : 'VRA Intelligence'}</span>
                                        <span className="mt">{m.time}</span>
                                    </div>
                                    <div className="bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                                    {m.role === 'ai' && (
                                        <div className="macts">
                                            <button className="abt" onClick={(e) => copyToClipboard(m.text.replace(/<[^>]*>/g, ''), e)}>
                                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="9" y="9" width="13" height="13" rx="1" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                                Copy
                                            </button>
                                            <button className="abt">
                                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
                                                </svg>
                                                Helpful
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="msg ai">
                                    <div className="mh"><span className="mn">VRA Intelligence</span></div>
                                    <div className="typing"><span></span><span></span><span></span></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="input-zone">
                <div className="input-wrap">
                    <div className="input-shell">
                        <div className="ta-row">
                            <textarea
                                ref={textareaRef}
                                value={inputText}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI Assistant…"
                                rows={1}
                            />
                            <button className="send-btn" disabled={!inputText.trim()} onClick={handleSend}>
                                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </div>
                        <div className="ibar">
                            <button className="ibb">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                Attach file
                            </button>
                            <div className="isep"></div>
                            <button className="ibb">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                Link project
                            </button>
                            <div className="mpill">
                                <span className="live"></span>
                                VRA Intelligence
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="9" height="9"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="ihint">VRA AI has context about your workspace · projects, clients & models</div>
                </div>
            </div>
        </div>
    );
}
