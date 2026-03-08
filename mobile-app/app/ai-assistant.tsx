import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polygon } from 'react-native-svg';
import { aiService } from '../src/services/ai.service';
import { useAuth } from '../src/context/AuthContext';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';

const COLORS = {
    cream: '#F0EDE8',
    creamDark: '#E8E4DE',
    black: '#1A1917',
    blackSoft: '#2C2A27',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    white: '#FAFAF8',
    border: '#D8D4CE',
};

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export default function AIAssistantPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [fontsLoaded] = useFonts({
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_700Bold,
        PlayfairDisplay_400Regular,
        PlayfairDisplay_400Regular_Italic,
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    if (!fontsLoaded) return null;

    const getTime = () => {
        return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const sendMessage = async (text: string = input) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: trimmed,
            sender: 'user',
            timestamp: getTime(),
        };

        setMessages((prev: Message[]) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Simulate real AI response with service
            const response = await aiService.askAssistant(trimmed);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'ai',
                timestamp: getTime(),
            };
            setMessages((prev: Message[]) => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsTyping(false);
        }
    };

    const useSug = (title: string) => {
        sendMessage(title);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgContainer, isUser ? styles.userMsg : styles.aiMsg]}>
                <View style={[styles.msgHeader, isUser && { justifyContent: 'flex-end' }]}>
                    <Text style={styles.msgName}>{isUser ? 'You' : 'VRA Intelligence'}</Text>
                    <Text style={styles.msgTime}>{item.timestamp}</Text>
                </View>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>{item.text.replace(/<[^>]*>/g, '')}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* ─── TOP BAR ─── */}
            <View style={styles.topbar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={COLORS.black} strokeWidth="2">
                        <Path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <View style={styles.topbarInfo}>
                    <Text style={styles.topbarTitle}>VRA Intelligence</Text>
                    <View style={styles.topbarSub}>
                        <View style={styles.liveDot} />
                        <Text style={styles.topbarSubText}>Workspace context active</Text>
                    </View>
                </View>
                <View style={styles.topbarActions}>
                    <TouchableOpacity style={styles.topIconBtn}>
                        <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={COLORS.black} strokeWidth="2">
                            <Circle cx="11" cy="11" r="7" />
                            <Path d="m21 21-4.35-4.35" strokeLinecap="round" />
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topIconBtn}>
                        <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={COLORS.black} strokeWidth="2">
                            <Circle cx="12" cy="12" r="1" />
                            <Circle cx="19" cy="12" r="1" />
                            <Circle cx="5" cy="12" r="1" />
                        </Svg>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ─── CHAT BODY ─── */}
            <View style={styles.body}>
                {messages.length === 0 ? (
                    <Animated.View style={[styles.welcome, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
                        <Text style={styles.welcomeEyebrow}>— AI ASSISTANT</Text>
                        <Text style={styles.welcomeTitle}>How can I{'\n'}help you <Text style={styles.italic}>today?</Text></Text>
                        <Text style={styles.welcomeSub}>Ask about your projects, clients, VR sessions — everything in your workspace.</Text>

                        <View style={styles.chips}>
                            <SuggestionChip
                                title="Summarize my projects"
                                sub="Active status & next steps"
                                onPress={() => useSug("Summarize my projects")}
                            />
                            <SuggestionChip
                                title="Prepare VR walkthrough"
                                sub="Pre-session checklist"
                                onPress={() => useSug("Prepare VR walkthrough")}
                            />
                            <SuggestionChip
                                title="Material palette ideas"
                                sub="For residential projects"
                                onPress={() => useSug("Material palette ideas")}
                            />
                        </View>
                    </Animated.View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                        ListHeaderComponent={() => (
                            <View style={styles.dateDivider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dateText}>Today</Text>
                                <View style={styles.dividerLine} />
                            </View>
                        )}
                        ListFooterComponent={() => isTyping ? (
                            <View style={styles.typingBubble}>
                                <View style={styles.typingDot} />
                                <View style={[styles.typingDot, { opacity: 0.6 }]} />
                                <View style={[styles.typingDot, { opacity: 0.3 }]} />
                            </View>
                        ) : null}
                    />
                )}
            </View>

            {/* ─── INPUT AREA ─── */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
                <View style={styles.inputArea}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity style={styles.attachBtn}>
                            <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={COLORS.grayLight} strokeWidth="2">
                                <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" strokeLinecap="round" />
                            </Svg>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textarea}
                            placeholder="Message VRA Intelligence…"
                            placeholderTextColor={COLORS.grayLight}
                            value={input}
                            onChangeText={setInput}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
                            onPress={() => sendMessage()}
                            disabled={!input.trim()}
                        >
                            <Svg viewBox="0 0 24 24" width={16} height={16} fill="white" stroke="none">
                                <Polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.inputHint}>VRA AI · Workspace context active</Text>
                </View>
            </KeyboardAvoidingView>

            {/* ─── BOTTOM NAV ─── */}
            <View style={styles.bottomNav}>
                <NavItem label="Overview" icon="home" />
                <NavItem label="Projects" icon="projects" />
                <NavItem label="AI" icon="chat" active />
                <NavItem label="Clients" icon="users" />
            </View>
        </SafeAreaView>
    );
}

