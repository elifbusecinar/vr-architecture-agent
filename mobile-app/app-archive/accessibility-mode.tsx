import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { ScreenTransition } from '../src/components/ScreenTransition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AccessibilityModePage() {
    const router = useRouter();

    const [highContrast, setHighContrast] = useState(true);
    const [textSize, setTextSize] = useState(1.2);

    const ACC_COLORS = {
        bg: '#000000',
        card: '#111111',
        text: '#FFFFFF',
        accent: '#FFFF00', // High contrast yellow
        border: '#FFFFFF',
    };

    const actionButtons = [
        { label: 'Join Active Session', icon: 'M15 10l5 5-5 5' },
        { label: 'Cloud Library', icon: 'M3 15h18v6H3z' },
        { label: 'Settings', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
        { label: 'Logout', icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' },
    ];

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={[styles.container, { backgroundColor: ACC_COLORS.bg }]}>
                {/* High Contrast Header */}
                <View style={[styles.header, { borderBottomColor: ACC_COLORS.border }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ACC_COLORS.accent} strokeWidth="3">
                            <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <Text style={[styles.backText, { color: ACC_COLORS.accent, fontSize: 18 * textSize }]}>BACK</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: ACC_COLORS.text, fontSize: 20 * textSize }]}>DASHBOARD</Text>
                    <View style={styles.accBadge}>
                        <Text style={styles.accBadgeText}>ACCESSIBILITY MODE</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {/* Live Session Alert - HIGH CONTRAST */}
                    <View style={[styles.hero, { borderColor: ACC_COLORS.accent, backgroundColor: ACC_COLORS.card }]}>
                        <View style={styles.liveIndicator}>
                            <View style={[styles.dot, { backgroundColor: ACC_COLORS.accent }]} />
                            <Text style={[styles.liveText, { color: ACC_COLORS.accent, fontSize: 16 * textSize }]}>LIVE SESSION IN VR</Text>
                        </View>
                        <Text style={[styles.heroTitle, { color: ACC_COLORS.text, fontSize: 32 * textSize }]}>Riverside Penthouse</Text>
                        <Text style={[styles.heroSub, { color: ACC_COLORS.text, fontSize: 18 * textSize }]}>3 Team members active</Text>

                        <Button
                            title="JOIN SESSION NOW"
                            variant="primary"
                            size="lg"
                            onPress={() => { }}
                            style={{
                                backgroundColor: ACC_COLORS.accent,
                                marginTop: 20,
                                height: 80,
                                borderRadius: 0,
                                borderWidth: 3,
                                borderColor: '#000'
                            }}
                            textStyle={{ color: '#000', fontWeight: '900', fontSize: 20 * textSize }}
                        />
                    </View>

                    {/* Action Grid */}
                    <View style={styles.grid}>
                        {actionButtons.map((btn, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.actionBtn, { borderColor: ACC_COLORS.border, backgroundColor: ACC_COLORS.card }]}
                                activeOpacity={0.7}
                            >
                                <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ACC_COLORS.text} strokeWidth="2.5">
                                    <Path d={btn.icon} strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <Text style={[styles.btnLabel, { color: ACC_COLORS.text, fontSize: 18 * textSize }]}>{btn.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.settingsBox}>
                        <Text style={[styles.setLabel, { color: ACC_COLORS.accent, fontSize: 14 * textSize }]}>SETTINGS</Text>
                        <View style={styles.setRow}>
                            <Text style={[styles.setText, { color: ACC_COLORS.text, fontSize: 18 * textSize }]}>Text Size: {textSize.toFixed(1)}x</Text>
                            <View style={styles.setBtns}>
                                <TouchableOpacity onPress={() => setTextSize(Math.max(1, textSize - 0.2))} style={styles.adjBtn}><Text style={styles.adjText}>-</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => setTextSize(Math.min(2, textSize + 0.2))} style={styles.adjBtn}><Text style={styles.adjText}>+</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Bar */}
                <View style={[styles.footer, { borderTopColor: ACC_COLORS.border }]}>
                    {['HOME', 'MODELS', 'CLIENTS', 'PROFILE'].map((label, i) => (
                        <TouchableOpacity key={i} style={styles.footItem}>
                            <View style={[styles.footIcon, { borderColor: ACC_COLORS.border }, i === 0 && { backgroundColor: ACC_COLORS.accent }]} />
                            <Text style={[styles.footLabel, { color: ACC_COLORS.text, fontSize: 12 * textSize }]}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 4
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    backText: { fontWeight: '900' },
    title: { fontWeight: '900', textAlign: 'center' },
    accBadge: { backgroundColor: '#F00', paddingHorizontal: 10, paddingVertical: 4 },
    accBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
    scroll: { padding: 20 },
    hero: {
        padding: 30,
        borderWidth: 6,
        marginBottom: 20,
    },
    liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    dot: { width: 16, height: 16, borderRadius: 8 },
    liveText: { fontWeight: '900' },
    heroTitle: { fontFamily: 'DMSans_700Bold', marginBottom: 8, fontWeight: '900' },
    heroSub: { fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
    actionBtn: {
        width: (SCREEN_WIDTH - 52) / 2,
        height: 160,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 16
    },
    btnLabel: { fontWeight: '900', textAlign: 'center' },
    settingsBox: { padding: 20, borderTopWidth: 2, borderTopColor: '#333' },
    setLabel: { fontWeight: '900', marginBottom: 16, letterSpacing: 2 },
    setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    setText: { fontWeight: '700' },
    setBtns: { flexDirection: 'row', gap: 20 },
    adjBtn: { width: 60, height: 60, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    adjText: { fontSize: 32, fontWeight: '900', color: '#000' },
    footer: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 4
    },
    footItem: { alignItems: 'center', gap: 8 },
    footIcon: { width: 40, height: 40, borderWidth: 3 },
    footLabel: { fontWeight: '900' },
});
