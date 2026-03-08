import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/constants/Theme';
import { Button } from '../../src/components/UI/Button';
import { Badge } from '../../src/components/UI/Badge';
import { ScreenTransition } from '../../src/components/ScreenTransition';

export default function PlanSelectionPage() {
    const router = useRouter();
    const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

    const plans = [
        {
            name: 'Starter',
            badge: 'Free',
            badgeVariant: 'gray',
            desc: 'For architects exploring VR. Get started without a credit card.',
            price: 0,
            featured: false,
            features: [
                '1 project',
                '2 seats included',
                '5 VR sessions / month',
            ],
            btn: 'Start free →'
        },
        {
            name: 'Pro',
            badge: '★ Pro Architect',
            badgeVariant: 'purple',
            desc: 'For active studios running client walkthroughs every week.',
            price: period === 'annual' ? 63 : 79,
            featured: true,
            features: [
                'Unlimited projects',
                '7 seats included',
                '50 GB storage',
                'Unlimited VR sessions',
                'Session replay & heatmaps',
                'Client approval workflow'
            ],
            btn: 'Get started →'
        },
        {
            name: 'Studio',
            badge: 'Studio',
            badgeVariant: 'amber',
            desc: 'For larger firms managing multiple concurrent projects and teams.',
            price: period === 'annual' ? 159 : 199,
            featured: false,
            features: [
                'Unlimited projects',
                '25 seats included',
                '250 GB storage',
                'Advanced analytics + PDF',
                'Custom branding on Client Portal',
                'Dedicated account manager'
            ],
            btn: 'Get started →'
        }
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <Text style={styles.backText}>Settings</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Subscription</Text>
                    <View style={{ width: 52 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <Text style={styles.heroText}>
                            Pay for what{'\n'}
                            <Text style={styles.heroItalic}>actually use</Text>
                        </Text>
                        <Text style={styles.heroSub}>No hidden fees. Cancel anytime.</Text>

                        <View style={styles.toggleRow}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, period === 'monthly' && styles.toggleActive]}
                                onPress={() => setPeriod('monthly')}
                            >
                                <Text style={[styles.toggleText, period === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, period === 'annual' && styles.toggleActive]}
                                onPress={() => setPeriod('annual')}
                            >
                                <Text style={[styles.toggleText, period === 'annual' && styles.toggleTextActive]}>Annual</Text>
                            </TouchableOpacity>
                            {period === 'annual' && (
                                <View style={styles.saveBadge}>
                                    <Text style={styles.saveText}>Save 20%</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {plans.map((plan, idx) => (
                        <View key={idx} style={[styles.card, plan.featured && styles.cardFeatured]}>
                            <Badge
                                label={plan.badge}
                                variant={plan.badgeVariant as any}
                                dark={plan.featured}
                                style={{ marginBottom: 12 }}
                            />
                            <Text style={[styles.planName, plan.featured && styles.textWhite]}>{plan.name}</Text>
                            <Text style={[styles.planDesc, plan.featured && styles.textMuted]}>{plan.desc}</Text>

                            <View style={styles.priceRow}>
                                <Text style={[styles.currency, plan.featured && styles.textWhite]}>$</Text>
                                <Text style={[styles.amount, plan.featured && styles.textWhite]}>{plan.price}</Text>
                                <Text style={[styles.period, plan.featured && styles.textMuted]}>
                                    {plan.price === 0 ? 'forever free' : `per month, ${period === 'annual' ? 'billed annually' : 'billed monthly'}`}
                                </Text>
                            </View>

                            <View style={[styles.divider, plan.featured && styles.dividerDark]} />

                            {plan.features.map((feat, fidx) => (
                                <View key={fidx} style={styles.featRow}>
                                    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <Path
                                            d="M2 7l3.5 3.5 6.5-7"
                                            stroke={plan.featured ? '#7ECB94' : COLORS.green}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Svg>
                                    <Text style={[styles.featText, plan.featured && styles.textWhite]}>{feat}</Text>
                                </View>
                            ))}

                            <Button
                                title={plan.btn}
                                variant={plan.featured ? 'primary-dark' : 'primary'}
                                size="md"
                                style={{ marginTop: 20 }}
                                onPress={() => { }}
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.compareBtn}
                        onPress={() => router.push('/billing/compare' as any)}
                    >
                        <Text style={styles.compareText}>Compare all features →</Text>
                    </TouchableOpacity>

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
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { fontSize: 13, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    title: { fontSize: 15, fontWeight: '500', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    scroll: { paddingBottom: 60 },
    hero: { padding: 32, alignItems: 'center' },
    heroText: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 32,
        color: COLORS.black,
        textAlign: 'center',
        lineHeight: 38
    },
    heroItalic: { fontStyle: 'italic', color: COLORS.gray },
    heroSub: {
        fontSize: 13,
        color: COLORS.gray,
        marginTop: 8,
        marginBottom: 24,
        fontFamily: 'DMSans_400Regular'
    },
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 4,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center'
    },
    toggleBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
    },
    toggleActive: { backgroundColor: COLORS.black },
    toggleText: { fontSize: 13, fontWeight: '500', color: COLORS.gray, fontFamily: 'DMSans_500Medium' },
    toggleTextActive: { color: COLORS.white },
    saveBadge: {
        position: 'absolute',
        right: -80,
        backgroundColor: 'rgba(74, 124, 89, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(74, 124, 89, 0.2)',
    },
    saveText: { fontSize: 10, color: COLORS.green, fontWeight: '600' },
    card: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardFeatured: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    planName: {
        fontSize: 28,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: COLORS.black,
        marginBottom: 4
    },
    planDesc: { fontSize: 13, color: COLORS.gray, lineHeight: 18, marginBottom: 20 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
    currency: { fontSize: 18, fontWeight: '500', color: COLORS.black },
    amount: { fontSize: 44, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black, lineHeight: 48 },
    period: { fontSize: 12, color: COLORS.gray, marginLeft: 4 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
    dividerDark: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    featRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    featText: { fontSize: 13, color: COLORS.black, flex: 1 },
    textWhite: { color: COLORS.white },
    textMuted: { color: 'rgba(255, 255, 255, 0.45)' },
    compareBtn: { marginTop: 20, alignItems: 'center' },
    compareText: { fontSize: 13, color: COLORS.gray, textDecorationLine: 'underline' },
});
