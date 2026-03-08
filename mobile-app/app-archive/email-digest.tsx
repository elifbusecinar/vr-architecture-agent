import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { ScreenTransition } from '../src/components/ScreenTransition';

export default function EmailDigestPreviewPage() {
    const router = useRouter();

    const highlights = [
        { label: 'VR Sessions', val: '12', delta: '+4' },
        { label: 'Time in VR', val: '8h 15m', delta: '+2h' },
        { label: 'Client Approvals', val: '3', delta: '100% rate' },
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.title}>Email Preview</Text>
                    <TouchableOpacity><Text style={styles.sendText}>Send Test</Text></TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.emailWrapper}>
                        {/* Email Header */}
                        <View style={styles.emailHeader}>
                            <Text style={styles.brand}>VR ARCHITECTURE</Text>
                            <Text style={styles.date}>Monday, March 9, 2026</Text>
                        </View>

                        {/* Subject Line */}
                        <View style={styles.subjectBox}>
                            <Text style={styles.subject}>Your Studio's Weekly Digest</Text>
                            <Text style={styles.subText}>Here's how your projects performed last week.</Text>
                        </View>

                        {/* Hero Stats */}
                        <View style={styles.heroRow}>
                            {highlights.map((h, i) => (
                                <View key={i} style={styles.highlight}>
                                    <Text style={styles.hLabel}>{h.label}</Text>
                                    <Text style={styles.hVal}>{h.val}</Text>
                                    <Text style={styles.hDelta}>{h.delta}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        {/* Activity Chart */}
                        <Text style={styles.secTitle}>Daily Engagement</Text>
                        <View style={styles.chartArea}>
                            {[0.2, 0.5, 0.8, 0.4, 0.9, 0.3, 0.1].map((h, i) => (
                                <View key={i} style={styles.barItem}>
                                    <View style={[styles.bar, { height: `${h * 100}%` }]} />
                                    <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.insightBox}>
                            <Text style={styles.insightTitle}>Studio Insights</Text>
                            <View style={styles.insightLine}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.insightText}>Your session time peaked on <Text style={styles.boldText}>Friday</Text> during the Riverside Penthouse review.</Text>
                            </View>
                            <View style={styles.insightLine}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.insightText}>Client response time is <Text style={styles.boldText}>14% faster</Text> than your studio average.</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.ctaBtn}>
                            <Text style={styles.ctaText}>View Full Analytics Dashboard</Text>
                        </TouchableOpacity>

                        <View style={styles.emailFooter}>
                            <Text style={styles.footerText}>You're receiving this because you're a Workspace Admin.</Text>
                            <Text style={styles.footerLink}>Manage notification settings</Text>
                        </View>
                    </View>

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
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { padding: 8 },
    title: { fontSize: 13, fontWeight: '700', color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    sendText: { fontSize: 13, color: COLORS.blue, fontWeight: '600' },
    scroll: { padding: 20 },
    emailWrapper: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden'
    },
    emailHeader: {
        padding: 40,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    brand: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: COLORS.black, fontFamily: 'DMSans_700Bold' },
    date: { fontSize: 12, color: COLORS.grayLight, marginTop: 8, fontFamily: 'DMSans_400Regular' },
    subjectBox: { padding: 40, paddingBottom: 20 },
    subject: { fontSize: 32, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black, textAlign: 'center' },
    subText: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 12, lineHeight: 22 },
    heroRow: { flexDirection: 'row', padding: 20, gap: 12 },
    highlight: {
        flex: 1,
        backgroundColor: '#F9FAF8',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE'
    },
    hLabel: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    hVal: { fontSize: 20, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    hDelta: { fontSize: 10, color: COLORS.green, fontWeight: '600', marginTop: 4 },
    divider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 40, marginVertical: 20 },
    secTitle: { fontSize: 12, fontWeight: '700', color: COLORS.black, textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
    chartArea: { flexDirection: 'row', height: 120, alignItems: 'flex-end', gap: 12, paddingHorizontal: 40, marginBottom: 40 },
    barItem: { flex: 1, alignItems: 'center' },
    bar: { width: '100%', backgroundColor: COLORS.black, borderRadius: 2, opacity: 0.1 },
    barLabel: { fontSize: 10, color: COLORS.grayLight, marginTop: 8, fontWeight: '600' },
    insightBox: { marginHorizontal: 40, backgroundColor: '#F0F4F8', padding: 24, borderRadius: 12 },
    insightTitle: { fontSize: 13, fontWeight: '700', color: COLORS.blue, marginBottom: 12 },
    insightLine: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    bullet: { color: COLORS.blue, fontWeight: '900' },
    insightText: { fontSize: 13, color: COLORS.soft, flex: 1, lineHeight: 20 },
    boldText: { fontWeight: '700', color: COLORS.black },
    ctaBtn: { margin: 40, backgroundColor: COLORS.black, paddingVertical: 18, borderRadius: 8, alignItems: 'center' },
    ctaText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
    emailFooter: { padding: 40, backgroundColor: '#FAFAFA', alignItems: 'center' },
    footerText: { fontSize: 11, color: COLORS.grayLight, textAlign: 'center', lineHeight: 18 },
    footerLink: { fontSize: 11, color: COLORS.gray, textDecorationLine: 'underline', marginTop: 8 },
});
