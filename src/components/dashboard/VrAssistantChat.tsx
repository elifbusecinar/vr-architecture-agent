import React, { useState, useRef, useEffect } from 'react';
import AgentLogo from '@/components/common/AgentLogo';
import '@/styles/ai-components.css';
import { aiService } from '@/services/ai/ai.service';

interface Message {
    role: 'user' | 'model' | 'system';
    text: string;
    time: string;
}



const VrAssistantChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hi 👋 I've loaded the project context. I found 1 critical issue you should review before today's client call.", time: "09:14" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setInputValue('');

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessages = [...messages, { role: 'user', text: userMsg, time: now }] as Message[];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const history = newMessages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await aiService.chat(history);
            setMessages(prev => [...prev, {
                role: 'model',
                text: response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button className="vra-chat-trigger" onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AgentLogo size={24} color="white" />
                <div className="vra-chat-trigger-badge">1</div>
            </button>

            {isOpen && (
                <div className="vra-chat-window">
                    <div className="vra-chat-header">
                        <div className="vra-chat-header-av" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AgentLogo size={18} color="white" />
                        </div>
                        <div>
                            <div className="vra-chat-header-name">Archie AI</div>
                            <div className="vra-chat-header-status">
                                <div className="vra-chat-header-status-dot" />
                                Online · Project context loaded
                            </div>
                        </div>
                        <button className="vra-chat-header-close" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="vra-chat-messages" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`vra-msg ${m.role === 'user' ? 'user' : ''}`}>
                                <div className={`vra-msg-av vra-msg-av-${m.role === 'user' ? 'user' : 'ai'}`}>
                                    {m.role === 'user' ? 'SE' : <AgentLogo size={14} color="white" />}
                                </div>
                                <div>
                                    <div className={`vra-msg-bubble vra-msg-bubble-${m.role === 'user' ? 'user' : 'ai'}`}>
                                        {m.text}
                                    </div>
                                    <div className="vra-msg-time" style={{ textAlign: m.role === 'user' ? "right" : "left" }}>{m.time}</div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="vra-msg">
                                <div className="vra-msg-av vra-msg-av-ai">
                                    <AgentLogo size={14} color="white" />
                                </div>
                                <div className="vra-msg-bubble vra-msg-bubble-ai" style={{ padding: "10px 14px" }}>
                                    <div className="vra-typing-dots">
                                        <div className="vra-typing-dot" />
                                        <div className="vra-typing-dot" />
                                        <div className="vra-typing-dot" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="vra-quick-replies">
                        <div className="vra-qr-chip">Show diff</div>
                        <div className="vra-qr-chip">Open BIM inspector</div>
                        <div className="vra-qr-chip">Who's online?</div>
                    </div>

                    <div className="vra-chat-input-bar">
                        <div className="vra-chat-voice">🎙</div>
                        <input
                            className="vra-chat-input"
                            type="text"
                            placeholder="Ask about this project…"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button className="vra-chat-send" onClick={handleSend}>↑</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default VrAssistantChat;
