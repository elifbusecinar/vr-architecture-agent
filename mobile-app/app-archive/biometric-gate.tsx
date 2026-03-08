import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    green: '#4A7C59',
    gray: 'rgba(255,255,255,0.35)',
    border: 'rgba(255,255,255,0.1)',
};

export default function BiometricGatePage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Project Access</Text>
                    <TouchableOpacity><Text style={styles.helpText}>Help</Text></TouchableOpacity>
                </View>

                <View style={styles.viewfinder}>
                    <View style={styles.camBg} />

                    <View style={styles.faceBounds}>
                        {/* Face Oval Mock */}
                        <View style={styles.faceOval}>
                            <View style={styles.scanLine} />
                            {/* Mesh Simulation */}
                            <View style={styles.mesh}>
                                {[...Array(12)].map((_, i) => (
                                    <View key={i} style={[styles.meshDot, { top: `${20 + Math.random() * 60}%`, left: `${20 + Math.random() * 60}%` }]} />
                                ))}
                            </View>
                            <View style={[styles.bracket, styles.tl]} />
                            <View style={[styles.bracket, styles.tr]} />
                            <View style={[styles.bracket, styles.bl]} />
                            <View style={[styles.bracket, styles.br]} />
                        </View>
                    </View>

                    {/* Progress Ring SVG */}
                    <View style={styles.ringWrapper}>
                        <Svg width="212" height="252" viewBox="0 0 212 252">
                            <Rect x="6" y="6" width="200" height="240" rx="100" stroke="rgba(74,124,89,0.2)" strokeWidth="2" fill="none" />
                            <Rect x="6" y="6" width="200" height="240" rx="100"
                                stroke="rgba(74,124,89,0.8)" strokeWidth="2.5"
                                strokeDasharray="720" strokeDashoffset="230"
                                strokeLinecap="round" fill="none" />
                        </Svg>
                    </View>

                    <View style={styles.instruction}>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Scanning... 78%</Text>
                        </View>
                        <Text style={styles.instSub}>Hold still · Looking for face mesh · Good lighting</Text>
                    </View>
                </View>

                <View style={styles.bottomArea}>
                    <View style={styles.projRow}>
                        <View style={styles.projIcon}>
                            <Svg viewBox="0 0 18 18" width={18} height={18}>
                                <Path d="M2 16V8l7-5 7 5v8H2Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />
                                <Rect x="6" y="12" width="3" height="4" fill="rgba(255,255,255,0.25)" />
                            </Svg>
                        </View>
                        <View style={styles.projInfo}>
                            <Text style={styles.projName}>Riverside Penthouse</Text>
                            <Text style={styles.projFloor}>Floor 3 · Confidential files</Text>
                        </View>
                        <View style={styles.accessBadge}><Text style={styles.accessText}>Full access</Text></View>
                    </View>

                    {/* Identified User */}
                    <View style={styles.idCard}>
                        <View style={styles.idAvatar}><Text style={styles.idInit}>A</Text></View>
                        <View style={styles.idInfo}>
                            <Text style={styles.idName}>Arch1</Text>
                            <Text style={styles.idRole}>Lead Architect · Verified</Text>
                        </View>
                        <View style={styles.checkCircle}>
                            <Svg viewBox="0 0 13 13" width={13} height={13}>
                                <Path d="M2 6.5l4 4 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                        </View>
                    </View>

                    <View style={styles.methodsRow}>
                        <TouchableOpacity style={[styles.methodBtn, styles.methodActive]}>
                            <Svg viewBox="0 0 20 20" width={20} height={20}>
                                <Circle cx="10" cy="7" r="3.5" stroke="#7ECB94" strokeWidth="1.3" fill="none" />
                                <Ellipse cx="10" cy="13.5" rx="5.5" ry="3.5" stroke="#7ECB94" strokeWidth="1.3" fill="none" />
                            </Svg>
                            <Text style={styles.methodLabelActive}>Face ID</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.methodBtn}>
                            <Svg viewBox="0 0 20 20" width={20} height={20}>
                                <Path d="M10 2a3 3 0 010 6M10 14c-3.3 0-6 1.3-6 3v1h12v-1c0-1.7-2.7-3-6-3z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" fill="none" />
                            </Svg>
                            <Text style={styles.methodLabel}>PIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.methodBtn}>
                            <Svg viewBox="0 0 20 20" width={20} height={20}>
                                <Rect x="3" y="8" width="14" height="10" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" fill="none" />
                                <Path d="M7 8V6a3 3 0 016 0v2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" fill="none" />
                            </Svg>
                            <Text style={styles.methodLabel}>Passcode</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.gray, fontSize: 13 },
    headerTitle: { fontSize: 13, fontWeight: '600', color: 'white' },
    helpText: { fontSize: 12, color: 'rgba(255,255,255,0.25)' },
    viewfinder: { flex: 1, position: 'relative', overflow: 'hidden' },
    camBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#080706' },
    faceBounds: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -80 }, { translateY: -120 }] },
    faceOval: { width: 160, height: 200, borderRadius: 100, borderWidth: 2, borderColor: 'rgba(74,124,89,0.7)', backgroundColor: 'rgba(255,255,255,0.03)', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    scanLine: { position: 'absolute', width: '100%', height: 2, backgroundColor: 'rgba(74,124,89,0.8)', top: '40%' },
    mesh: { ...StyleSheet.absoluteFillObject },
    meshDot: { position: 'absolute', width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(74,124,89,0.6)' },
    bracket: { position: 'absolute', width: 28, height: 28, borderColor: COLORS.green },
    tl: { top: 0, left: 0, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderRadius: 4 },
    tr: { top: 0, right: 0, borderTopWidth: 2.5, borderRightWidth: 2.5, borderRadius: 4 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderRadius: 4 },
    br: { bottom: 0, right: 0, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderRadius: 4 },
    ringWrapper: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -106 }, { translateY: -126 }] },
    instruction: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 24 },
    statusBadge: { backgroundColor: 'rgba(74,124,89,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(74,124,89,0.4)', flexDirection: 'row', alignItems: 'center', gap: 7 },
    statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.green },
    statusText: { color: '#7ECB94', fontSize: 12, fontWeight: '600' },
    instSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8, textAlign: 'center' },
    bottomArea: { backgroundColor: COLORS.black, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34 },
    projRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    projIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    projInfo: { flex: 1 },
    projName: { color: 'white', fontSize: 14, fontWeight: '600' },
    projFloor: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 },
    accessBadge: { backgroundColor: 'rgba(74,124,89,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(74,124,89,0.3)' },
    accessText: { color: COLORS.green, fontSize: 10, fontWeight: '700' },
    idCard: { backgroundColor: 'rgba(74,124,89,0.1)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(74,124,89,0.3)', flexDirection: 'row', alignItems: 'center', gap: 12 },
    idAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2A2520', borderWidth: 2, borderColor: 'rgba(74,124,89,0.5)', alignItems: 'center', justifyContent: 'center' },
    idInit: { fontFamily: 'PlayfairDisplay_400Regular', color: 'rgba(255,255,255,0.6)', fontSize: 16 },
    idInfo: { flex: 1 },
    idName: { color: 'white', fontSize: 14, fontWeight: '600' },
    idRole: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 1 },
    checkCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
    methodsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    methodBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, alignItems: 'center', gap: 6 },
    methodActive: { backgroundColor: 'rgba(74,124,89,0.1)', borderColor: 'rgba(74,124,89,0.5)' },
    methodLabelActive: { fontSize: 10, color: '#7ECB94', fontWeight: '600' },
    methodLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
});
