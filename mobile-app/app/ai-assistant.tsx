import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { aiService } from '../src/services/ai.service';
import { useAuth } from '../src/context/AuthContext';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    cream: '#F0EDE8',
    black: '#1A1917',
    gray: '#8A8783',
    green: '#4A7C59',
    white: '#FFFFFF',
    border: '#D8D4CE',
};

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function AIAssistantPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: `Hi ${user?.username || 'Architect'}, I'm your VR Project Assistant. How can I help you today?`, sender: 'ai', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const aiResponse = await aiService.askAssistant(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('AI chat failed:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
                {!isUser && (
                    <View style={styles.aiAvatar}>
                        <Svg viewBox="0 0 12 12" width={12} height={12}>
                            <Path d="M2 2h8v8H2z" fill="white" />
                        </Svg>
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg viewBox="0 0 16 16" width={16} height={16}>
                            <Path d="M10 3L4 8l6 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                    <View style={{ width: 34 }} />
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {isTyping && (
                    <View style={styles.typingIndicator}>
                        <ActivityIndicator size="small" color={COLORS.green} />
                        <Text style={styles.typingText}>Assistant is thinking...</Text>
                    </View>
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <View style={styles.inputArea}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your question..."
                            placeholderTextColor={COLORS.gray}
                            value={input}
                            onChangeText={setInput}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                            <Svg viewBox="0 0 16 16" width={18} height={18}>
                                <Path d="M1 1l14 7-14 7V1zm0 7h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.cream,
    },
    headerTitle: {
        fontSize: 15,
        fontFamily: 'DMSans_700Bold',
        color: COLORS.black,
    },
    backBtn: {
        width: 34,
        height: 34,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 30,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '85%',
    },
    userRow: {
        alignSelf: 'flex-end',
    },
    aiRow: {
        alignSelf: 'flex-start',
    },
    aiAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginTop: 4,
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
    },
    userBubble: {
        backgroundColor: COLORS.black,
        borderBottomRightRadius: 2,
    },
    aiBubble: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
        lineHeight: 20,
    },
    userText: {
        color: 'white',
    },
    aiText: {
        color: COLORS.black,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
        gap: 8,
    },
    typingText: {
        fontSize: 11,
        color: COLORS.gray,
        fontFamily: 'DMSans_400Regular',
    },
    inputArea: {
        padding: 12,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.cream,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        color: COLORS.black,
        fontFamily: 'DMSans_400Regular',
        maxHeight: 100,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.green,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
