import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Card } from '../src/components/UI/Card';
import { ScreenTransition } from '../src/components/ScreenTransition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsDashboardPage() {
    const router = useRouter();

    const chartData = [
        { label: 'Mon', val: 0.4 },
        { label: 'Tue', val: 0.65 },
        { label: 'Wed', val: 0.8 },
        { label: 'Thu', val: 0.45 },
        { label: 'Fri', val: 1.0 },
        { label: 'Sat', val: 0.3 },
        { label: 'Sun', val: 0.1 },
    ];

    const stats = [
        { label: 'Avg session', val: '38', unit: 'min', delta: '↑ 12% vs last month', deltaColor: COLORS.green },
        { label: 'Client approvals', val: '8', unit: '/10', delta: '80% approval rate', deltaColor: COLORS.green },
        { label: 'Annotations', val: '47', unit: '', delta: '7 pending review', deltaColor: COLORS.amber },
        { label: 'Storage used', val: '34', unit: 'GB', delta: 'of 50 GB · 68%', deltaColor: COLORS.gray },
    ];

    const topProjects = [
        { rank: 1, name: 'Riverside Penthouse', meta: 'Jensen & Co · 12 sessions', time: '14h 20m', members: '4 members' },
        { rank: 2, name: 'The Arc Studio', meta: 'Ross Design · 8 sessions', time: '9h 05m', members: '3 members' },
        { rank: 3, name: 'Meridian Tower', meta: 'Vance Corp · 2 sessions', time: '5h 17m', members: '2 members' },
    ];

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.title}>Studio Analytics</Text>
                    <View style={styles.periodBadge}>
                        <Text style={styles.periodText}>March 2026 ▾</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {/* Big Number Hero */}
                    <View style={styles.hero}>
                        <Text style={styles.heroLabel}>Total VR session time</Text>
                        <View style={styles.heroPriceRow}>
                            <Text style={styles.heroVal}>28</Text>
                            <Text style={styles.heroUnit}>h 42m</Text>
                        </View>
                        <View style={styles.heroDeltaBadge}>
                            <Text style={styles.heroDeltaText}>↑ 34% vs last month</Text>
                        </View>
                    </View>

                    {/* Bar Chart Section */}
                    <Card style={styles.chartCard} padding={20}>
                        <View style={styles.chartHeader}>
                            <View>
                                <Text style={styles.chartTitle}>Sessions this week</Text>
                                <Text style={styles.chartSub}>Daily count</Text>
                            </View>
                        </View>
                        <View style={styles.barChart}>
                            {chartData.map((d, i) => (
                                <View key={i} style={styles.barItem}>
                                    <View style={[styles.barFill, { height: `${d.val * 100}%`, backgroundColor: d.val > 0.6 ? COLORS.green : COLORS.grayLight, opacity: d.val > 0.6 ? d.val : 0.4 }]} />
                                    <Text style={styles.barLabel}>{d.label}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        {stats.map((s, i) => (
                            <View key={i} style={styles.statBox}>
                                <Text style={styles.statLabel}>{s.label}</Text>
                                <View style={styles.statValRow}>
                                    <Text style={styles.statVal}>{s.val}</Text>
                                    <Text style={styles.statUnit}>{s.unit}</Text>
                                </View>
                                <Text style={[styles.statDelta, { color: s.deltaColor }]}>{s.delta}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Client Reactions Section */}
                    <Card style={styles.chartCard} padding={20}>
                        <View style={styles.chartHeader}>
                            <View>
                                <Text style={styles.chartTitle}>Client reactions</Text>
                                <Text style={styles.chartSub}>This month</Text>
                            </View>
                        </View>
                        <View style={styles.sentimentList}>
                            {[
                                { emoji: '❤️', pct: 72, color: COLORS.green },
                                { emoji: '🤔', pct: 18, color: COLORS.amber },
                                { emoji: '✏️', pct: 10, color: COLORS.blue },
                            ].map((s, i) => (
                                <View key={i} style={styles.sentimentRow}>
                                    <Text style={styles.emoji}>{s.emoji}</Text>
                                    <View style={styles.barWrap}>
                                        <View style={[styles.barFillInner, { width: `${s.pct}%`, backgroundColor: s.color }]} />
                                    </View>
                                    <Text style={styles.pctText}>{s.pct}%</Text>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Top Projects Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Top projects by session time</Text>
                        <TouchableOpacity><Text style={styles.sectionLink}>See all</Text></TouchableOpacity>
                    </View>

                    {topProjects.map((p, i) => (
                        <View key={i} style={styles.projectRow}>
                            <View style={styles.rankBox}><Text style={styles.rankText}>{p.rank}</Text></View>
                            <View style={styles.projectInfo}>
                                <Text style={styles.projectName}>{p.name}</Text>
                                <Text style={styles.projectMeta}>{p.meta}</Text>
                            </View>
                            <View style={styles.projectValArea}>
                                <Text style={styles.projectVal}>{p.time}</Text>
                                <Text style={styles.projectMembers}>{p.members}</Text>
                            </View>
                        </View>
                    ))}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: {
        height: SPACING.topBar,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 13, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold', letterSpacing: 0.5 },
    periodBadge: {
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100
    },
    periodText: { fontSize: 11, fontWeight: '500', color: COLORS.gray, fontFamily: 'DMSans_500Medium' },
    scroll: { paddingBottom: 40 },
    hero: { padding: 32, paddingTop: 20 },
    heroLabel: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: 'DMSans_700Bold', marginBottom: 4 },
    heroPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    heroVal: { fontSize: 64, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black, letterSpacing: -1 },
    heroUnit: { fontSize: 28, fontStyle: 'italic', fontFamily: 'PlayfairDisplay_400Regular_Italic', color: COLORS.grayLight },
    heroDeltaBadge: {
        backgroundColor: 'rgba(74, 124, 89, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
        alignSelf: 'flex-start',
        marginTop: 8
    },
    heroDeltaText: { fontSize: 12, color: COLORS.green, fontWeight: '600', fontFamily: 'DMSans_500Medium' },
    chartCard: { marginHorizontal: 16, marginBottom: 12 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    chartTitle: { fontSize: 13, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    chartSub: { fontSize: 10, color: COLORS.gray, marginTop: 2, fontFamily: 'DMSans_400Regular' },
    barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 8 },
    barItem: { flex: 1, alignItems: 'center' },
    barFill: { width: '100%', borderRadius: 4 },
    barLabel: { fontSize: 9, color: COLORS.gray, marginTop: 6, fontFamily: 'DMSans_400Regular' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
    statBox: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        width: (SCREEN_WIDTH - 40) / 2
    },
    statLabel: { fontSize: 11, color: COLORS.gray, marginBottom: 4, fontFamily: 'DMSans_400Regular' },
    statValRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
    statVal: { fontSize: 24, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    statUnit: { fontSize: 14, fontStyle: 'italic', color: COLORS.grayLight, fontFamily: 'PlayfairDisplay_400Regular_Italic' },
    statDelta: { fontSize: 10, fontWeight: '600', marginTop: 4, fontFamily: 'DMSans_500Medium' },
    sentimentList: { gap: 12 },
    sentimentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    emoji: { fontSize: 18, width: 24 },
    barWrap: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
    barFillInner: { height: '100%', borderRadius: 4 },
    pctText: { fontSize: 11, fontWeight: '600', color: COLORS.black, width: 30, textAlign: 'right', fontFamily: 'DMSans_500Medium' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 12
    },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    sectionLink: { fontSize: 11, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    projectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    rankBox: { width: 24, alignItems: 'center' },
    rankText: { fontSize: 12, fontWeight: '800', color: COLORS.grayLight, fontFamily: 'DMSans_700Bold' },
    projectInfo: { flex: 1, marginLeft: 12 },
    projectName: { fontSize: 13, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    projectMeta: { fontSize: 10, color: COLORS.gray, marginTop: 2, fontFamily: 'DMSans_400Regular' },
    projectValArea: { alignItems: 'flex-end' },
    projectVal: { fontSize: 14, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    projectMembers: { fontSize: 10, color: COLORS.gray, marginTop: 2, fontFamily: 'DMSans_400Regular' },
});
