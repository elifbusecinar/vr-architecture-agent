import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenTransition } from '../../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    blackSoft: '#2C2A27',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    border: 'rgba(255,255,255,0.1)',
};

export default function LiveSessionPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Sessions</Text>
                    </TouchableOpacity>
                    <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveBadgeText}>LIVE · 00:18:42</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.moreBtn}>···</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.infoSection}>
                        <Text style={styles.projectName}>Riverside{"\n"}<Text style={styles.projectItalic}>Penthouse</Text></Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Svg viewBox="0 0 12 12" width={12} height={12}>
                                    <Path d="M6 1L11 3.5V8.5L6 11L1 8.5V3.5L6 1Z" fill="rgba(255,255,255,0.35)" />
                                </Svg>
                                <Text style={styles.metaText}>Level 3 · Master Suite</Text>
                            </View>
                            <View style={styles.sep} />
                            <View style={styles.metaItem}>
                                <Svg viewBox="0 0 12 12" width={12} height={12}>
                                    <Circle cx="6" cy="6" r="4.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                                    <Path d="M6 3.5v2.5l2 1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" fill="none" />
                                </Svg>
                                <Text style={styles.metaText}>Started 18 min ago</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.attendeesSection}>
                        <Text style={styles.label}>IN SESSION</Text>
                        <View style={styles.attendeesRow}>
                            <View style={[styles.attendeeChip, { borderColor: 'rgba(74,124,89,0.5)', backgroundColor: 'rgba(74,124,89,0.15)' }]}>
                                <View style={[styles.avatar, { backgroundColor: '#4A7C59' }]}>
                                    <Text style={styles.avatarText}>A1</Text>
                                </View>
                                <Text style={styles.attendeeName}>You</Text>
                                <Text style={styles.vrIcon}>🥽</Text>
                            </View>
                            <View style={[styles.attendeeChip, { borderColor: 'rgba(123,111,160,0.5)', backgroundColor: 'rgba(123,111,160,0.15)' }]}>
                                <View style={[styles.avatar, { backgroundColor: '#7B6FA0' }]}>
                                    <Text style={styles.avatarText}>JK</Text>
                                </View>
                                <Text style={styles.attendeeName}>J. Kim</Text>
                                <Text style={styles.vrIcon}>🥽</Text>
                            </View>
                            <View style={styles.attendeeChip}>
                                <View style={[styles.avatar, { backgroundColor: '#C4783A' }]}>
                                    <Text style={styles.avatarText}>MR</Text>
                                </View>
                                <Text style={styles.attendeeName}>M. Ross</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modelPlaceholder}>
                        <View style={styles.gridOverlay} />
                        <View style={styles.roomTag}><Text style={styles.roomTagText}>Master Suite · 3F</Text></View>

                        <Svg width="140" height="80" viewBox="0 0 140 80">
                            <Rect x="10" y="10" width="120" height="60" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />
                            <Rect x="25" y="25" width="90" height="40" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none" />
                            <Line x1="10" y1="10" x2="25" y2="25" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                            <Line x1="130" y1="10" x2="115" y2="25" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                            <Line x1="10" y1="70" x2="25" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                            <Line x1="130" y1="70" x2="115" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                        </Svg>

                        <View style={styles.userPin}>
                            <View style={styles.pinRing} />
                            <View style={styles.pinDot} />
                            <Text style={styles.pinLabel}>Arch1</Text>
                        </View>
                        <Text style={styles.modelTag}>LIVE MODEL VIEW</Text>
                    </View>

                    <View style={styles.controlsSection}>
                        <Text style={styles.label}>SESSION CONTROLS</Text>
                        <View style={styles.controlsGrid}>
                            <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlActive]}>
                                <Svg viewBox="0 0 22 22" width={22} height={22}>
                                    <Circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.4" fill="none" />
                                    <Path d="M8 7l6 4-6 4V7Z" fill="white" />
                                </Svg>
                                <Text style={styles.ctrlText}>Follow{"\n"}client</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ctrlBtn}>
                                <Svg viewBox="0 0 22 22" width={22} height={22}>
                                    <Path d="M4 6h14M4 11h14M4 16h14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
                                </Svg>
                                <Text style={[styles.ctrlText, { opacity: 0.6 }]}>Scene{"\n"}list</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ctrlBtn}>
                                <Svg viewBox="0 0 22 22" width={22} height={22}>
                                    <Rect x="3" y="5" width="14" height="10" rx="1.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" fill="none" />
                                    <Path d="M17 9l3 2-3 2V9Z" fill="rgba(255,255,255,0.6)" />
                                </Svg>
                                <Text style={[styles.ctrlText, { opacity: 0.6 }]}>Share{"\n"}screen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ctrlBtn}>
                                <Svg viewBox="0 0 22 22" width={22} height={22}>
                                    <Path d="M11 3v16M3 11h16" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
                                    <Circle cx="11" cy="11" r="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" />
                                </Svg>
                                <Text style={[styles.ctrlText, { opacity: 0.6 }]}>Add{"\n"}notif</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ctrlBtn}>
                                <Svg viewBox="0 0 22 22" width={22} height={22}>
                                    <Circle cx="11" cy="11" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" fill="none" />
                                    <Path d="M9 9l4 4M13 9l-4 4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
                                </Svg>
                                <Text style={[styles.ctrlText, { opacity: 0.6 }]}>Mute{"\n"}all</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlDanger]}>
                                <Svg viewBox="0 0 22 22" width={22} height={22}>
                                    <Circle cx="11" cy="11" r="8" stroke="#F08080" strokeWidth="1.4" fill="none" />
                                    <Rect x="8" y="8" width="6" height="6" rx="1" fill="#F08080" />
                                </Svg>
                                <Text style={[styles.ctrlText, { color: '#F08080' }]}>End{"\n"}session</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.annotationPortal}>
                        <Text style={styles.annPlaceholder}>Add note for this location...</Text>
                        <View style={styles.annActions}>
                            <TouchableOpacity style={styles.annBtn}>
                                <Svg viewBox="0 0 14 14" width={14} height={14}>
                                    <Path d="M1 7a6 6 0 1012 0A6 6 0 001 7zm6-2v4M7 4.5v.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                </Svg>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.annBtn, { backgroundColor: '#333' }]}>
                                <Svg viewBox="0 0 14 14" width={14} height={14}>
                                    <Path d="M1 7l12-6-5 13-2-5L1 7z" fill="white" />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    topbar: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'DMSans_500Medium' },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(217,85,85,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(217,85,85,0.3)',
    },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.red },
    liveBadgeText: { fontSize: 10, color: '#F08080', fontFamily: 'DMSans_700Bold' },
    moreBtn: { color: 'rgba(255,255,255,0.4)', fontSize: 20, letterSpacing: 2 },

    scrollContent: { paddingBottom: 20 },
    infoSection: { paddingHorizontal: 20, marginTop: 10 },
    projectName: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 24, color: 'white', lineHeight: 28 },
    projectItalic: { fontFamily: 'PlayfairDisplay_400Regular_Italic', color: 'rgba(255,255,255,0.5)' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DMSans_400Regular' },
    sep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.2)' },

    attendeesSection: { marginTop: 20, paddingHorizontal: 20 },
    label: { fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, fontFamily: 'DMSans_700Bold', marginBottom: 10 },
    attendeesRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    attendeeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        padding: 5,
        paddingRight: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    avatar: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 9, fontWeight: '700', color: 'white' },
    attendeeName: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'DMSans_400Regular' },
    vrIcon: { fontSize: 10 },

    modelPlaceholder: {
        marginTop: 20,
        marginHorizontal: 20,
        height: 140,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        // Pattern simulation: would use a grid image or repetitive Svg here
        backgroundColor: '#000',
    },
    roomTag: {
        position: 'absolute', top: 10, right: 12,
        backgroundColor: 'rgba(255,255,255,0.07)',
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 6,
    },
    roomTagText: { fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: 'DMSans_400Regular' },
    userPin: { alignItems: 'center', position: 'absolute' },
    pinRing: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.green, opacity: 0.5 },
    pinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green, marginTop: -16 },
    pinLabel: { fontSize: 9, color: COLORS.green, fontFamily: 'DMSans_700Bold', marginTop: 4 },
    modelTag: { position: 'absolute', bottom: 10, fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5, fontFamily: 'DMSans_700Bold' },

    controlsSection: { marginTop: 24, paddingHorizontal: 20 },
    controlsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    ctrlBtn: {
        width: (Dimensions.get('window').width - 56) / 3,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 14,
        alignItems: 'center',
        gap: 8,
    },
    ctrlActive: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' },
    ctrlDanger: { backgroundColor: 'rgba(217,85,85,0.1)', borderColor: 'rgba(217,85,85,0.25)' },
    ctrlText: { fontSize: 10, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 14, fontFamily: 'DMSans_500Medium' },

    annotationPortal: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    annPlaceholder: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DMSans_400Regular' },
    annActions: { flexDirection: 'row', gap: 8 },
    annBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
});
