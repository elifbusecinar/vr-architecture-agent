import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
    id: string;
    role: 'u' | 'ai';
    text: string;
    time: string;
}

interface ChatContextType {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    addMessage: (role: 'u' | 'ai', text: string) => void;
    clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = (role: 'u' | 'ai', text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            role,
            text,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <ChatContext.Provider value={{ messages, setMessages, addMessage, clearChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
