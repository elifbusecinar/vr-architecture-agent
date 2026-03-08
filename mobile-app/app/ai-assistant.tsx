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
    Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polygon } from 'react-native-svg';

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

const MR = [
    `<p>You have <strong>0 active projects</strong> this month. Want me to help set up your first project?</p>`,
    `<p>Before your VR walkthrough:</p><ul><li>Meta Quest 3 firmware up to date</li><li>GLB model uploaded & processed</li><li>Session link tested</li><li>Client briefed on navigation</li><li>Annotation mode enabled</li></ul>`,
    `<p>For residential work, some palette directions:</p><ul><li><strong>Warm Brutalism</strong> — concrete, oak, aged brass</li><li><strong>Biophilic Neutral</strong> — linen, travertine, terracotta</li><li><strong>Contemporary Dark</strong> — matte black, walnut, smoked glass</li></ul>`,
    `<p>Happy to draft that. Share the client name, project title, and what's being approved — I'll write it in your tone.</p>`
];

let mIdx = 0;

export default function AIAssistantPage() {
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Animations for welcome
    const w1 = useRef(new Animated.Value(0)).current;
    const w2 = useRef(new Animated.Value(0)).current;
    const w3 = useRef(new Animated.Value(0)).current;
    const w4 = useRef(new Animated.Value(0)).current;

    // Animations for dots and UI
    const blinkAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const sendPulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Welcome stagger animation
        Animated.stagger(70, [
            Animated.timing(w1, { toValue: 1, duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
            Animated.timing(w2, { toValue: 1, duration: 600, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
            Animated.timing(w3, { toValue: 1, duration: 600, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
            Animated.timing(w4, { toValue: 1, duration: 600, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
        ]).start();

        // Blinking cursor
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, { toValue: 0, duration: 0, delay: 550, useNativeDriver: true }),
                Animated.timing(blinkAnim, { toValue: 1, duration: 0, delay: 550, useNativeDriver: true }),
            ])
        ).start();

        // Live dot pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (input.trim() && !isTyping) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(sendPulseAnim, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                    Animated.timing(sendPulseAnim, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                ])
            ).start();
        } else {
            sendPulseAnim.setValue(0);
            sendPulseAnim.stopAnimation();
        }
    }, [input, isTyping]);

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
            const responseTxt = MR[mIdx % MR.length];
            mIdx++;
            setTimeout(() => {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: responseTxt,
                    sender: 'ai',
                    timestamp: getTime(),
                };
                setMessages((prev: Message[]) => [...prev, aiMsg]);
                setIsTyping(false);
            }, 900 + Math.random() * 600);
        } catch (e) {
            console.error(e);
            setIsTyping(false);
        }
    };

    const useSug = (title: string) => {
        sendMessage(title);
    };

    const wStyle = (anim: Animated.Value) => ({
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }]
    });

    const liveDotStyle = {
        boxShadow: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0px 0px 0px 0px rgba(74,124,89,0.5)', '0px 0px 0px 4px rgba(74,124,89,0)']
        })
    };

    const sendBtnStyle = {
        boxShadow: sendPulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0px 0px 0px 0px rgba(26,25,23,0)', '0px 0px 0px 4px rgba(26,25,23,0.08)']
        })
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* ─── TOP BAR ─── */}
            <View style={styles.topbar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.6}>
                    <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={COLORS.black} strokeWidth="2">
                        <Path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <View style={styles.topbarInfo}>
                    <Text style={styles.topbarTitle} numberOfLines={1}>VRA Intelligence</Text>
                    <View style={styles.topbarSub}>
                        <Animated.View style={[styles.liveDot, liveDotStyle]} />
                        <Text style={styles.topbarSubText}>Workspace context active</Text>
                    </View>
                </View>
                <View style={styles.topbarActions}>
                    <TouchableOpacity style={styles.topIconBtn} activeOpacity={0.6}>
                        <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={COLORS.black} strokeWidth="2" strokeLinecap="round">
                            <Circle cx="11" cy="11" r="7" />
                            <Path d="m21 21-4.35-4.35" />
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topIconBtn} activeOpacity={0.6}>
                        <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={COLORS.black} strokeWidth="2" strokeLinecap="round">
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
                    <View style={styles.welcome}>
                        <Animated.Text style={[styles.welcomeEyebrow, wStyle(w1)]}>— AI Assistant</Animated.Text>
                        <Animated.Text style={[styles.welcomeTitle, wStyle(w2)]}>
                            How can I{'\n'}help you <Text style={styles.italic}>today?</Text>
                            <Animated.Text style={[styles.cursor, { opacity: blinkAnim }]}>|</Animated.Text>
                        </Animated.Text>
                        <Animated.Text style={[styles.welcomeSub, wStyle(w3)]}>
                            Ask about your projects, clients, VR sessions — everything in your workspace.
                        </Animated.Text>

                        <Animated.View style={[styles.chips, wStyle(w4)]}>
                            <SuggestionChip title="Summarize my projects" sub="Active status & next steps" onPress={() => useSug("Summarize my projects")} />
                            <SuggestionChip title="Prepare VR walkthrough" sub="Pre-session checklist" onPress={() => useSug("Prepare VR walkthrough")} />
                            <SuggestionChip title="Material palette ideas" sub="For residential projects" onPress={() => useSug("Material palette ideas")} />
                            <SuggestionChip title="Draft client email" sub="Approval request" onPress={() => useSug("Draft client email")} />
                        </Animated.View>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={({ item }) => <MessageBubble item={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={() => (
                            <View style={styles.dateDivider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dateText}>Today</Text>
                                <View style={styles.dividerLine} />
                            </View>
                        )}
                        ListFooterComponent={() => isTyping ? <TypingIndicator /> : null}
                    />
                )}
            </View>

            {/* ─── INPUT AREA ─── */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputArea}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity style={styles.attachBtn}>
                            <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={COLORS.grayLight} strokeWidth="2" strokeLinecap="round">
                                <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
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
                            activeOpacity={0.8}
                            onPress={() => sendMessage()}
                            disabled={!input.trim()}
                        >
                            <Animated.View style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled, sendBtnStyle]}>
                                <Svg viewBox="0 0 24 24" width={14} height={14} fill="white" stroke="none">
                                    <Polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </Svg>
                            </Animated.View>
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

