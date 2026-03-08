import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    cream: '#F0EDE8',
    gray: '#8A8783',
    border: '#D8D4CE',
};

export default function HeadsetMonitorPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Devices</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Headset Status</Text>
                    <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>Live</Text></View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.heroCard}>
                        <Text style={styles.heroLabel}>CONNECTED DEVICE</Text>
                        <Text style={styles.heroTitle}>Meta Quest 3 <Text style={styles.heroItalic}>· Arch1</Text></Text>

                        <View style={styles.batteryRow}>
                            <View>
                                <Text style={styles.batteryPct}>72%</Text>
                                <Text style={styles.batterySub}>~2h 10m left</Text>
                            </View>
                            <View style={styles.batteryVisual}>
                                <View style={[styles.batteryFill, { width: '72%' }]} />
                            </View>
                        </View>

                        <View style={styles.signalGrid}>
                            <View style={styles.signalCard}>
                                <Text style={styles.sigLabel}>WiFi</Text>
                                <Text style={styles.sigVal}>-48dBm</Text>
                                <View style={styles.sigBars}>
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 4 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 7 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 10 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 13 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 16 }]} />
                                </View>
                            </View>
                            <View style={styles.signalCard}>
                                <Text style={styles.sigLabel}>Latency</Text>
                                <Text style={styles.sigVal}>12ms</Text>
                                <View style={styles.sigBars}>
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 4 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 7 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 10 }]} />
                                    <View style={[styles.sigBar, { height: 13 }]} />
                                    <View style={[styles.sigBar, { height: 16 }]} />
                                </View>
                            </View>
                            <View style={styles.signalCard}>
                                <Text style={styles.sigLabel}>Thermal</Text>
                                <Text style={styles.sigVal}>38°C</Text>
                                <View style={styles.sigBars}>
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 4 }]} />
                                    <View style={[styles.sigBar, styles.sigBarOn, { height: 7 }]} />
                                    <View style={[styles.sigBar, { height: 10 }]} />
                                    <View style={[styles.sigBar, { height: 13 }]} />
                                    <View style={[styles.sigBar, { height: 16 }]} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.locationCard}>
                        <View style={styles.locHeader}>
                            <Text style={styles.locTitle}>Current location in model</Text>
                            <View style={styles.trackingBadge}><Text style={styles.trackingBadgeText}>● Tracking</Text></View>
                        </View>
                        <View style={styles.locContent}>
                            <View style={styles.miniMap}>
                                <Svg width="100" height="80" viewBox="0 0 100 80">
                                    <Rect x="5" y="5" width="90" height="70" stroke="rgba(0,0,0,0.12)" strokeWidth="1" rx="2" fill="none" />
                                    <Line x1="45" y1="5" x2="45" y2="75" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
                                </Svg>
                                <View style={styles.userDot} />
                            </View>
                            <View style={styles.locInfo}>
                                <Text style={styles.roomName}>Master Suite</Text>
                                <Text style={styles.floorName}>Floor 3 · Northeast wing</Text>
                                <Text style={styles.timeTag}>In room 8m 22s</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.timeline}>
                        <Text style={styles.timelineLabel}>Room history</Text>
                        <View style={styles.tlRow}>
                            <Text style={styles.tlTime}>09:33</Text>
                            <View style={styles.tlDotCol}><View style={[styles.tlDot, styles.tlDotActive]} /><View style={styles.tlLine} /></View>
                            <Text style={styles.tlContent}>Master Suite <Text style={styles.tlSub}>Current · 8m 22s</Text></Text>
                        </View>
                        <View style={styles.tlRow}>
                            <Text style={styles.tlTime}>09:28</Text>
                            <View style={styles.tlDotCol}><View style={styles.tlDot} /><View style={styles.tlLine} /></View>
                            <Text style={styles.tlContent}>Bathroom <Text style={styles.tlSub}>5m 14s</Text></Text>
                        </View>
                        <View style={styles.tlRow}>
                            <Text style={styles.tlTime}>09:21</Text>
                            <View style={styles.tlDotCol}><View style={styles.tlDot} /></View>
                            <Text style={styles.tlContent}>Living Room <Text style={styles.tlSub}>7m 02s</Text></Text>
                        </View>
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
    headerTitle: { fontSize: 13, fontFamily: 'DMSans_700Bold', color: COLORS.black },
    liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4A7C59' },
    liveText: { fontSize: 11, color: COLORS.green, fontWeight: '700' },
    scrollContent: { paddingBottom: 40 },
    heroCard: { margin: 18, backgroundColor: COLORS.black, borderRadius: 20, padding: 20 },
    heroLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 8 },
    heroTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 22, color: 'white' },
    heroItalic: { fontFamily: 'PlayfairDisplay_400Regular_Italic', color: 'rgba(255,255,255,0.55)' },
    batteryRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
    batteryPct: { fontSize: 24, fontWeight: '700', color: 'white' },
    batterySub: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
    batteryVisual: { flex: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
    batteryFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 7 },
    signalGrid: { flexDirection: 'row', gap: 10, marginTop: 16 },
    signalCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    sigLabel: { fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 6 },
    sigVal: { color: 'white', fontSize: 16, fontWeight: '700' },
    sigBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 16, marginTop: 6 },
    sigBar: { width: 4, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
    sigBarOn: { backgroundColor: COLORS.green },
    locationCard: { marginHorizontal: 18, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
    locHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    locTitle: { fontSize: 13, color: COLORS.black, fontWeight: '600' },
    trackingBadge: { backgroundColor: 'rgba(74,124,89,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    trackingBadgeText: { color: COLORS.green, fontSize: 10, fontWeight: '700' },
    locContent: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
    miniMap: { width: 100, height: 80, backgroundColor: '#F8F7F4', borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    userDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green, borderWidth: 2, borderColor: 'white' },
    locInfo: { flex: 1 },
    roomName: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 18, color: COLORS.black },
    floorName: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
    timeTag: { fontSize: 11, color: COLORS.gray, marginTop: 8 },
    timeline: { paddingHorizontal: 18, marginTop: 20 },
    timelineLabel: { fontSize: 11, fontWeight: '700', color: COLORS.black, marginBottom: 12 },
    tlRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
    tlTime: { width: 40, fontSize: 10, color: COLORS.gray, textAlign: 'right', marginTop: 2 },
    tlDotCol: { alignItems: 'center' },
    tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C8C5C0', marginTop: 4 },
    tlDotActive: { backgroundColor: COLORS.green },
    tlLine: { width: 1, flex: 1, backgroundColor: COLORS.border, minHeight: 20 },
    tlContent: { flex: 1, fontSize: 12, color: COLORS.black, marginBottom: 12 },
    tlSub: { color: COLORS.gray, fontSize: 11 },
});
