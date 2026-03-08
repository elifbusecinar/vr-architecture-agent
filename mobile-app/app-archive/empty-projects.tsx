import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, Ellipse, Line, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';

const COLORS = {
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    cream: '#F0EDE8',
    border: '#D8D4CE',
    white: '#FFFFFF',
};

export default function EmptyProjectsPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topbar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Svg width="16" height="16" viewBox="0 0 16 16">
                        <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </Svg>
                    <Text style={styles.backText}>Dashboard</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Projects</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.center}>
                <View style={styles.illustration}>
                    <Svg width="220" height="170" viewBox="0 0 220 170" fill="none">
                        <Ellipse cx="110" cy="158" rx="70" ry="8" fill="rgba(0,0,0,0.06)" />
                        <Rect x="55" y="60" width="110" height="90" stroke="#D8D4CE" strokeWidth="1.5" strokeDasharray="6 4" />
                        <Path d="M45 60L110 20L175 60" stroke="#C8C5C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 4" />
                        <Rect x="72" y="80" width="22" height="22" rx="2" fill="white" stroke="#D8D4CE" strokeWidth="1.2" />
                        <Rect x="126" y="80" width="22" height="22" rx="2" fill="white" stroke="#D8D4CE" strokeWidth="1.2" />
                        <Line x1="83" y1="80" x2="83" y2="102" stroke="#E8E4DE" strokeWidth="0.8" />
                        <Line x1="72" y1="91" x2="94" y2="91" stroke="#E8E4DE" strokeWidth="0.8" />
                        <Line x1="137" y1="80" x2="137" y2="102" stroke="#E8E4DE" strokeWidth="0.8" />
                        <Line x1="126" y1="91" x2="148" y2="91" stroke="#E8E4DE" strokeWidth="0.8" />
                        <Rect x="96" y="115" width="28" height="35" rx="2" fill="white" stroke="#D8D4CE" strokeWidth="1.2" />
                        <Circle cx="118" cy="133" r="2" fill="#D8D4CE" />
                        <Rect x="140" y="38" width="12" height="22" rx="1" fill="none" stroke="#D8D4CE" strokeWidth="1.2" strokeDasharray="4 3" />
                        <Circle cx="170" cy="36" r="16" fill="white" stroke="#E8E4DE" strokeWidth="1.5" />
                        <SvgText x="170" y="42" textAnchor="middle" fontSize="18" fill="#C8C5C0">?</SvgText>
                        <Circle cx="55" cy="36" r="12" fill={COLORS.black} />
                        <Path d="M55 30v12M49 36h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    </Svg>
                    <View style={styles.groundLine}>
                        <View style={styles.groundBracket} />
                        <View style={[styles.groundBracket, { right: 0 }]} />
                    </View>
                </View>

                <Text style={styles.title}>No projects{"\n"}<Text style={styles.titleItalic}>just yet</Text></Text>
                <Text style={styles.sub}>Your studio space is ready. Upload a 3D model or start from a blank project to begin your first VR walkthrough.</Text>

                <TouchableOpacity style={styles.cta}>
                    <Svg width="16" height="16" viewBox="0 0 16 16"><Path d="M8 2v12M2 8h12" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" /></Svg>
                    <Text style={styles.ctaText}>Create first project</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ctaSec}>
                    <Text style={styles.ctaSecText}>Upload GLB model</Text>
                </TouchableOpacity>

                <View style={styles.hintRow}>
                    <View style={styles.hintDivider} />
                    <Text style={styles.hintText}>or invite a colleague to share theirs</Text>
                    <View style={styles.hintDivider} />
                </View>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.black, fontSize: 13, fontWeight: '500' },
    headerTitle: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 60 },
    illustration: { width: 220, height: 180, marginBottom: 32, position: 'relative' },
    groundLine: { position: 'absolute', bottom: 10, left: 10, right: 10, height: 1, backgroundColor: COLORS.border },
    groundBracket: { position: 'absolute', bottom: 0, width: 1, height: 8, backgroundColor: COLORS.border },
    title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: COLORS.black, textAlign: 'center', lineHeight: 32, marginBottom: 10 },
    titleItalic: { fontStyle: 'italic', color: COLORS.gray },
    sub: { fontSize: 13.5, color: COLORS.gray, textAlign: 'center', lineHeight: 22, maxWidth: 260, marginBottom: 28 },
    cta: { width: '100%', backgroundColor: COLORS.black, borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 },
    ctaText: { color: 'white', fontSize: 14, fontWeight: '600' },
    ctaSec: { width: '100%', borderRadius: 14, height: 52, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    ctaSecText: { color: COLORS.black, fontSize: 13, fontWeight: '500' },
    hintRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
    hintDivider: { flex: 1, height: 1, backgroundColor: COLORS.border },
    hintText: { fontSize: 11, color: COLORS.grayLight },
});
