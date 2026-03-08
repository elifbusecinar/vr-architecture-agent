import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const { width } = Dimensions.get('window');

const COLORS = {
    cream: '#F0EDE8',
    creamDark: '#E8E4DE',
    black: '#1A1917',
    gray: '#8A8783',
    green: '#4A7C59',
    white: '#FFFFFF',
    border: '#D8D4CE',
};

export default function HeadsetPairingPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.topbarTitle}>Connect Headset</Text>
                    <TouchableOpacity style={styles.helpBtn}>
                        <Text style={styles.helpText}>?</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.hero}>
                        <View style={styles.stepTag}>
                            <View style={styles.stepDot} />
                            <Text style={styles.stepTagText}>STEP 5 OF 5</Text>
                        </View>
                        <Text style={styles.title}>Scan with your{"\n"}<Text style={styles.titleItalic}>Meta Quest 3</Text></Text>
                        <Text style={styles.sub}>Open the VR Architecture app on your headset, go to Pair Device and scan this code.</Text>
                    </View>

                    <View style={styles.qrBoxWrap}>
                        <View style={styles.qrBox}>
                            {/* Scan Line Animation - Placeholder style for now */}
                            <View style={styles.scanLine} />

                            {/* Brackets */}
                            <View style={[styles.bracket, styles.tl]} />
                            <View style={[styles.bracket, styles.tr]} />
                            <View style={[styles.bracket, styles.bl]} />
                            <View style={[styles.bracket, styles.br]} />

                            <View style={styles.qrInner}>
                                {/* Simplified QR Pattern using SVGs */}
                                <Svg width="160" height="160" viewBox="0 0 160 160">
                                    {/* TL Corner */}
                                    <Rect x="0" y="0" width="40" height="40" rx="6" fill={COLORS.black} />
                                    <Rect x="8" y="8" width="24" height="24" rx="3" fill="white" />
                                    <Rect x="14" y="14" width="12" height="12" rx="2" fill={COLORS.black} />

                                    {/* TR Corner */}
                                    <Rect x="120" y="0" width="40" height="40" rx="6" fill={COLORS.black} />
                                    <Rect x="128" y="8" width="24" height="24" rx="3" fill="white" />
                                    <Rect x="134" y="14" width="12" height="12" rx="2" fill={COLORS.black} />

                                    {/* BL Corner */}
                                    <Rect x="0" y="120" width="40" height="40" rx="6" fill={COLORS.black} />
                                    <Rect x="8" y="128" width="24" height="24" rx="3" fill="white" />
                                    <Rect x="14" y="134" width="12" height="12" rx="2" fill={COLORS.black} />

                                    {/* Dots */}
                                    <Rect x="60" y="20" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="80" y="40" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="100" y="20" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="60" y="60" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="40" y="80" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="80" y="80" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="120" y="80" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="60" y="100" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="100" y="100" width="10" height="10" rx="2" fill={COLORS.black} />
                                    <Rect x="80" y="120" width="10" height="10" rx="2" fill={COLORS.black} />
                                </Svg>
                            </View>
                        </View>
                        <View style={styles.expireRow}>
                            <View style={styles.pulseDot} />
                            <Text style={styles.expireText}>Code valid · expires in 4:32</Text>
                        </View>
                    </View>

                    <View style={styles.stepsCard}>
                        <View style={styles.stepRow}>
                            <View style={[styles.stepNum, styles.stepNumDone]}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                            <View style={styles.stepInfo}>
                                <Text style={styles.stepInfoTitle}>Put on your Meta Quest 3</Text>
                                <Text style={styles.stepInfoSub}>Headset powered on & nearby</Text>
                            </View>
                        </View>
                        <View style={styles.stepRow}>
                            <View style={[styles.stepNum, styles.stepNumDone]}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                            <View style={styles.stepInfo}>
                                <Text style={styles.stepInfoTitle}>Open VR Architecture app</Text>
                                <Text style={styles.stepInfoSub}>Available in Meta Quest Store</Text>
                            </View>
                        </View>
                        <View style={styles.stepRow}>
                            <View style={[styles.stepNum, { backgroundColor: COLORS.black }]}>
                                <Text style={[styles.checkText, { color: 'white' }]}>3</Text>
                            </View>
                            <View style={styles.stepInfo}>
                                <Text style={styles.stepInfoTitle}>Tap "Pair Device" and scan</Text>
                                <Text style={styles.stepInfoSub}>Point at this QR code</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottom}>
                        <TouchableOpacity style={styles.refreshBtn}>
                            <Svg width="14" height="14" viewBox="0 0 15 15">
                                <Path d="M13 7.5A5.5 5.5 0 012 7.5M2 7.5L4.5 5M2 7.5L4.5 10" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                            <Text style={styles.refreshBtnText}>Regenerate QR code</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { fontSize: 13, color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    topbarTitle: { fontSize: 13, fontFamily: 'DMSans_500Medium', color: COLORS.black },
    helpBtn: {
        width: 28, height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpText: { fontSize: 12, color: COLORS.gray },
    scrollContent: { paddingBottom: 40 },
    hero: { padding: 28, paddingBottom: 0 },
    stepTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.black,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    stepDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.green },
    stepTagText: { fontSize: 9, color: 'white', fontFamily: 'DMSans_700Bold' },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 32,
        lineHeight: 36,
        color: COLORS.black,
    },
    titleItalic: { fontFamily: 'PlayfairDisplay_400Regular_Italic' },
    sub: { fontSize: 13, color: COLORS.gray, lineHeight: 20, marginTop: 10, fontFamily: 'DMSans_400Regular' },

    qrBoxWrap: { marginTop: 24, alignSelf: 'center', width: 220 },
    qrBox: {
        width: 220, height: 220,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 5,
    },
    qrInner: { width: 160, height: 160 },
    scanLine: {
        position: 'absolute',
        top: 20, left: 12, right: 12,
        height: 2,
        backgroundColor: COLORS.green,
        borderRadius: 1,
        opacity: 0.5,
    },
    bracket: { position: 'absolute', width: 22, height: 22, borderColor: COLORS.black },
    tl: { top: -8, left: -8, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 6 },
    tr: { top: -8, right: -8, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 6 },
    bl: { bottom: -8, left: -8, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 6 },
    br: { bottom: -8, right: -8, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 6 },

    expireRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16,
    },
    pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
    expireText: { fontSize: 11, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },

    stepsCard: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    stepNum: {
        width: 26, height: 26,
        borderRadius: 13,
        backgroundColor: COLORS.creamDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumDone: { backgroundColor: COLORS.black },
    checkText: { fontSize: 11, fontWeight: '700', color: 'white' },
    stepInfo: { marginLeft: 14, flex: 1 },
    stepInfoTitle: { fontSize: 13, color: COLORS.black, fontFamily: 'DMSans_500Medium' },
    stepInfoSub: { fontSize: 11, color: COLORS.gray, fontFamily: 'DMSans_400Regular', marginTop: 1 },

    bottom: { padding: 20, marginTop: 10 },
    refreshBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 14,
        padding: 13,
    },
    refreshBtnText: { fontSize: 13, fontFamily: 'DMSans_500Medium', color: COLORS.black },
});
