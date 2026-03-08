import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    red: '#D95555',
    amber: '#C4783A',
    blue: '#3A6FA0',
    gray: '#8A8783',
};

export default function ShakeReportPage() {
    const router = useRouter();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.projectTitle}>Riverside Penthouse</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.shakeZone}>
                        <View style={styles.rippleOuter}>
                            <View style={styles.rippleInner}>
                                <View style={styles.shakeIcon}>
                                    <Svg viewBox="0 0 34 34" width={34} height={34}>
                                        <Rect x="8" y="4" width="18" height="26" rx="3" fill="none" stroke="#F08080" strokeWidth="1.8" />
                                        <Circle cx="17" cy="27" r="1.5" fill="#F08080" opacity="0.6" />
                                        <Line x1="2" y1="10" x2="5" y2="12" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                                        <Line x1="2" y1="17" x2="5" y2="17" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                        <Line x1="2" y1="24" x2="5" y2="22" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                                        <Line x1="32" y1="10" x2="29" y2="12" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                                        <Line x1="32" y1="17" x2="29" y2="17" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                        <Line x1="32" y1="24" x2="29" y2="22" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                                    </Svg>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.shakeTitle}>Shake to{"\n"}<Text style={styles.titleItalic}>report an issue</Text></Text>
                        <Text style={styles.shakeSub}>Anywhere in the app — shake your phone to instantly flag a problem at your current location.</Text>
                    </View>

                    <View style={styles.formCard}>
                        <Text style={styles.formLabel}>ISSUE TYPE</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                            <View style={[styles.cat, styles.catActive]}><Text style={styles.catTextActive}>🔴 Safety hazard</Text></View>
                            <View style={[styles.cat, styles.catAmber]}><Text style={styles.catTextAmber}>⚠️ Spec mismatch</Text></View>
                            <View style={[styles.cat, styles.catBlue]}><Text style={styles.catTextBlue}>📐 Measurement</Text></View>
                            <View style={[styles.cat, styles.catGray]}><Text style={styles.catTextGray}>💬 General note</Text></View>
                        </ScrollView>

                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="Describe the issue... (optional)"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value="North wall window reveal is 4cm deeper than model specification. Needs structural review before next VR session."
                        />

                        <View style={styles.formFooter}>
                            <TouchableOpacity style={styles.attachBtn}>
                                <Svg viewBox="0 0 15 15" width={15} height={15}>
                                    <Path d="M12 7.5l-6 6a3.5 3.5 0 01-5-5l7-7A2 2 0 0111 4.5l-7 7a.5.5 0 01-.7-.7l6-6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                </Svg>
                            </TouchableOpacity>
                            <View style={styles.locTag}>
                                <Svg viewBox="0 0 12 12" width={12} height={12}>
                                    <Path d="M6 1a3.5 3.5 0 010 7C4.3 8 2 6 2 4a4 4 0 018 0c0 2-2.3 4-4 4zm0 0v3" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" fill="none" />
                                </Svg>
                                <Text style={styles.locText}>Master Suite · Floor 3</Text>
                            </View>
                            <TouchableOpacity style={styles.inlineSend}>
                                <Svg viewBox="0 0 12 12" width={12} height={12}>
                                    <Path d="M1 6l10-5-4.5 11L5 7.5 1 6z" fill="white" />
                                </Svg>
                                <Text style={styles.inlineSendText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.sevCard}>
                        <Text style={styles.formLabel}>SEVERITY</Text>
                        <View style={styles.sevRow}>
                            <TouchableOpacity style={[styles.sevBtn, styles.sevLow]}><Text style={styles.sevTextLow}>Low</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.sevBtn, styles.sevMed]}><Text style={styles.sevTextMed}>Medium</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.sevBtn, styles.sevHigh]}><Text style={styles.sevTextHigh}>🔴 High</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.bigBtn}>
                        <Svg viewBox="0 0 16 16" width={16} height={16}>
                            <Path d="M1 8l14-7-6 15-2.5-6L1 8z" fill="white" />
                        </Svg>
                        <Text style={styles.bigBtnText}>Send report to Arch1</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
    projectTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 11 },
    scrollContent: { paddingBottom: 40, alignItems: 'center' },
    shakeZone: { paddingHorizontal: 28, alignItems: 'center', marginTop: 20 },
    rippleOuter: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
    rippleInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(217,85,85,0.15)', borderWidth: 1.5, borderColor: 'rgba(217,85,85,0.4)', alignItems: 'center', justifyContent: 'center' },
    shakeIcon: { transform: [{ rotate: '-10deg' }] },
    shakeTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: 'white', textAlign: 'center', lineHeight: 32 },
    titleItalic: { fontFamily: 'PlayfairDisplay_400Regular_Italic', color: 'rgba(255,255,255,0.45)' },
    shakeSub: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 20, marginTop: 8 },
    formCard: { width: Dimensions.get('window').width - 32, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', marginTop: 24, overflow: 'hidden' },
    formLabel: { padding: 14, paddingBottom: 8, fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },
    catRow: { paddingHorizontal: 12, paddingBottom: 12, gap: 6 },
    cat: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1, borderColor: 'transparent' },
    catActive: { backgroundColor: 'rgba(217,85,85,0.2)', borderColor: 'rgba(217,85,85,0.4)' },
    catTextActive: { color: '#F08080', fontSize: 11, fontWeight: '600' },
    catAmber: { backgroundColor: 'rgba(196,120,58,0.15)', borderColor: 'rgba(196,120,58,0.3)' },
    catTextAmber: { color: '#E8A060', fontSize: 11, fontWeight: '500' },
    catBlue: { backgroundColor: 'rgba(58,111,160,0.15)', borderColor: 'rgba(58,111,160,0.3)' },
    catTextBlue: { color: '#7BAFE0', fontSize: 11, fontWeight: '500' },
    catGray: { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' },
    catTextGray: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '500' },
    textArea: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', padding: 16, height: 90, color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlignVertical: 'top' },
    formFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
    attachBtn: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    locTag: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
    locText: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
    inlineSend: { backgroundColor: COLORS.red, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
    inlineSendText: { color: 'white', fontSize: 12, fontWeight: '600' },
    sevCard: { width: Dimensions.get('window').width - 32, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: 12, paddingBottom: 12 },
    sevRow: { flexDirection: 'row', paddingHorizontal: 14, gap: 8 },
    sevBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
    sevLow: { backgroundColor: 'rgba(74,124,89,0.15)', borderColor: 'rgba(74,124,89,0.3)' },
    sevTextLow: { color: '#7ECB94', fontSize: 11, fontWeight: '600' },
    sevMed: { backgroundColor: 'rgba(196,120,58,0.15)', borderColor: 'rgba(196,120,58,0.3)' },
    sevTextMed: { color: '#E8A060', fontSize: 11, fontWeight: '600' },
    sevHigh: { backgroundColor: 'rgba(217,85,85,0.25)', borderColor: 'rgba(217,85,85,0.5)' },
    sevTextHigh: { color: '#F08080', fontSize: 12, fontWeight: '700' },
    bottom: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 14 },
    bigBtn: { height: 54, backgroundColor: COLORS.red, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    bigBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
