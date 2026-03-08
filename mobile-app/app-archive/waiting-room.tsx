import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    green: '#4A7C59',
    amber: '#C4783A',
    gray: 'rgba(255,255,255,0.45)',
    border: 'rgba(255,255,255,0.1)',
};

export default function WaitingRoomPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Leave</Text>
                    </TouchableOpacity>
                    <Text style={styles.sessionId}>SESSION #VRA-4821</Text>
                    <View style={{ width: 60 }} />
                </View>

                <View style={styles.center}>
                    <View style={styles.rippleContainer}>
                        {/* Ripple animation mocks */}
                        <View style={[styles.ripple, { width: 170, height: 170, opacity: 0.1 }]} />
                        <View style={[styles.ripple, { width: 140, height: 140, opacity: 0.15 }]} />
                        <View style={[styles.ripple, { width: 110, height: 110, opacity: 0.2 }]} />
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>SJ</Text>
                        </View>
                    </View>

                    <View style={styles.greeting}>
                        <Text style={styles.hello}>Welcome back,</Text>
                        <Text style={styles.name}>Sarah <Text style={styles.nameItalic}>Jensen</Text></Text>
                        <Text style={styles.sub}>Arch1 is preparing your{"\n"}VR walkthrough. Just a moment...</Text>
                    </View>

                    <View style={styles.statusCard}>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusIcon, { backgroundColor: 'rgba(74,124,89,0.2)' }]}>
                                <Svg viewBox="0 0 14 14" width={14} height={14}>
                                    <Path d="M2 7l7-5 7 5v7H2V7Z" stroke="#7ECB94" strokeWidth="1.1" fill="none" />
                                </Svg>
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>Loading model</Text>
                                <Text style={styles.statusSub}>Riverside Penthouse v2.4</Text>
                            </View>
                            <Svg width="16" height="16" viewBox="0 0 16 16">
                                <Path d="M3 8l4 4 6-7" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                        </View>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusIcon, { backgroundColor: 'rgba(196,120,58,0.2)' }]}>
                                <Svg viewBox="0 0 14 14" width={14} height={14}>
                                    <Circle cx="7" cy="7" r="5.5" stroke={COLORS.amber} strokeWidth="1.1" fill="none" />
                                    <Path d="M7 4v3.5l2 2" stroke={COLORS.amber} strokeWidth="1.1" strokeLinecap="round" fill="none" />
                                </Svg>
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>Setting up your room</Text>
                                <Text style={styles.statusSub}>Placing you at entrance...</Text>
                            </View>
                            <ActivityIndicator size="small" color={COLORS.amber} />
                        </View>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusIcon, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                                <Circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.1" fill="none" />
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={[styles.statusTitle, { color: 'rgba(255,255,255,0.3)' }]}>Arch1 joining session</Text>
                                <Text style={styles.statusSub}>Waiting for host...</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.projectCard}>
                        <View style={styles.projThumb}>
                            <Svg viewBox="0 0 20 20" width={18} height={18}>
                                <Path d="M2 18V9l8-6 8 6v9H2Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />
                            </Svg>
                        </View>
                        <View style={styles.projInfo}>
                            <Text style={styles.projName}>Riverside Penthouse</Text>
                            <Text style={styles.projMeta}>3 floors · 47 models loaded</Text>
                        </View>
                        <View style={styles.projTag}><Text style={styles.projTagText}>Full access</Text></View>
                    </View>
                </View>

                <TouchableOpacity style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Leave waiting room</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.gray, fontSize: 13 },
    sessionId: { fontSize: 11, color: 'rgba(255,255,255,0.25)' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    rippleContainer: { width: 170, height: 170, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    ripple: { position: 'absolute', borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2A2520', borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    avatarText: { fontSize: 24, fontFamily: 'PlayfairDisplay_400Regular', color: 'rgba(255,255,255,0.7)' },
    greeting: { alignItems: 'center', marginBottom: 20 },
    hello: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 4 },
    name: { fontSize: 26, color: 'white', fontFamily: 'PlayfairDisplay_400Regular' },
    nameItalic: { fontFamily: 'PlayfairDisplay_400Regular_Italic', color: 'rgba(255,255,255,0.5)' },
    sub: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 20, marginTop: 8 },
    statusCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
    statusRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)', gap: 12 },
    statusIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    statusInfo: { flex: 1 },
    statusTitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
    statusSub: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
    projectCard: { width: '100%', marginTop: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
    projThumb: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    projInfo: { flex: 1 },
    projName: { fontSize: 14, fontWeight: '600', color: 'white' },
    projMeta: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
    projTag: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, paddingVertical: 2, paddingHorizontal: 8, marginLeft: 'auto' },
    projTagText: { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
    cancelBtn: { marginHorizontal: 20, marginBottom: 30, height: 48, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
});