// ─── MESSAGE COMPONENT WITH ANIMATION & HTML PARSER ───
const MessageBubble = ({ item }: { item: Message }) => {
    const riseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(riseAnim, {
            toValue: 1,
            duration: 250,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            useNativeDriver: true,
        }).start();
    }, []);

    const isUser = item.sender === 'user';
    const textStyle = isUser ? styles.userText : styles.aiText;

    const renderHtmlToBlocks = (html: string) => {
        if (!html.includes('<')) {
            return <Text style={[styles.bubbleText, textStyle]}>{html}</Text>;
        }

        const renderInlineStyle = (text: string, baseKey: string) => {
            const regex = /<strong>(.*?)<\/strong>|<em>(.*?)<\/em>/g;
            const elements: React.ReactNode[] = [];
            let lastIndex = 0;
            let match;
            let k = 0;

            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    elements.push(text.substring(lastIndex, match.index));
                }
                if (match[1]) {
                    elements.push(<Text key={`${baseKey}-b-${k++}`} style={[styles.bubbleText, textStyle, { fontFamily: 'DMSans_500Medium' }]}>{match[1]}</Text>);
                } else if (match[2]) {
                    elements.push(<Text key={`${baseKey}-i-${k++}`} style={[styles.bubbleText, textStyle, { fontStyle: 'italic' }]}>{match[2]}</Text>);
                }
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < text.length) {
                elements.push(text.substring(lastIndex));
            }
            return elements.length > 0 ? elements : text;
        };

        const blocks = html.match(/(<p>.*?<\/p>|<ul>.*?<\/ul>)/g) || [html];
        return (
            <View>
                {blocks.map((block, i) => {
                    if (block.startsWith('<ul>')) {
                        const lis = block.match(/<li>(.*?)<\/li>/g)?.map(li => li.replace(/<\/?li>/g, '')) || [];
                        return (
                            <View key={`ul-${i}`} style={styles.ulStyle}>
                                {lis.map((li, j) => (
                                    <View key={`li-${j}`} style={styles.liStyle}>
                                        <Text style={[styles.bubbleText, textStyle]}>• </Text>
                                        <Text style={[styles.bubbleText, textStyle, { flex: 1 }]}>
                                            {renderInlineStyle(li, `li-${i}-${j}`)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    const pText = block.replace(/<\/?p>/g, '');
                    return (
                        <Text key={`p-${i}`} style={[styles.bubbleText, textStyle, i > 0 && { marginTop: 8 }]}>
                            {renderInlineStyle(pText, `p-${i}`)}
                        </Text>
                    );
                })}
            </View>
        );
    };

    return (
        <Animated.View style={[
            styles.msgContainer,
            isUser ? styles.userMsg : styles.aiMsg,
            { opacity: riseAnim, transform: [{ translateY: riseAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }
        ]}>
            <View style={[styles.msgHeader, isUser && { justifyContent: 'flex-end' }]}>
                {isUser && <Text style={styles.msgName}>You</Text>}
                {!isUser && <Text style={styles.msgName}>VRA Intelligence</Text>}
                <Text style={styles.msgTime}>{item.timestamp}</Text>
            </View>
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                {renderHtmlToBlocks(item.text)}
            </View>
        </Animated.View>
    );
};

// ─── TYPING INDICATOR ───
const TypingIndicator = () => {
    const d1 = useRef(new Animated.Value(0)).current;
    const d2 = useRef(new Animated.Value(0)).current;
    const d3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnim = (anim: Animated.Value, delay: number) => Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.delay(1300 - 500 - delay)
            ])
        );
        createAnim(d1, 0).start();
        createAnim(d2, 180).start();
        createAnim(d3, 360).start();
    }, []);

    const s = (a: Animated.Value) => ({
        opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
        transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
    });

    return (
        <Animated.View style={[styles.msgContainer, styles.aiMsg, { marginTop: -4 }]}>
            <View style={styles.msgHeader}>
                <Text style={styles.msgName}>VRA Intelligence</Text>
            </View>
            <View style={styles.typingBubble}>
                <Animated.View style={[styles.typingDot, s(d1)]} />
                <Animated.View style={[styles.typingDot, s(d2)]} />
                <Animated.View style={[styles.typingDot, s(d3)]} />
            </View>
        </Animated.View>
    );
};

// ─── COMPONENTS ───
function SuggestionChip({ title, sub, onPress }: { title: string; sub: string; onPress: () => void }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shineAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 0.98, duration: 150, useNativeDriver: true }),
            Animated.timing(shineAnim, { toValue: 1, duration: 450, useNativeDriver: true })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        setTimeout(() => shineAnim.setValue(0), 450);
    };

    const shineTranslateX = shineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-250, 400]
    });

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }], overflow: 'hidden', borderRadius: 14, position: 'relative' }]}>
            <TouchableOpacity
                style={styles.chip}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View>
                    <Text style={styles.chipTitle}>{title}</Text>
                    <Text style={styles.chipSub}>{sub}</Text>
                </View>
                <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={COLORS.grayLight} strokeWidth="2">
                    <Path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            </TouchableOpacity>

            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        width: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        transform: [{ translateX: shineTranslateX }, { skewX: '-20deg' }],
                    }
                ]}
                pointerEvents="none"
            />
        </Animated.View>
    );
}

