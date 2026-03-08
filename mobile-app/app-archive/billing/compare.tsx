import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/constants/Theme';
import { Button } from '../../src/components/UI/Button';
import { ScreenTransition } from '../../src/components/ScreenTransition';

export default function FeatureComparisonPage() {
    const router = useRouter();

    const sections = [
        {
            title: 'Core',
            rows: [
                { label: 'Projects', sub: 'Concurrent active', free: '1', pro: '∞', studio: '∞', featured: true },
                { label: 'Team seats', free: '2', pro: '7', studio: '25', featured: true },
                { label: 'Model storage', free: '5 GB', pro: '50 GB', studio: '250 GB', featured: true },
            ]
        },
        {
            title: 'VR Experience',
            rows: [
                { label: 'VR sessions / mo', free: '5', pro: '∞', studio: '∞' },
                { label: 'Concurrent in VR', sub: 'Per session', free: '2', pro: '8', studio: '20' },
                { label: 'Spatial annotations', free: '✕', pro: '✓', studio: '✓', check: true },
                { label: 'Model streaming', free: '✕', pro: '✓', studio: '✓', check: true },
            ]
        },
        {
            title: 'Analytics & Workflow',
            rows: [
                { label: 'Session replay', sub: 'Heatmaps', free: '✕', pro: '✓', studio: '✓', check: true },
                { label: 'Client approval', free: '✕', pro: '✓', studio: '✓', check: true },
                { label: 'PDF reports', free: '✕', pro: '✕', studio: '✓', check: true },
                { label: 'Custom branding', free: '✕', pro: '✕', studio: '✓', check: true },
            ]
        }
    ];

    const Check = ({ color = COLORS.green }: { color?: string }) => (
        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <Path d="M2 7l3.5 3.5 6.5-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const Cross = () => (
        <Text style={{ color: COLORS.grayLight, fontSize: 13 }}>✕</Text>
    );

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <Text style={styles.backText}>Plans</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Compare features</Text>
                    <View style={{ width: 52 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.table}>
                        <View style={styles.header}>
                            <View style={[styles.cell, styles.labelCell]}><Text style={styles.headerText}>Feature</Text></View>
                            <View style={styles.cell}><Text style={styles.headerText}>Free</Text></View>
                            <View style={[styles.cell, styles.featuredCell]}>
                                <Text style={[styles.headerText, styles.textWhite]}>Pro</Text>
                                <Text style={styles.featuredLabel}>Best</Text>
                            </View>
                            <View style={styles.cell}><Text style={styles.headerText}>Studio</Text></View>
                        </View>

                        {sections.map((section, idx) => (
                            <View key={idx}>
                                <View style={styles.groupHeader}>
                                    <Text style={styles.groupText}>{section.title}</Text>
                                </View>
                                {section.rows.map((row, ridx) => (
                                    <View key={ridx} style={[styles.row, ridx % 2 !== 0 && styles.rowAlt]}>
                                        <View style={[styles.cell, styles.labelCell]}>
                                            <Text style={styles.rowLabel}>{row.label}</Text>
                                            {row.sub && <Text style={styles.rowSub}>{row.sub}</Text>}
                                        </View>
                                        <View style={styles.cell}>
                                            {row.free === '✓' ? <Check /> : row.free === '✕' ? <Cross /> : <Text style={styles.valText}>{row.free}</Text>}
                                        </View>
                                        <View style={[styles.cell, styles.featuredCol]}>
                                            {row.pro === '✓' ? <Check /> : row.pro === '✕' ? <Cross /> : <Text style={[styles.valText, { color: COLORS.blue }]}>{row.pro}</Text>}
                                        </View>
                                        <View style={styles.cell}>
                                            {row.studio === '✓' ? <Check /> : row.studio === '✕' ? <Cross /> : <Text style={[styles.valText, { color: COLORS.blue }]}>{row.studio}</Text>}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Start with Pro — $79/mo →"
                            variant="primary"
                            size="lg"
                            style={{ marginBottom: 12 }}
                        />
                        <Button
                            title="View all plans"
                            variant="secondary"
                            size="md"
                            onPress={() => router.push('/billing/plans' as any)}
                        />
                    </View>
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
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { fontSize: 13, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    title: { fontSize: 15, fontWeight: '500', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    scroll: { padding: 16 },
    table: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: COLORS.border
    },
    header: { flexDirection: 'row', backgroundColor: COLORS.white },
    groupHeader: { backgroundColor: COLORS.creamDark, paddingVertical: 10, paddingHorizontal: 16 },
    groupText: { fontSize: 10, fontWeight: '700', color: COLORS.gray, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DMSans_700Bold' },
    row: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, minHeight: 48 },
    rowAlt: { backgroundColor: '#F9FAF8' },
    cell: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
    labelCell: { flex: 2, alignItems: 'flex-start', paddingLeft: 16 },
    featuredCell: { backgroundColor: COLORS.black },
    featuredCol: { backgroundColor: 'rgba(26, 25, 23, 0.04)' },
    headerText: { fontSize: 11, fontWeight: '600', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    textWhite: { color: COLORS.white },
    featuredLabel: { fontSize: 8, color: 'rgba(255, 255, 255, 0.4)', marginTop: 2, textTransform: 'uppercase' },
    rowLabel: { fontSize: 12, color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    rowSub: { fontSize: 9, color: COLORS.gray, marginTop: 2, fontFamily: 'DMSans_400Regular' },
    valText: { fontSize: 12, fontWeight: '600', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    footer: { marginTop: 24, paddingBottom: 40 },
});
