import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Card } from '../src/components/UI/Card';
import { Badge } from '../src/components/UI/Badge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH > 600;

export default function TabletDashboardPage() {
    const router = useRouter();

    const sidebarItems = [
        { label: 'Overview', icon: 'M3 3h18v18H3z', active: true },
        { label: 'Studio Projects', icon: 'M4 4h7v7H4zM4 13h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7z' },
        { label: 'Client Approvals', icon: 'M5 13l4 4L19 7' },
        { label: 'VR Hub', icon: 'M21 10c0-1.1-.9-2-2-2h-3.17l-1.24-2.48A2 2 0 0 0 12.8 4H11.2a2 2 0 0 0-1.79 1.52L8.17 8H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8z' },
        { label: 'Billing', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    ];

    const projectStats = [
        { label: 'Active Projects', val: '12', delta: '↑ 2' },
        { label: 'Sessions this week', val: '43', delta: '↑ 14%' },
        { label: 'Approvals pending', val: '7', delta: '-' },
        { label: 'Studio members', val: '24', delta: '4 active' },
    ];

    const activities = [
        { time: '12:44', user: 'Sarah J.', action: 'Uploaded new model', project: 'Riverside v4.2' },
        { time: '11:20', user: 'Marcus T.', action: 'Annotated session', project: 'The Arc Studio' },
        { time: '09:15', user: 'System', action: 'Email digest sent', project: 'Weekly Update' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.layout}>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    <View style={styles.sideBrand}>
                        <Text style={styles.brandText}>VR ARCHITECTURE</Text>
                    </View>
                    <View style={styles.sideNav}>
                        {sidebarItems.map((item, i) => (
                            <TouchableOpacity key={i} style={[styles.navItem, item.active && styles.navItemActive]}>
                                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.active ? COLORS.black : COLORS.gray} strokeWidth="2">
                                    <Path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <Text style={[styles.navText, item.active && styles.navTextActive]}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.sideFoot}>
                        <TouchableOpacity style={styles.setBtn}>
                            <Text style={styles.setText}>Studio Settings ▾</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.main}>
                    <View style={styles.mainHeader}>
                        <View>
                            <Text style={styles.mainTitle}>Studio Overview</Text>
                            <Text style={styles.mainSub}>Welcome back, Sarah.</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={styles.searchBar}>
                                <Text style={styles.searchText}>Search projects...</Text>
                            </View>
                            <TouchableOpacity style={styles.plusBtn}>
                                <Text style={styles.plusText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.statsRow}>
                            {projectStats.map((s, i) => (
                                <View key={i} style={styles.statBox}>
                                    <Text style={styles.statLabel}>{s.label}</Text>
                                    <View style={styles.statValRow}>
                                        <Text style={styles.statVal}>{s.val}</Text>
                                        <Text style={styles.statDelta}>{s.delta}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <Card style={styles.chartCard} padding={24}>
                            <View style={styles.chartHeader}>
                                <Text style={styles.chartTitle}>Global Session Usage</Text>
                                <View style={styles.chartLegend}>
                                    <View style={[styles.dot, { backgroundColor: COLORS.green }]} />
                                    <View style={[styles.dot, { backgroundColor: COLORS.blue }]} />
                                </View>
                            </View>
                            <View style={styles.chartPlaceholder}>
                                {[0.4, 0.6, 0.8, 0.5, 0.9, 0.7, 0.4, 0.6, 0.8, 0.5, 0.9, 0.7].map((h, i) => (
                                    <View key={i} style={[styles.bar, { height: `${h * 100}%` }]} />
                                ))}
                            </View>
                        </Card>

                        <Text style={styles.secTitle}>Studio Members</Text>
                        <View style={styles.memberList}>
                            {[1, 2, 3, 4].map((_, i) => (
                                <View key={i} style={styles.memberAvatar}>
                                    <View style={styles.avatarFill} />
                                    {i === 1 && <View style={styles.onlineDot} />}
                                </View>
                            ))}
                            <View style={[styles.memberAvatar, styles.avatarPlus]}>
                                <Text style={styles.avatarPlusText}>+</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Detail Panel / Activity Side */}
                <View style={styles.aside}>
                    <View style={styles.asideHead}>
                        <Text style={styles.asideTitle}>Recent Activity</Text>
                    </View>
                    <View style={styles.activityList}>
                        {activities.map((a, i) => (
                            <View key={i} style={styles.actItem}>
                                <Text style={styles.actTime}>{a.time}</Text>
                                <Text style={styles.actUser}>{a.user}</Text>
                                <Text style={styles.actTask}>{a.action} in <Text style={styles.actProj}>{a.project}</Text></Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.liveSection}>
                        <View style={styles.liveHead}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveTitle}>LIVE IN VR NOW</Text>
                        </View>
                        <View style={styles.liveCard}>
                            <Text style={styles.liveProject}>Riverside Penthouse</Text>
                            <Text style={styles.liveStatus}>3 Users joined · 12m elapsed</Text>
                            <TouchableOpacity style={styles.spectateBtn}>
                                <Text style={styles.spectateText}>Spectate View</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    layout: { flex: 1, flexDirection: 'row' },

    // Sidebar
    sidebar: { width: 240, borderRightWidth: 1, borderRightColor: COLORS.border, padding: 24 },
    sideBrand: { marginBottom: 48 },
    brandText: { fontSize: 10, fontWeight: '800', fontFamily: 'DMSans_700Bold', letterSpacing: 1.5, color: COLORS.black },
    sideNav: { flex: 1, gap: 8 },
    navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10 },
    navItemActive: { backgroundColor: COLORS.cream },
    navText: { fontSize: 13, color: COLORS.gray, fontFamily: 'DMSans_500Medium' },
    navTextActive: { color: COLORS.black, fontWeight: '600' },
    sideFoot: { marginTop: 'auto' },
    setBtn: { padding: 12 },
    setText: { fontSize: 12, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },

    // Main Content
    main: { flex: 4, backgroundColor: COLORS.cream },
    mainHeader: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: COLORS.cream,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    mainTitle: { fontSize: 24, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    mainSub: { fontSize: 13, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    searchBar: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        width: 240
    },
    searchText: { fontSize: 13, color: COLORS.grayLight },
    plusBtn: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusText: { color: COLORS.white, fontSize: 24, fontWeight: '300', marginTop: -2 },
    mainScroll: { padding: 32 },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border
    },
    statLabel: { fontSize: 11, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontFamily: 'DMSans_700Bold' },
    statValRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    statVal: { fontSize: 28, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    statDelta: { fontSize: 12, fontWeight: '600', color: COLORS.green, fontFamily: 'DMSans_500Medium' },
    chartCard: { marginBottom: 32 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    chartTitle: { fontSize: 14, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    chartLegend: { flexDirection: 'row', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    chartPlaceholder: { flexDirection: 'row', height: 160, alignItems: 'flex-end', gap: 6 },
    bar: { flex: 1, backgroundColor: COLORS.black, borderRadius: 4, opacity: 0.1 },
    secTitle: { fontSize: 13, fontWeight: '700', color: COLORS.black, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    memberList: { flexDirection: 'row', gap: -8 },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.border,
        borderWidth: 3,
        borderColor: COLORS.cream,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarFill: { width: '100%', height: '100%', borderRadius: 22, backgroundColor: COLORS.grayLight },
    onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green, position: 'absolute', bottom: -2, right: -2, borderWidth: 2, borderColor: COLORS.cream },
    avatarPlus: { backgroundColor: COLORS.white, borderStyle: 'dashed' },
    avatarPlusText: { fontSize: 18, color: COLORS.gray },

    // Aside
    aside: { width: 300, borderLeftWidth: 1, borderLeftColor: COLORS.border, backgroundColor: COLORS.white, padding: 24 },
    asideHead: { marginBottom: 24 },
    asideTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    activityList: { gap: 24, flex: 1 },
    actItem: { gap: 4 },
    actTime: { fontSize: 10, color: COLORS.grayLight, fontWeight: '600' },
    actUser: { fontSize: 12, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    actTask: { fontSize: 12, color: COLORS.gray, lineHeight: 18 },
    actProj: { color: COLORS.blue, fontWeight: '600' },
    liveSection: { marginTop: 'auto', backgroundColor: '#F9FAF8', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
    liveHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.red },
    liveTitle: { fontSize: 10, fontWeight: '800', color: COLORS.red, letterSpacing: 1 },
    liveCard: {},
    liveProject: { fontSize: 14, fontWeight: '700', color: COLORS.black, marginBottom: 4 },
    liveStatus: { fontSize: 11, color: COLORS.gray, marginBottom: 16 },
    spectateBtn: { height: 40, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.black, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    spectateText: { fontSize: 12, fontWeight: '700', color: COLORS.black },
});
