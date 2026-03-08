import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/constants/Theme';
import { Button } from '../../src/components/UI/Button';
import { ScreenTransition } from '../../src/components/ScreenTransition';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
    {
        q: "Can I try VR Architecture before paying?",
        a: "Yes — the Starter plan is completely free, forever. You get 1 project, 2 seats, and 5 VR sessions per month with no credit card required."
    },
    {
        q: "What happens if I exceed my storage limit?",
        a: "You'll get a warning at 80% capacity. New model uploads pause at the limit, but existing models remain accessible. Upgrade or purchase extra storage at $0.02/GB/month."
    },
    {
        q: "Do clients need a VR Architecture account?",
        a: "No. Clients receive a secure link to the Client Portal where they can review, comment, and approve. They don't need to create an account or install anything."
    },
    {
        q: "Can I add extra seats beyond my plan limit?",
        a: "Yes. Additional seats are available at $12/seat/month on Pro and $9/seat/month on Studio. You can also upgrade to a higher plan at any time."
    },
    {
        q: "Is my model data secure on Azure?",
        a: "Models are stored on Azure Blob Storage with AES-256 encryption at rest and TLS in transit. Each project is isolated in its own container. GDPR compliant."
    }
];

export default function FAQEnterprisePage() {
    const router = useRouter();
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    const toggleFaq = (idx: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenIdx(openIdx === idx ? null : idx);
    };

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
                    <Text style={styles.title}>Common questions</Text>
                    <View style={{ width: 52 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.hero}>Common <Text style={styles.heroItalic}>questions</Text></Text>

                    <View style={styles.faqList}>
                        {faqs.map((faq, idx) => (
                            <View key={idx} style={[styles.faqItem, idx === faqs.length - 1 && styles.lastFaq]}>
                                <TouchableOpacity
                                    style={styles.faqHeader}
                                    onPress={() => toggleFaq(idx)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.faqQ}>{faq.q}</Text>
                                    <View style={[styles.faqIcon, openIdx === idx && styles.faqIconOpen]}>
                                        <Svg width="10" height="10" viewBox="0 0 10 10">
                                            <Path
                                                d="M2 5h6M5 2v6"
                                                stroke={openIdx === idx ? COLORS.white : COLORS.black}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                transform={openIdx === idx ? 'rotate(45 5 5)' : undefined}
                                            />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                                {openIdx === idx && (
                                    <Text style={styles.faqA}>{faq.a}</Text>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.entCard}>
                        <Text style={styles.entLabel}>Enterprise</Text>
                        <Text style={styles.entTitle}>Need something{'\n'}more <Text style={styles.entItalic}>bespoke?</Text></Text>
                        <Text style={styles.entDesc}>Custom contracts, SLA guarantees, dedicated infrastructure, SSO/SAML, and white-label options for large practices.</Text>

                        <View style={styles.entFeatures}>
                            {['Custom seat limits', 'Azure tenant', 'SSO / SAML', 'White-label', '99.9% SLA'].map((f, i) => (
                                <View key={i} style={styles.featBadge}><Text style={styles.featText}>{f}</Text></View>
                            ))}
                        </View>

                        <Button
                            title="Talk to sales →"
                            variant="primary-dark"
                            size="lg"
                            style={{ width: '100%', marginBottom: 12 }}
                        />
                        <Button
                            title="View case studies"
                            variant="ghost-dark"
                            size="md"
                            onPress={() => { }}
                        />
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
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { fontSize: 13, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    title: { fontSize: 15, fontWeight: '500', color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    scroll: { padding: 16 },
    hero: {
        fontSize: 28,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: COLORS.black,
        marginTop: 16,
        marginBottom: 24,
        paddingLeft: 8
    },
    heroItalic: { fontStyle: 'italic', color: COLORS.gray },
    faqList: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        overflow: 'hidden',
        marginBottom: 24
    },
    faqItem: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
    lastFaq: { borderBottomWidth: 0 },
    faqHeader: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    faqQ: { fontSize: 14, fontWeight: '600', color: COLORS.black, flex: 1, paddingRight: 16, fontFamily: 'DMSans_500Medium' },
    faqIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center'
    },
    faqIconOpen: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    faqA: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        fontSize: 13,
        color: COLORS.gray,
        lineHeight: 20,
        fontFamily: 'DMSans_400Regular'
    },
    entCard: {
        backgroundColor: COLORS.black,
        padding: 32,
        borderRadius: 24
    },
    entLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
        fontFamily: 'DMSans_700Bold'
    },
    entTitle: {
        fontSize: 28,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: COLORS.white,
        lineHeight: 34,
        letterSpacing: -0.5
    },
    entItalic: { fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.4)' },
    entDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.45)',
        marginTop: 16,
        lineHeight: 20,
        marginBottom: 24,
        fontFamily: 'DMSans_400Regular'
    },
    entFeatures: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 },
    featBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100
    },
    featText: { fontSize: 10, color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' },
});
