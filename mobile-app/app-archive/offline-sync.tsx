import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';

const COLORS = {
    black: '#1A1917',
    white: '#FAFAF8',
    cream: '#F0EDE8',
    amber: '#C4783A',
    gray: '#8A8783',
    green: '#4A7C59',
    border: '#D8D4CE',
};

export default function OfflineSyncPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Svg width="16" height="16" viewBox="0 0 16 16">
                        <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </Svg>
                    <Text style={styles.backText}>Dashboard</Text>
                </TouchableOpacity>
                <View style={styles.offlineBadge}>
                    <View style={styles.badgeDot} />
                    <Text style={styles.badgeText}>Offline</Text>
                </View>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.banner}>
                <View style={styles.bannerIcon}>
                    <Svg viewBox="0 0 14 14" width={14} height={14}>
                        <Path d="M7 1v6M7 10v.5" stroke={COLORS.amber} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        <Circle cx="7" cy="7" r="6" stroke={COLORS.amber} strokeWidth="1" fill="none" />
                    </Svg>
                </View>
                <View style={styles.bannerContent}>
                    <Text style={styles.bannerText}><Text style={styles.bold}>No internet connection.</Text> You're working offline. Changes will sync automatically when reconnected.</Text>
                    <Text style={styles.syncDue}>3 notes + 2 photos pending sync</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionLabel}>DOWNLOADED MODELS</Text>
                <View style={styles.modelList}>
                    <View style={styles.modelRow}>
                        <View style={[styles.modelIcon, { backgroundColor: '#E8F2EC' }]}>
                            <Svg viewBox="0 0 20 20" width={18} height={18}>
                                <Path d="M3 17V8l7-5 7 5v9H3Z" stroke={COLORS.green} strokeWidth="1.3" fill="none" />
                                <Rect x="7" y="13" width="3" height="4" fill={COLORS.green} opacity="0.6" />
                            </Svg>
                        </View>
                        <View style={styles.modelInfo}>
                            <Text style={styles.modelName}>Riverside Penthouse</Text>
                            <Text style={styles.modelMeta}>Floor 3 · v2.4 · 3 floors</Text>
                        </View>
                        <View style={styles.modelRight}>
                            <View style={[styles.availBadge, styles.availOk]}><Text style={styles.availTextOk}>Full access</Text></View>
                            <Text style={styles.modelSize}>128 MB</Text>
                        </View>
                    </View>
                    <View style={styles.modelRow}>
                        <View style={[styles.modelIcon, { backgroundColor: '#FEF3CD' }]}>
                            <Svg viewBox="0 0 20 20" width={18} height={18}>
                                <Path d="M3 17V8l7-5 7 5v9H3Z" stroke={COLORS.amber} strokeWidth="1.3" fill="none" />
                                <Rect x="7" y="13" width="3" height="4" fill={COLORS.amber} opacity="0.6" />
                            </Svg>
                        </View>
                        <View style={styles.modelInfo}>
                            <Text style={styles.modelName}>The Arc Studio</Text>
                            <Text style={styles.modelMeta}>v1.9 · Ground floor only</Text>
                        </View>
                        <View style={styles.modelRight}>
                            <View style={[styles.availBadge, styles.availPartial]}><Text style={styles.availTextPartial}>Partial</Text></View>
                            <Text style={styles.modelSize}>54 MB</Text>
                        </View>
                    </View>
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 20 }]}>PENDING SYNC</Text>
                <View style={styles.notesList}>
                    <View style={styles.noteRow}>
                        <View style={styles.noteDot} />
                        <View style={styles.noteInfo}>
                            <Text style={styles.noteText}>Window reveal on north wall is 4cm deeper than model spec. Check with structural.</Text>
                            <Text style={styles.noteMeta}>Master Suite · 3 min ago</Text>
                        </View>
                        <View style={styles.noteTag}><Text style={styles.noteTagText}>Note</Text></View>
                    </View>
                    <View style={styles.noteRow}>
                        <View style={styles.noteDot} />
                        <View style={styles.noteInfo}>
                            <Text style={styles.noteText}>2 photos captured — door and window junction detail.</Text>
                            <Text style={styles.noteMeta}>Living Room · 7 min ago</Text>
                        </View>
                        <View style={styles.noteTag}><Text style={styles.noteTagText}>Photo ×2</Text></View>
                    </View>
                </View>

                <TouchableOpacity style={styles.syncBtn}>
                    <Svg width="16" height="16" viewBox="0 0 16 16">
                        <Path d="M13 8A5 5 0 013 8M3 8l2.5-2.5M3 8l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </Svg>
                    <Text style={styles.syncBtnText}>Sync when connected</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.black, fontSize: 13, fontFamily: 'DMSans_500Medium' },
    offlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(196,120,58,0.12)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(196,120,58,0.3)' },
    badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.amber },
    badgeText: { fontSize: 11, color: COLORS.amber, fontWeight: '700', marginLeft: 6 },
    banner: { margin: 12, backgroundColor: 'rgba(196,120,58,0.08)', borderRadius: 14, padding: 12, flexDirection: 'row', gap: 10, borderWidth: 1, borderColor: 'rgba(196,120,58,0.2)' },
    bannerIcon: { width: 28, height: 28, backgroundColor: 'rgba(196,120,58,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    bannerContent: { flex: 1 },
    bannerText: { fontSize: 12, color: '#2C2A27', lineHeight: 18 },
    bold: { fontWeight: '700', color: COLORS.black },
    syncDue: { fontSize: 10, color: COLORS.amber, marginTop: 2, fontWeight: '600' },
    scrollContent: { paddingBottom: 40 },
    sectionLabel: { paddingHorizontal: 18, fontSize: 10, color: COLORS.gray, letterSpacing: 1, marginBottom: 8 },
    modelList: { paddingHorizontal: 14 },
    modelRow: { backgroundColor: 'white', borderRadius: 14, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: COLORS.border },
    modelIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    modelInfo: { flex: 1 },
    modelName: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    modelMeta: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
    modelRight: { alignItems: 'flex-end' },
    availBadge: { borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 },
    availOk: { backgroundColor: 'rgba(74,124,89,0.1)' },
    availPartial: { backgroundColor: 'rgba(196,120,58,0.1)' },
    availTextOk: { fontSize: 10, color: COLORS.green, fontWeight: '600' },
    availTextPartial: { fontSize: 10, color: COLORS.amber, fontWeight: '600' },
    modelSize: { fontSize: 10, color: COLORS.gray, marginTop: 3 },
    notesList: { paddingHorizontal: 14 },
    noteRow: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 7, flexDirection: 'row', gap: 10, borderWidth: 1, borderColor: COLORS.border },
    noteDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.amber, marginTop: 4 },
    noteInfo: { flex: 1 },
    noteText: { fontSize: 12, color: '#2C2A27', lineHeight: 18 },
    noteMeta: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
    noteTag: { backgroundColor: 'rgba(196,120,58,0.1)', borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7, alignSelf: 'flex-start' },
    noteTagText: { fontSize: 9, color: COLORS.amber, fontWeight: '600' },
    syncBtn: { margin: 16, height: 50, backgroundColor: COLORS.black, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    syncBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
