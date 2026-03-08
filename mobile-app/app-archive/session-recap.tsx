import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    cream: '#F0EDE8',
    gray: '#8A8783',
    green: '#4A7C59',
    border: '#D8D4CE',
};

export default function SessionRecapPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l10 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Sessions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn}>
                        <Text style={styles.shareText}>Share</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.hero}>
                        <Text style={styles.eyebrow}>SESSION RECAP · TODAY 09:12</Text>
                        <Text style={styles.title}>Riverside <Text style={styles.titleItalic}>Penthouse</Text></Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}><Text style={styles.metaText}>28 min</Text></View>
                            <View style={styles.metaItem}><Text style={styles.metaText}>2 attendees</Text></View>
                            <View style={styles.metaItem}><Text style={styles.metaText}>5 rooms</Text></View>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Duration</Text>
                            <Text style={styles.statValMedium}>28:14</Text>
                            <Text style={styles.statSub}>↑ +4 min avg</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Rooms explored</Text>
                            <Text style={styles.statVal}>5</Text>
                            <Text style={styles.statSub}>of 6 total</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Annotations left</Text>
                            <Text style={styles.statVal}>7</Text>
                            <Text style={styles.statSub}>3 by client</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Client approved</Text>
                            <Text style={[styles.statVal, { color: COLORS.green }]}>Yes</Text>
                            <Text style={styles.statSub}>Signed 09:38</Text>
                        </View>
                    </View>

                    <View style={styles.roomsCard}>
                        <View style={styles.roomsHeader}>
                            <Text style={styles.roomsTitle}>Time per room</Text>
                            <Text style={styles.roomsCount}>5 visited</Text>
                        </View>
                        <View style={styles.roomRow}>
                            <View style={styles.roomBarColumn}>
                                <Text style={styles.roomName}>Master Suite</Text>
                                <View style={styles.barBg}><View style={[styles.barFill, { width: '75%' }]} /></View>
                            </View>
                            <Text style={styles.roomTime}>11:20</Text>
                        </View>
                        <View style={styles.roomRow}>
                            <View style={styles.roomBarColumn}>
                                <Text style={styles.roomName}>Living Room</Text>
                                <View style={styles.barBg}><View style={[styles.barFill, { width: '45%' }]} /></View>
                            </View>
                            <Text style={styles.roomTime}>6:42</Text>
                        </View>
                    </View>

                    <View style={styles.sentimentCard}>
                        <Text style={styles.sentTitle}>Client reactions</Text>
                        <View style={styles.sentRow}>
                            <View style={styles.sentItem}><Text style={styles.sentEmoji}>😍</Text><Text style={styles.sentPct}>62%</Text><Text style={styles.sentLabel}>Loved it</Text></View>
                            <View style={styles.sentItem}><Text style={styles.sentEmoji}>🤔</Text><Text style={styles.sentPct}>24%</Text><Text style={styles.sentLabel}>Questions</Text></View>
                            <View style={styles.sentItem}><Text style={styles.sentEmoji}>✏️</Text><Text style={styles.sentPct}>14%</Text><Text style={styles.sentLabel}>Changes</Text></View>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionBtnPri}>
                            <Text style={styles.actionTextPri}>Export PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtnSec}>
                            <Text style={styles.actionTextSec}>New session</Text>
                        </TouchableOpacity>
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
    shareBtn: { padding: 4 },
    shareText: { color: COLORS.black, fontSize: 13, fontWeight: '600' },
    scrollContent: { paddingBottom: 40 },
    hero: { padding: 20, paddingBottom: 10 },
    eyebrow: { fontSize: 10, color: COLORS.gray, letterSpacing: 1, marginBottom: 6 },
    title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 28, color: COLORS.black },
    titleItalic: { fontFamily: 'PlayfairDisplay_400Regular_Italic', color: COLORS.gray },
    metaRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, color: COLORS.gray },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, marginTop: 10 },
    statCard: { width: (Dimensions.get('window').width - 36) / 2, backgroundColor: 'white', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.border },
    statLabel: { fontSize: 10, color: COLORS.gray, marginBottom: 6 },
    statVal: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 36, color: COLORS.black, fontWeight: '400' },
    statValMedium: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: COLORS.black, marginTop: 4 },
    statSub: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
    roomsCard: { marginHorizontal: 14, marginTop: 12, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
    roomsHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between' },
    roomsTitle: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    roomsCount: { fontSize: 11, color: COLORS.gray },
    roomRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
    roomBarColumn: { flex: 1 },
    roomName: { fontSize: 12, color: COLORS.black, marginBottom: 4 },
    barBg: { backgroundColor: '#E8E4DE', borderRadius: 100, height: 4 },
    barFill: { backgroundColor: COLORS.black, height: 4, borderRadius: 100 },
    roomTime: { fontSize: 11, color: COLORS.gray, width: 32, textAlign: 'right' },
    sentimentCard: { marginHorizontal: 14, marginTop: 12, backgroundColor: 'white', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.border },
    sentTitle: { fontSize: 13, fontWeight: '600', color: COLORS.black, marginBottom: 10 },
    sentRow: { flexDirection: 'row', gap: 8 },
    sentItem: { flex: 1, backgroundColor: COLORS.cream, borderRadius: 12, padding: 10, alignItems: 'center', gap: 4 },
    sentEmoji: { fontSize: 22 },
    sentPct: { fontSize: 14, fontWeight: '700', color: COLORS.black },
    sentLabel: { fontSize: 10, color: COLORS.gray },
    actions: { flexDirection: 'row', gap: 8, marginHorizontal: 14, marginTop: 20 },
    actionBtnPri: { flex: 1, backgroundColor: COLORS.black, borderRadius: 14, height: 48, alignItems: 'center', justifyContent: 'center' },
    actionBtnSec: { flex: 1, backgroundColor: 'white', borderRadius: 14, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.border },
    actionTextPri: { color: 'white', fontSize: 13, fontWeight: '600' },
    actionTextSec: { color: COLORS.black, fontSize: 13, fontWeight: '600' },
});
