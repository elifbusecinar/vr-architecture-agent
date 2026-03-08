import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Image, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    cream: '#F0EDE8',
    gray: '#8A8783',
    red: '#D95555',
    border: '#D8D4CE',
};

type Pin = {
    id: string;
    type: 'Materials' | 'Lighting' | 'Furniture' | 'Layout ref';
    uri?: string;
    color?: string;
    note?: string;
    date: string;
    isLoved: boolean;
};

const INITIAL_PINS: Pin[] = [
    { id: '1', type: 'Materials', color: '#C8B89A', note: "Love the warm oak finish", date: '2d ago', isLoved: true },
    { id: '2', type: 'Lighting', color: '#B0C8D8', date: '1w ago', isLoved: false },
    { id: '3', type: 'Layout ref', color: '#E8E0D0', date: '5d ago', isLoved: true },
    { id: '4', type: 'Furniture', color: '#D8C8A8', note: "Something like this for living room", date: '1w ago', isLoved: true },
];

export default function MoodBoardPage() {
    const router = useRouter();
    const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAddPin = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setIsProcessing(true);
            setTimeout(() => { // Simulate cloud upload
                const newPin: Pin = {
                    id: Math.random().toString(),
                    type: 'Materials',
                    uri: result.assets[0].uri,
                    date: 'Just now',
                    isLoved: false,
                };
                setPins([newPin, ...pins]);
                setIsProcessing(false);
            }, 1000);
        }
    };

    const toggleLove = (id: string) => {
        setPins(pins.map(p => p.id === id ? { ...p, isLoved: !p.isLoved } : p));
    };

    // Simple 2-column masonry split
    const col1 = pins.filter((_, i) => i % 2 === 0);
    const col2 = pins.filter((_, i) => i % 2 !== 0);

    const renderCard = (pin: Pin) => (
        <View key={pin.id} style={styles.card}>
            <View style={[styles.cardImg, { height: pin.id === '3' ? 180 : 130, backgroundColor: pin.color || '#E0E0E0' }]}>
                {pin.uri ? (
                    <Image source={{ uri: pin.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                ) : (
                    <Svg width="40" height="40" viewBox="0 0 40 40" opacity="0.4">
                        <Rect x="5" y="15" width="30" height="20" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
                        <Path d="M5 20l8-5 7 8 5-4 10 6" stroke="white" strokeWidth="1.2" fill="none" />
                    </Svg>
                )}
                <View style={styles.cardDate}><Text style={styles.cardDateText}>{pin.date}</Text></View>
                {pin.note && <View style={styles.cardNote}><Text style={styles.cardNoteText}>"{pin.note}"</Text></View>}
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.tag}>{pin.type}</Text>
                <TouchableOpacity onPress={() => toggleLove(pin.id)}>
                    <Svg width="14" height="14" viewBox="0 0 14 14">
                        <Path
                            d="M7 12S1 8.5 1 4.5a3 3 0 016 0 3 3 0 016 0C13 8.5 7 12 7 12z"
                            fill={pin.isLoved ? COLORS.red : "none"}
                            stroke={pin.isLoved ? COLORS.red : COLORS.gray}
                            strokeWidth="1.2"
                        />
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddPin} disabled={isProcessing}>
                        {isProcessing ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Svg width="11" height="11" viewBox="0 0 11 11">
                                    <Path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                </Svg>
                                <Text style={styles.addText}>Add pin</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.clientStrip}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
                    <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>Sarah Jensen</Text>
                        <Text style={styles.clientProject}>Riverside Penthouse · Concept Stage</Text>
                    </View>
                    <View style={styles.pinCountBadge}>
                        <Text style={styles.pinCount}>{pins.length} items</Text>
                    </View>
                </View>

                <View style={styles.tabs}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                        <View style={[styles.tab, styles.tabActive]}><Text style={styles.tabTextActive}>All</Text></View>
                        <View style={styles.tab}><Text style={styles.tabText}>Materials</Text></View>
                        <View style={styles.tab}><Text style={styles.tabText}>Lighting</Text></View>
                        <View style={styles.tab}><Text style={styles.tabText}>Furniture</Text></View>
                        <View style={styles.tab}><Text style={styles.tabText}>References</Text></View>
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.reactionsSummary}>
                        <View style={styles.reactItem}><Text style={styles.reactEmoji}>❤️</Text><View><Text style={styles.reactVal}>{pins.filter(p => p.isLoved).length}</Text><Text style={styles.reactLabel}>Loved</Text></View></View>
                        <View style={styles.reactDiv} />
                        <View style={styles.reactItem}><Text style={styles.reactEmoji}>🤔</Text><View><Text style={styles.reactVal}>3</Text><Text style={styles.reactLabel}>Maybe</Text></View></View>
                        <View style={styles.reactDiv} />
                        <View style={styles.reactItem}><Text style={styles.reactEmoji}>✏️</Text><View><Text style={styles.reactVal}>2</Text><Text style={styles.reactLabel}>Change</Text></View></View>
                    </View>

                    <View style={styles.grid}>
                        <View style={styles.column}>{col1.map(renderCard)}</View>
                        <View style={styles.column}>{col2.map(renderCard)}</View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.black, fontSize: 13, fontFamily: 'DMSans_500Medium' },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.black, borderRadius: 12, paddingHorizontal: 14, height: 34 },
    addText: { color: 'white', fontSize: 12, fontFamily: 'DMSans_700Bold' },
    clientStrip: { paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7B6FA0', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontFamily: 'PlayfairDisplay_400Regular', color: 'white', fontSize: 18 },
    clientInfo: { flex: 1, marginLeft: 12 },
    clientName: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, color: COLORS.black, letterSpacing: -0.4 },
    clientProject: { fontFamily: 'DMSans_500Medium', fontSize: 11, color: COLORS.gray, marginTop: 2 },
    pinCountBadge: { backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
    pinCount: { fontSize: 10, fontFamily: 'DMSans_700Bold', color: COLORS.black, textTransform: 'uppercase' },
    tabs: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
    tabScroll: { paddingHorizontal: 16 },
    tab: { paddingVertical: 12, paddingHorizontal: 18, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: COLORS.black },
    tabText: { color: COLORS.gray, fontSize: 13 },
    tabTextActive: { color: COLORS.black, fontSize: 13, fontWeight: '700' },
    scrollContent: { paddingVertical: 10 },
    reactionsSummary: { marginHorizontal: 14, backgroundColor: 'white', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    reactItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    reactEmoji: { fontSize: 20 },
    reactVal: { fontSize: 14, fontWeight: '700', color: COLORS.black },
    reactLabel: { fontSize: 10, color: COLORS.gray },
    reactDiv: { width: 1, height: 20, backgroundColor: COLORS.border },
    grid: { paddingHorizontal: 10, flexDirection: 'row', gap: 8 },
    column: { flex: 1, gap: 8 },
    card: {
        backgroundColor: 'white',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    cardImg: { width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    cardDate: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
    cardDateText: { fontSize: 9, fontFamily: 'DMSans_700Bold', color: COLORS.black },
    cardNote: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(26,25,23,0.7)', padding: 10 },
    cardNoteText: { fontSize: 10, color: 'white', lineHeight: 14, fontFamily: 'DMSans_400Regular' },
    cardFooter: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tag: { fontSize: 10, fontFamily: 'DMSans_700Bold', color: COLORS.gray, textTransform: 'uppercase' },
});
