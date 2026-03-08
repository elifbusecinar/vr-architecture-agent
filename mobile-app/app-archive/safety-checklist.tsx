import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    border: '#D8D4CE',
    white: '#FFFFFF',
    amber: '#C4783A',
};

export default function SafetyChecklist() {
    const router = useRouter();

    const [checks, setChecks] = useState([
        { id: '1', title: 'Clear 2×2m play area', sub: 'Move furniture and obstacles from your space', status: 'done' },
        { id: '2', title: 'Put on headset', sub: 'Meta Quest 3 powered on and fitted', status: 'done' },
        { id: '3', title: 'Controllers paired', sub: 'Both left and right controllers connected', status: 'done' },
        { id: '4', title: 'Headset battery', sub: '⚠️ Battery at 28% — recommend charging first', status: 'warning' },
        { id: '5', title: 'Confirm room boundaries', sub: 'Draw your Guardian boundary in the headset', status: 'pending' },
    ]);

    const completed = checks.filter(c => c.status === 'done').length;
    const isReady = completed === checks.length;

    return (
        <ScreenTransition type="slide">
            <View style={styles.container}>
                <SafeAreaView style={styles.header}>
                    <View style={styles.topbar}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Svg width="16" height="16" viewBox="0 0 16 16"><Path d="M10 3L5 8l5 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                            <Text style={styles.backText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Before you start</Text>
                        <TouchableOpacity><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
                    </View>

                    <View style={styles.hero}>
                        <View style={styles.eyebrow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrowText}>Pre-flight check</Text></View>
                        <Text style={styles.title}>Ready for <Text style={styles.titleItalic}>VR?</Text></Text>
                        <Text style={styles.sub}>Let's make sure your space and device are set up for a safe session.</Text>
                    </View>

                    <View style={styles.progress}>
                        <View style={styles.progressLabel}><Text style={styles.progText}>{completed} of {checks.length} complete</Text><Text style={styles.progText}>{Math.round((completed / checks.length) * 100)}%</Text></View>
                        <View style={styles.track}><View style={[styles.fill, { width: `${(completed / checks.length) * 100}%` }]} /></View>
                    </View>
                </SafeAreaView>

                <ScrollView style={styles.checks} contentContainerStyle={styles.checksScroll}>
                    {checks.map(check => (
                        <View key={check.id} style={styles.check}>
                            <View style={[styles.box, check.status === 'done' ? styles.boxDone : check.status === 'warning' ? styles.boxWarn : styles.boxPending]}>
                                {check.status === 'done' && <Svg viewBox="0 0 13 13" width={13} height={13}><Path d="M2 6.5l4 4 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>}
                                {check.status === 'warning' && <Svg viewBox="0 0 13 13" width={13} height={13}><Path d="M6.5 3v4M6.5 9v.5" stroke={COLORS.amber} strokeWidth="1.6" strokeLinecap="round" fill="none" /></Svg>}
                            </View>
                            <View style={styles.checkInfo}>
                                <Text style={[styles.checkTitle, check.status === 'done' && styles.checkTitleDone]}>{check.title}</Text>
                                <Text style={[styles.checkSub, check.status === 'warning' && { color: 'rgba(196,120,58,0.7)' }]}>{check.sub}</Text>
                            </View>
                            <View style={styles.expand}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M5 3l4 4-4 4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round" fill="none" /></Svg></View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.startBtn, isReady ? styles.startReady : styles.startNotReady]}>
                        {isReady && <Svg width="17" height="17" viewBox="0 0 17 17" fill="white"><Path d="M5 3l8 5.5L5 14V3z" /></Svg>}
                        <Text style={[styles.startBtnText, isReady ? { color: 'white' } : { color: 'rgba(255,255,255,0.3)' }]}>{isReady ? 'Start Session' : 'Complete all checks to start'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.note}>You can dismiss the battery warning to continue</Text>
                </View>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    header: { paddingBottom: 16 },
    topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
    headerTitle: { fontSize: 13, fontWeight: '500', color: 'white' },
    skipText: { fontSize: 12, color: 'rgba(255,255,255,0.25)' },
    hero: { paddingHorizontal: 20, paddingTop: 16 },
    eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    eyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
    eyebrowText: { fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase' },
    title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 28, color: 'white' },
    titleItalic: { fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' },
    sub: { fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 20, marginTop: 4 },
    progress: { paddingHorizontal: 20, marginTop: 16 },
    progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
    track: { height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
    fill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 2 },
    checks: { flex: 1, paddingHorizontal: 16 },
    checksScroll: { paddingBottom: 20 },
    check: { flexDirection: 'row', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
    box: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
    boxDone: { backgroundColor: COLORS.green },
    boxWarn: { backgroundColor: 'rgba(196,120,58,0.2)', borderWidth: 1.5, borderColor: 'rgba(196,120,58,0.4)' },
    boxPending: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
    checkInfo: { flex: 1 },
    checkTitle: { fontSize: 14, fontWeight: '500', color: 'white' },
    checkTitleDone: { color: 'rgba(255,255,255,0.5)', textDecorationLine: 'line-through' },
    checkSub: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3, lineHeight: 17 },
    expand: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
    footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
    startBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
    startReady: { backgroundColor: COLORS.green },
    startNotReady: { backgroundColor: 'rgba(255,255,255,0.06)' },
    startBtnText: { fontSize: 14, fontWeight: '600' },
    note: { fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 10 },
});