function NavItem({ label, icon, active }: { label: string; icon: string; active?: boolean }) {
    return (
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Svg viewBox="0 0 20 20" width={20} height={20} fill={active ? COLORS.black : 'none'} stroke={active ? 'none' : COLORS.grayLight} strokeWidth="1.4">
                {icon === 'home' && <Path d="M3 10L10 3l7 7v7H13v-4H7v4H3V10Z" fill={active ? COLORS.black : COLORS.grayLight} stroke="none" />}
                {icon === 'projects' && <Rect x="2" y="4" width="16" height="12" rx="2" />}
                {icon === 'chat' && <Path d="M18 13a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" fill={active ? COLORS.black : COLORS.grayLight} stroke="none" />}
                {icon === 'users' && <Circle cx="10" cy="7" r="3" />}
                {icon === 'users' && !active && <Path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />}
                {icon === 'projects' && !active && <Path d="M7 4v12M13 4v12M2 10h16" />}
            </Svg>
            <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
            {active && <View style={styles.navDot} />}
        </TouchableOpacity>
    );
}

// ─── STYLES ───
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: COLORS.cream,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    topbarInfo: { flex: 1, marginLeft: 2 },
    topbarTitle: { fontSize: 14, fontFamily: 'DMSans_500Medium', color: COLORS.black, letterSpacing: -0.14 },
    topbarSub: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
    liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.green, marginRight: 4 },
    topbarSubText: { fontSize: 10, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    topbarActions: { flexDirection: 'row', gap: 6 },
    topIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    body: { flex: 1 },
    welcome: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    welcomeEyebrow: {
        fontSize: 10,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.grayLight,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    welcomeTitle: {
        fontSize: 32,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: COLORS.black,
        lineHeight: 35.84, // 1.12
        letterSpacing: -0.64, // -0.02em
        marginBottom: 10,
    },
    italic: { fontFamily: 'PlayfairDisplay_400Regular_Italic', color: COLORS.blackSoft },
    cursor: { fontFamily: 'DMSans_400Regular', color: COLORS.grayLight },
    welcomeSub: {
        fontSize: 13,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
        lineHeight: 20.8, // 1.6
        marginBottom: 24,
        maxWidth: 280,
    },
    chips: { gap: 8, marginTop: 0 },
    chip: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingVertical: 13,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chipTitle: { fontSize: 13, fontFamily: 'DMSans_400Regular', color: COLORS.black, letterSpacing: -0.13 },
    chipSub: { fontSize: 11, color: COLORS.grayLight, marginTop: 2, fontFamily: 'DMSans_400Regular' },

    listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
    dateDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, marginBottom: 14, gap: 8 },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    dateText: { fontSize: 10.5, color: COLORS.grayLight, fontFamily: 'DMSans_400Regular' },

    msgContainer: { marginBottom: 16, maxWidth: '86%' },
    userMsg: { alignSelf: 'flex-end' },
    aiMsg: { alignSelf: 'flex-start' },
    msgHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
    msgName: { fontSize: 10.5, color: COLORS.gray, fontFamily: 'DMSans_500Medium' },
    msgTime: { fontSize: 10.5, color: COLORS.grayLight, fontFamily: 'DMSans_400Regular' },
    bubble: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 18 },
    userBubble: { backgroundColor: COLORS.black, borderBottomRightRadius: 4, paddingVertical: 11 },
    aiBubble: { backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, borderTopLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
    bubbleText: { fontSize: 13.5, fontFamily: 'DMSans_400Regular', lineHeight: 22.27 }, // 1.65
    userText: { color: 'white' },
    aiText: { color: COLORS.black },
    ulStyle: { marginVertical: 7, marginLeft: 14 },
    liStyle: { flexDirection: 'row', marginBottom: 4 },

    typingBubble: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 18,
        borderTopLeftRadius: 4,
        width: 60,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1
    },
    typingDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.grayLight },

    inputArea: {
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: COLORS.cream,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    inputRow: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        paddingVertical: 10,
        paddingRight: 10,
        paddingLeft: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    attachBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 1 },
    textarea: {
        flex: 1,
        padding: 0,
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.black,
        minHeight: 20,
        maxHeight: 100,
        lineHeight: 22.4, // 1.6
    },
    sendBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: { backgroundColor: COLORS.border, transform: [{ scale: 1 }] },
    inputHint: { fontSize: 10, color: COLORS.grayLight, textAlign: 'center', marginTop: 8, fontFamily: 'DMSans_400Regular' },

    bottomNav: {
        height: 72,
        backgroundColor: COLORS.cream,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        paddingTop: 8,
    },
    navItem: { flex: 1, alignItems: 'center' },
    navText: { fontSize: 9, color: COLORS.grayLight, marginTop: 4, fontFamily: 'DMSans_400Regular', letterSpacing: 0.3 },
    navTextActive: { color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.black, marginTop: 2 },
});
