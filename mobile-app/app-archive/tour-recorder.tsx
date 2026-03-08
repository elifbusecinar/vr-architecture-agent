import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    border: 'rgba(255,255,255,0.08)',
};

export default function TourRecorderPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Sessions</Text>
                    </TouchableOpacity>
                    <View style={styles.recBadge}>
                        <View style={styles.recDot} />
                        <Text style={styles.recText}>REC · 08:24</Text>
                    </View>
                    <View style={{ width: 60 }} />
                </View>

                <View style={styles.mapContainer}>
                    <View style={styles.mapGrid} />
                    <Svg width="375" height="190" viewBox="0 0 375 190" style={styles.mapSvg}>
                        <Rect x="30" y="20" width="315" height="150" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" rx="2" fill="none" />
                        <Line x1="150" y1="20" x2="150" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                        <Line x1="30" y1="100" x2="345" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                        {/* Path Trail */}
                        <Path d="M60 95 Q80 60 120 55 Q140 50 155 60 Q180 80 195 75" stroke="rgba(74,124,89,0.5)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
                    </Svg>
                    <View style={[styles.posIndicator, { top: '39%', left: '52%' }]}>
                        <View style={styles.posDot} />
                    </View>
                    <Text style={[styles.roomLabel, { top: 60, left: 70 }]}>Living Room</Text>
                    <Text style={[styles.roomLabel, { bottom: 40, left: 70 }]}>Master Suite</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>4</Text>
                        <Text style={styles.statLabel}>Rooms visited</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>340m</Text>
                        <Text style={styles.statLabel}>Distance walked</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>12</Text>
                        <Text style={styles.statLabel}>Notes pinned</Text>
                    </View>
                </View>

                <View style={styles.transcriptSection}>
                    <Text style={styles.sectionTitle}>LIVE TRANSCRIPT</Text>
                    <ScrollView style={styles.transcriptScroll}>
                        <View style={styles.transcriptEntry}>
                            <Text style={styles.entryTime}>08:01</Text>
                            <View style={styles.entryBubble}>
                                <Text style={styles.entryRoom}>LIVING ROOM</Text>
                                <Text style={styles.entryText}>The ceiling height here matches the model but the window reveal is slightly deeper than spec.</Text>
                            </View>
                        </View>
                        <View style={styles.transcriptEntry}>
                            <Text style={styles.entryTime}>08:14</Text>
                            <View style={styles.entryBubble}>
                                <Text style={styles.entryRoom}>MASTER SUITE</Text>
                                <Text style={styles.entryText}>Door swing clearance needs to be checked against the wardrobe placement.</Text>
                            </View>
                        </View>
                        <View style={[styles.transcriptEntry, styles.entryActive]}>
                            <Text style={styles.entryTime}>08:24</Text>
                            <View style={[styles.entryBubble, styles.activeBubble]}>
                                <Text style={styles.entryRoomActive}>MASTER SUITE · NOW</Text>
                                <View style={styles.waveContainer}>
                                    <View style={[styles.waveBar, { height: 10 }]} />
                                    <View style={[styles.waveBar, { height: 16 }]} />
                                    <View style={[styles.waveBar, { height: 12 }]} />
                                    <View style={[styles.waveBar, { height: 8 }]} />
                                    <View style={[styles.waveBar, { height: 14 }]} />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.ctrlSec}>
                        <Text style={styles.ctrlSecText}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ctrlSec}>
                        <Text style={styles.ctrlSecText}>New room</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ctrlStop}>
                        <Text style={styles.ctrlStopText}>Stop & sync</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
    recBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(217,85,85,0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(217,85,85,0.35)' },
    recDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.red },
    recText: { color: '#F08080', fontSize: 11, fontWeight: '600', marginLeft: 6 },
    mapContainer: { margin: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, height: 190, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    mapGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
    mapSvg: { ...StyleSheet.absoluteFillObject },
    posIndicator: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.green, borderWidth: 2, borderColor: 'white' },
    posDot: { ...StyleSheet.absoluteFillObject, borderRadius: 8, backgroundColor: 'rgba(74,124,89,0.3)', transform: [{ scale: 1.5 }] },
    roomLabel: { position: 'absolute', color: 'rgba(255,255,255,0.2)', fontSize: 9 },
    statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
    statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
    statVal: { color: 'white', fontSize: 20, fontWeight: '700' },
    statLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 4 },
    transcriptSection: { flex: 1, marginHorizontal: 16, marginTop: 20 },
    sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 12 },
    transcriptScroll: { flex: 1 },
    transcriptEntry: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    entryActive: { opacity: 1 },
    entryTime: { fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 },
    entryBubble: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    activeBubble: { backgroundColor: 'rgba(74,124,89,0.08)', borderColor: 'rgba(74,124,89,0.4)' },
    entryRoom: { fontSize: 9, color: COLORS.green, fontWeight: '700', marginBottom: 4 },
    entryRoomActive: { fontSize: 9, color: '#7ECB94', fontWeight: '700', marginBottom: 4 },
    entryText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 18 },
    waveContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginTop: 4, height: 20 },
    waveBar: { width: 3, backgroundColor: 'rgba(74,124,89,0.6)', borderRadius: 2 },
    controls: { flexDirection: 'row', gap: 10, margin: 16, marginBottom: 30 },
    ctrlSec: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
    ctrlSecText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
    ctrlStop: { flex: 1, backgroundColor: 'rgba(217,85,85,0.12)', borderRadius: 14, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(217,85,85,0.4)' },
    ctrlStopText: { color: '#F08080', fontSize: 13, fontWeight: '600' },
});
