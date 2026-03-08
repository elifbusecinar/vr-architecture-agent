import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { Card } from '../src/components/UI/Card';
import { ScreenTransition } from '../src/components/ScreenTransition';

export default function ClientApprovalPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <View style={styles.container}>
                <View style={styles.lockBg}>
                    <SafeAreaView style={styles.glassContent}>
                        <View style={styles.timeArea}>
                            <Text style={styles.timeBig}>9:41</Text>
                            <Text style={styles.dateBig}>Friday, 6 March</Text>
                        </View>

                        <View style={styles.notifCard}>
                            <View style={styles.notifHeader}>
                                <View style={styles.notifIcon}>
                                    <Svg viewBox="0 0 14 14" width={14} height={14}>
                                        <Path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" />
                                    </Svg>
                                </View>
                                <Text style={styles.notifApp}>VR Architecture</Text>
                                <Text style={styles.notifTime}>now</Text>
                            </View>
                            <View style={styles.notifBody}>
                                <Text style={styles.notifTitle}>🎉 Client Approved!</Text>
                                <Text style={styles.notifSub}>Sarah Jensen just approved Riverside Penthouse after the VR walkthrough. Ready for your signature.</Text>

                                <Card variant="dark" style={styles.projectPill}>
                                    <View style={styles.projIcon}>
                                        <Svg viewBox="0 0 16 16" width={16} height={16}>
                                            <Path d="M2 14V6l6-4 6 4v8H2Z" fill="none" stroke="#7ECB94" strokeWidth="1.2" />
                                            <Rect x="5" y="10" width="3" height="4" fill="#7ECB94" opacity="0.7" />
                                        </Svg>
                                    </View>
                                    <View style={styles.projInfo}>
                                        <Text style={styles.projName}>Riverside Penthouse</Text>
                                        <Text style={styles.projClient}>Jensen & Co · Floor 3</Text>
                                    </View>
                                    <View style={styles.projCheck}>
                                        <Svg viewBox="0 0 12 12" width={12} height={12}>
                                            <Path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </Svg>
                                    </View>
                                </Card>
                            </View>
                            <View style={styles.notifActions}>
                                <TouchableOpacity style={styles.notifBtnPri} onPress={() => router.back()}>
                                    <Text style={styles.notifBtnTextPri}>Sign now</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.notifBtnSec} onPress={() => router.back()}>
                                    <Text style={styles.notifBtnTextSec}>Later</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.swipeArea}>
                            <Text style={styles.swipeLabel}>SWIPE TO SIGN</Text>
                            <View style={styles.swipeTrack}>
                                <View style={styles.swipeGlow} />
                                <View style={styles.swipeThumb}>
                                    <Svg viewBox="0 0 20 20" width={20} height={20}>
                                        <Path d="M4 10h12M12 6l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </Svg>
                                </View>
                                <Text style={styles.swipeText}>Swipe to confirm approval →</Text>
                            </View>
                        </View>

                        <View style={styles.bottomArea}>
                            <Button
                                title="Open full approval document"
                                variant="primary-dark"
                                onPress={() => router.back()}
                                icon={
                                    <Svg viewBox="0 0 15 15" width={15} height={15}>
                                        <Path d="M2 10l2-1 6-6-1-1-6 6-1 2zm8-9l2 2" stroke={COLORS.black} strokeWidth="1.3" strokeLinecap="round" fill="none" />
                                    </Svg>
                                }
                            />
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    lockBg: { flex: 1, backgroundColor: COLORS.black },
    glassContent: { flex: 1, paddingHorizontal: 16 },
    timeArea: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
    timeBig: { fontSize: 72, color: COLORS.white, fontFamily: 'PlayfairDisplay_400Regular', letterSpacing: -2 },
    dateBig: { fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 8, fontFamily: 'DMSans_400Regular' },
    notifCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    notifHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
    notifIcon: { width: 28, height: 28, backgroundColor: COLORS.black, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
    notifApp: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', fontFamily: 'DMSans_500Medium' },
    notifTime: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginLeft: 'auto', fontFamily: 'DMSans_400Regular' },
    notifBody: { paddingHorizontal: 14, paddingBottom: 14 },
    notifTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 4, fontFamily: 'DMSans_700Bold' },
    notifSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18, fontFamily: 'DMSans_400Regular' },
    projectPill: { marginTop: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
    projIcon: { width: 36, height: 36, backgroundColor: 'rgba(74,124,89,0.3)', borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(74,124,89,0.5)' },
    projInfo: { flex: 1 },
    projName: { fontSize: 13, fontWeight: '600', color: COLORS.white, fontFamily: 'DMSans_500Medium' },
    projClient: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: 'DMSans_400Regular' },
    projCheck: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center' },
    notifActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    notifBtnPri: { flex: 1, padding: 14, alignItems: 'center', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' },
    notifBtnSec: { flex: 1, padding: 14, alignItems: 'center' },
    notifBtnTextPri: { color: '#7ECB94', fontWeight: '700', fontSize: 14, fontFamily: 'DMSans_700Bold' },
    notifBtnTextSec: { color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'DMSans_400Regular' },
    swipeArea: { marginTop: 24 },
    swipeLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 12, textAlign: 'center', fontFamily: 'DMSans_500Medium' },
    swipeTrack: { height: 56, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 28, padding: 4, flexDirection: 'row', alignItems: 'center', position: 'relative' },
    swipeThumb: { width: 48, height: 48, backgroundColor: COLORS.green, borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.green, shadowOpacity: 0.5, shadowRadius: 10 },
    swipeText: { flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '600', marginRight: 48, fontFamily: 'DMSans_500Medium' },
    swipeGlow: { position: 'absolute', left: 4, top: 4, bottom: 4, width: 60, borderRadius: 28, backgroundColor: 'rgba(74,124,89,0.4)' },
    bottomArea: { marginTop: 30, marginBottom: 20 },
});
