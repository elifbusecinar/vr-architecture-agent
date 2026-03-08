import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/constants/Theme';
import { Button } from '../../src/components/UI/Button';
import { ScreenTransition } from '../../src/components/ScreenTransition';

export default function UsageEstimatorPage() {
    const router = useRouter();

    const [members, setMembers] = useState(7);
    const [sessions, setSessions] = useState(20);
    const [storage, setStorage] = useState(30);
    const [projects, setProjects] = useState(5);

    const recommendation = useMemo(() => {
        if (members <= 2 && sessions <= 5 && storage <= 5 && projects <= 1) {
            return {
                name: 'Starter Free',
                price: 0,
                breakdown: 'Forever free · No credit card required',
                cta: 'Start for free →'
            };
        } else if (members <= 7 && sessions <= 200 && storage <= 50 && projects <= 20) {
            return {
                name: 'Pro Architect',
                price: 79,
                breakdown: `Base plan $79 · ${members} seats · ${storage} GB storage`,
                cta: 'Start with Pro Architect →'
            };
        } else {
            const extraSeats = Math.max(0, members - 25);
            return {
                name: 'Studio Plan',
                price: 199 + (extraSeats * 9),
                breakdown: `Base plan $199${extraSeats > 0 ? ` + $${extraSeats * 9} seats` : ' · 25 seats included'}`,
                cta: 'Start with Studio →'
            };
        }
    }, [members, sessions, storage, projects]);

    const renderSlider = (label: string, sub: string, value: string | number, current: number, setter: (v: number) => void, max: number) => (
        <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
                <View>
                    <Text style={styles.sliderLabel}>{label}</Text>
                    <Text style={styles.sliderSub}>{sub}</Text>
                </View>
                <Text style={styles.sliderValue}>{value}</Text>
            </View>
            <View style={styles.sliderTrackWrap}>
                <View style={styles.sliderTrackBase} />
                <View style={[styles.sliderTrackFill, { width: `${(current / max) * 100}%` }]} />
                <TouchableOpacity
                    style={[styles.sliderThumb, { left: `${(current / max) * 100}%` }]}
                    activeOpacity={0.8}
                />
            </View>
        </View>
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
                    <Text style={styles.title}>Build your plan</Text>
                    <View style={{ width: 52 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.intro}>Adjust sliders to find the right plan for your studio.</Text>

                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            {renderSlider('Team members', 'seats in workspace', members, members, setMembers, 50)}
                            {renderSlider('VR sessions / month', 'across all projects', sessions, sessions, setSessions, 200)}
                            {renderSlider('Model storage', 'total GB uploaded', `${storage} GB`, storage, setStorage, 500)}
                            {renderSlider('Active projects', 'concurrent projects', projects, projects, setProjects, 30)}
                        </View>

                        <View style={styles.resultArea}>
                            <Text style={styles.resultLabel}>Recommended plan</Text>
                            <View style={styles.planRow}>
                                <Text style={styles.planName}>{recommendation.name.split(' ')[0]} <Text style={styles.planItalic}>{recommendation.name.split(' ')[1]}</Text></Text>
                                <View style={styles.matchBadge}>
                                    <Text style={styles.matchText}>Best match</Text>
                                </View>
                            </View>

                            <View style={styles.priceRow}>
                                <Text style={styles.priceCur}>$</Text>
                                <Text style={styles.priceVal}>{recommendation.price}</Text>
                                <Text style={styles.priceMo}>/ mo</Text>
                            </View>

                            <Text style={styles.breakdown}>{recommendation.breakdown}</Text>

                            <Button
                                title={recommendation.cta}
                                variant="primary"
                                size="lg"
                                style={styles.cta}
                            />

                            <Text style={styles.note}>14-day free trial · No credit card required</Text>
                        </View>
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
    intro: {
        fontSize: 13,
        color: COLORS.gray,
        lineHeight: 18,
        paddingHorizontal: 8,
        marginBottom: 20,
        fontFamily: 'DMSans_400Regular'
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 40,
    },
    cardContent: { padding: 24 },
    sliderSection: { marginBottom: 32 },
    sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    sliderLabel: { fontSize: 14, fontWeight: '600', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    sliderSub: { fontSize: 11, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    sliderValue: { fontSize: 28, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    sliderTrackWrap: { height: 4, position: 'relative', justifyContent: 'center', marginTop: 16 },
    sliderTrackBase: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
    sliderTrackFill: { height: 4, backgroundColor: COLORS.black, borderRadius: 2, position: 'absolute' },
    sliderThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.black,
        position: 'absolute',
        top: -8,
        marginLeft: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    resultArea: { backgroundColor: COLORS.creamDark, padding: 24, borderTopWidth: 1.5, borderTopColor: COLORS.border },
    resultLabel: { fontSize: 10, color: COLORS.gray, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'DMSans_500Medium' },
    planRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    planName: { fontSize: 24, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    planItalic: { fontStyle: 'italic', color: COLORS.gray },
    matchBadge: { backgroundColor: 'rgba(74, 124, 89, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    matchText: { fontSize: 10, color: COLORS.green, fontWeight: '600' },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 },
    priceCur: { fontSize: 20, fontWeight: '500', color: COLORS.black },
    priceVal: { fontSize: 44, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black },
    priceMo: { fontSize: 14, color: COLORS.gray, marginLeft: 4 },
    breakdown: { fontSize: 12, color: COLORS.gray, marginBottom: 20, fontFamily: 'DMSans_400Regular' },
    cta: { width: '100%' },
    note: { fontSize: 10, color: COLORS.grayLight, textAlign: 'center', marginTop: 12, fontFamily: 'DMSans_400Regular' },
});
