import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    cream: '#F0EDE8',
    border: '#D8D4CE',
    white: '#FFFFFF',
    blue: '#3A6FA0',
};

export default function ARPermission() {
    const router = useRouter();

    const reasons = [
        { id: '1', title: 'Overlay 3D models', sub: 'See your architectural design placed in the real space at true scale', bg: 'rgba(74,124,89,0.2)', color: '#7ECB94', icon: (c: string) => <Svg viewBox="0 0 13 13" width={13} height={13} fill="none"><Path d="M6.5 1L12 4v5l-5.5 3L1 9V4l5.5-3Z" stroke={c} strokeWidth="1.1" /></Svg> },
        { id: '2', title: 'Pin annotations in space', sub: 'Tap surfaces in AR to attach notes, measurements, and issues', bg: 'rgba(58,111,160,0.2)', color: '#7BAFE0', icon: (c: string) => <Svg viewBox="0 0 13 13" width={13} height={13} fill="none"><Path d="M2 10l2-1 6-6-1-1-6 6-1 2z" stroke={c} strokeWidth="1.1" strokeLinecap="round" /></Svg> },
        { id: '3', title: 'Never recorded or stored', sub: 'Camera is used in real-time only. Nothing is saved to our servers.', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', icon: (c: string) => <Svg viewBox="0 0 13 13" width={13} height={13} fill="none"><Circle cx="6.5" cy="6.5" r="5.5" stroke={c} strokeWidth="1.1" /><Path d="M6.5 4v3l2.5 2" stroke={c} strokeWidth="1.1" strokeLinecap="round" /></Svg> },
    ];

    return (
        <ScreenTransition type="fade">
            <View style={styles.container}>
                <SafeAreaView style={styles.top}>
                    <TouchableOpacity onPress={() => router.back()}><Text style={styles.skip}>Not now</Text></TouchableOpacity>
                </SafeAreaView>

                <View style={styles.visual}>
                    <View style={styles.scene}>
                        <View style={styles.float1}><Svg viewBox="0 0 20 20" width={20} height={20} fill="none"><Path d="M3 17V8l7-5 7 5v9H3z" stroke="#7ECB94" strokeWidth="1.2" /><Rect x="7" y="12" width="3" height="5" fill="#7ECB94" opacity="0.6" /></Svg></View>
                        <View style={styles.float2}><Svg viewBox="0 0 12 12" width={12} height={12} fill="none"><Path d="M6 1L11 3.5V8.5L6 11L1 8.5V3.5L6 1Z" stroke="#7BAFE0" strokeWidth="1" /></Svg><Text style={styles.floatText}>Model overlay</Text></View>
                        <View style={styles.float3}><Svg viewBox="0 0 16 16" width={16} height={16} fill="none"><Circle cx="8" cy="8" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" /><Path d="M8 5v3.5l2.5 2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" /></Svg></View>

                        <View style={styles.phoneMock}>
                            <View style={styles.lens} />
                            <View style={styles.phoneScreen}>
                                <Svg width="80" height="130" viewBox="0 0 80 130" fill="none">
                                    <Rect x="5" y="30" width="70" height="80" stroke="rgba(74,124,89,0.6)" strokeWidth="1" strokeDasharray="4 3" />
                                    <Line x1="5" y1="30" x2="40" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    <Line x1="75" y1="30" x2="40" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    <Line x1="5" y1="110" x2="40" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    <Line x1="75" y1="110" x2="40" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    <Circle cx="52" cy="55" r="7" fill="rgba(74,124,89,0.6)" stroke="rgba(74,124,89,0.9)" strokeWidth="1" />
                                    <SvgText x="52" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="600">A</SvgText>
                                    <Circle cx="40" cy="70" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                    <Circle cx="40" cy="70" r="2" fill="rgba(255,255,255,0.5)" />
                                    <Line x1="40" y1="56" x2="40" y2="61" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                    <Line x1="40" y1="79" x2="40" y2="84" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                    <Line x1="26" y1="70" x2="31" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                    <Line x1="49" y1="70" x2="54" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                </Svg>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Why we need{"\n"}<Text style={styles.titleItalic}>your camera</Text></Text>
                    <Text style={styles.sub}>VR Architecture uses your camera to overlay 3D models onto real spaces — so you can compare design with reality.</Text>

                    <View style={styles.reasons}>
                        {reasons.map(r => (
                            <View key={r.id} style={styles.reason}>
                                <View style={[styles.reasonIcon, { backgroundColor: r.bg }]}>{r.icon(r.color)}</View>
                                <View style={styles.reasonInfo}>
                                    <Text style={styles.reasonTitle}>{r.title}</Text>
                                    <Text style={styles.reasonSub}>{r.sub}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.allowBtn}>
                        <Svg viewBox="0 0 15 15" width={15} height={15} fill="none"><Path d="M3 8.5l4.5 4.5 6.5-8" stroke={COLORS.black} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></Svg>
                        <Text style={styles.allowText}>Allow camera access</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()}><Text style={styles.denyText}>Deny — skip AR features</Text></TouchableOpacity>
                </View>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    top: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
    skip: { fontSize: 13, color: 'rgba(255,255,255,0.35)' },
    visual: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    scene: { width: 280, height: 280, position: 'relative', alignItems: 'center', justifyContent: 'center' },
    phoneMock: { width: 120, height: 200, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
    phoneScreen: { width: 100, height: 180, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    lens: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', position: 'absolute', top: 8 },
    float1: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(74,124,89,0.2)', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: 'rgba(74,124,89,0.4)', zIndex: 3 },
    float2: { position: 'absolute', bottom: 30, left: 16, backgroundColor: 'rgba(58,111,160,0.2)', borderRadius: 10, padding: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(58,111,160,0.4)', flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 3 },
    floatText: { fontSize: 10, color: '#7BAFE0' },
    float3: { position: 'absolute', top: 50, left: 8, width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
    content: { paddingHorizontal: 28, paddingBottom: 32 },
    title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: 'white', textAlign: 'center', lineHeight: 32 },
    titleItalic: { fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' },
    sub: { fontSize: 13.5, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 22, marginTop: 10, marginBottom: 24 },
    reasons: { marginBottom: 20 },
    reason: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
    reasonIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    reasonInfo: { flex: 1 },
    reasonTitle: { fontSize: 13, fontWeight: '500', color: 'white' },
    reasonSub: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, lineHeight: 16 },
    allowBtn: { backgroundColor: 'white', borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
    allowText: { color: COLORS.black, fontSize: 14, fontWeight: '500' },
    denyText: { color: 'rgba(255,255,255,0.25)', fontSize: 12, textAlign: 'center' },
});