function SuggestionChip({ title, sub, onPress }: { title: string; sub: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.chip} onPress={onPress}>
            <View>
                <Text style={styles.chipTitle}>{title}</Text>
                <Text style={styles.chipSub}>{sub}</Text>
            </View>
            <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={COLORS.grayLight} strokeWidth="2">
                <Path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        </TouchableOpacity>
    );
}

function NavItem({ label, icon, active }: { label: string; icon: string; active?: boolean }) {
    return (
        <TouchableOpacity style={styles.navItem}>
            <Svg viewBox="0 0 20 20" width={22} height={22} fill={active ? COLORS.black : COLORS.grayLight}>
                {icon === 'home' && <Path d="M3 10L10 3l7 7v7H13v-4H7v4H3V10Z" />}
                {icon === 'projects' && <Rect x="2" y="4" width="16" height="12" rx="2" stroke={active ? COLORS.black : COLORS.grayLight} strokeWidth="1.4" fill="none" />}
                {icon === 'chat' && <Path d="M18 13a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />}
                {icon === 'users' && <Circle cx="10" cy="7" r="3" stroke={active ? COLORS.black : COLORS.grayLight} strokeWidth="1.4" fill="none" />}
            </Svg>
            <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
            {active && <View style={styles.navDot} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    topbarInfo: { flex: 1, marginLeft: 8 },
    topbarTitle: { fontSize: 14, fontFamily: 'DM_Sans_500Medium', color: COLORS.black },
    topbarSub: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
    liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.green, marginRight: 4 },
    topbarSubText: { fontSize: 10, color: COLORS.gray, fontFamily: 'DM_Sans_400Regular' },
    topbarActions: { flexDirection: 'row', gap: 6 },
    topIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: { flex: 1 },
    welcome: { flex: 1, padding: 24, paddingTop: 40 },
    welcomeEyebrow: { fontSize: 10, fontFamily: 'DM_Sans_500Medium', color: COLORS.grayLight, letterSpacing: 1.2 },
    welcomeTitle: {
        fontSize: 34,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: COLORS.black,
        lineHeight: 38,
        marginTop: 12,
    },
    italic: { fontFamily: 'PlayfairDisplay_400Regular_Italic' },
    welcomeSub: {
        fontSize: 14,
        fontFamily: 'DM_Sans_400Regular',
        color: COLORS.gray,
        lineHeight: 22,
        marginTop: 12,
        maxWidth: '85%',
    },
    chips: { marginTop: 32, gap: 10 },
    chip: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chipTitle: { fontSize: 14, fontFamily: 'DM_Sans_500Medium', color: COLORS.black },
    chipSub: { fontSize: 11, color: COLORS.grayLight, marginTop: 2 },
    listContent: { padding: 16, paddingBottom: 24 },
    dateDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 8 },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    dateText: { fontSize: 10, color: COLORS.grayLight, fontFamily: 'DM_Sans_500Medium' },
    msgContainer: { marginBottom: 20, maxWidth: '85%' },
    userMsg: { alignSelf: 'flex-end' },
    aiMsg: { alignSelf: 'flex-start' },
    msgHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    msgName: { fontSize: 10, color: COLORS.gray, fontFamily: 'DM_Sans_500Medium' },
    msgTime: { fontSize: 10, color: COLORS.grayLight, fontFamily: 'DM_Sans_400Regular' },
    bubble: { padding: 12, borderRadius: 18 },
    userBubble: { backgroundColor: COLORS.black, borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, borderTopLeftRadius: 4 },
    bubbleText: { fontSize: 14, fontFamily: 'DM_Sans_400Regular', lineHeight: 22 },
    userText: { color: 'white' },
    aiText: { color: COLORS.black },
    typingBubble: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 18,
        borderTopLeftRadius: 4,
        width: 60,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typingDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.grayLight },
    inputArea: {
        padding: 12,
        backgroundColor: COLORS.cream,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    inputRow: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        padding: 8,
        paddingLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    attachBtn: { width: 32, height: 32, justifyContent: 'center' },
    textarea: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 14,
        fontFamily: 'DM_Sans_400Regular',
        color: COLORS.black,
        maxHeight: 100,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: { backgroundColor: COLORS.border },
    inputHint: { fontSize: 10, color: COLORS.grayLight, textAlign: 'center', marginTop: 8 },
    bottomNav: {
        height: 72,
        backgroundColor: COLORS.cream,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        paddingTop: 8,
    },
    navItem: { flex: 1, alignItems: 'center' },
    navText: { fontSize: 10, color: COLORS.grayLight, marginTop: 4, fontFamily: 'DM_Sans_500Medium' },
    navTextActive: { color: COLORS.black },
    navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.black, marginTop: 2 },
});
