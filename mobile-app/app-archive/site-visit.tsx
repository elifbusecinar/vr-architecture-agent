import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, PanResponder } from 'react-native';
import Svg, { Path, Line, Rect, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const { width, height } = Dimensions.get('window');

const COLORS = {
    black: '#1A1917',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    border: 'rgba(255,255,255,0.18)',
};

export default function SiteVisitModePage() {
    const router = useRouter();
    const [splitPos, setSplitPos] = useState(width / 2);

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newPos = Math.max(50, Math.min(width - 50, gestureState.moveX));
            setSplitPos(newPos);
        },
    });

    return (
        <ScreenTransition type="fade">
            <View style={styles.container}>
                {/* Camera View / Scene */}
                <View style={styles.scene}>
                    {/* Real Reality Simulated Sketch */}
                    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
                        <Line x1="0" y1={height * 0.7} x2={width} y2={height * 0.7} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                        <Line x1="0" y1={height * 0.7} x2={width * 0.25} y2={height * 0.2} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                        <Line x1={width} y1={height * 0.7} x2={width * 0.75} y2={height * 0.2} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                        <Rect x={width * 0.35} y={height * 0.55} width={50} height={70} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none" />
                    </Svg>

                    {/* Model Overlay (Right Side) */}
                    <View style={[styles.modelOverlay, { left: splitPos, width: width - splitPos, overflow: 'hidden' }]}>
                        <View style={{ width: width, marginLeft: -splitPos }}>
                            <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                                <Line x1="0" y1={height * 0.7} x2={width} y2={height * 0.7} stroke="rgba(74,124,89,0.8)" strokeWidth="1.5" />
                                <Rect x={width * 0.35 + 2} y={height * 0.55 - 3} width={50} height={73} stroke="rgba(217,85,85,0.8)" strokeWidth="1.5" fill="none" />
                            </Svg>
                        </View>
                    </View>

                    {/* Split Slider Handle */}
                    <View style={[styles.splitLine, { left: splitPos }]} {...panResponder.panHandlers}>
                        <View style={styles.splitHandle}>
                            <Svg width="16" height="16" viewBox="0 0 16 16">
                                <Path d="M5 3l-3 5 3 5M11 3l3 5-3 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                        </View>
                    </View>

                    <View style={styles.labels}>
                        <Text style={styles.labelLeft}>REALITY</Text>
                        <Text style={styles.labelRight}>MODEL</Text>
                    </View>

                    {/* Pins */}
                    <View style={[styles.pin, { top: '34%', left: '30%' }]}>
                        <View style={styles.pinDot} />
                        <View style={styles.pinLine} />
                        <View style={styles.pinTag}><Text style={styles.pinTagText}>Door +3cm off</Text></View>
                    </View>
                </View>

                {/* Top Bar Overlay */}
                <SafeAreaView style={styles.topbarOverlay}>
                    <View style={styles.topbar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Svg width="16" height="16" viewBox="0 0 16 16">
                                <Path d="M10 3L5 8l10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </Svg>
                        </TouchableOpacity>
                        <View style={styles.projectPill}><Text style={styles.projectPillText}>Riverside Penthouse</Text></View>
                        <View style={styles.accuracyPill}>
                            <View style={styles.accDot} />
                            <Text style={styles.accuracyText}>94% match</Text>
                        </View>
                    </View>
                </SafeAreaView>

                {/* Bottom Info Panel */}
                <View style={styles.bottomPanel}>
                    <View style={styles.roomInfo}>
                        <View>
                            <Text style={styles.roomName}>Master Suite</Text>
                            <Text style={styles.roomSub}>Floor 3 · Northeast</Text>
                        </View>
                        <View style={styles.deltaBox}>
                            <Text style={styles.deltaVal}>-3cm</Text>
                            <Text style={styles.deltaLabel}>avg delta</Text>
                        </View>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionSec}>
                            <Text style={styles.actionTextSec}>Add pin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionPri}>
                            <Text style={styles.actionTextPri}>Save report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D0C0A' },
    scene: { flex: 1 },
    modelOverlay: { position: 'absolute', top: 0, bottom: 0, backgroundColor: 'rgba(74,124,89,0.1)' },
    splitLine: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 },
    splitHandle: {
        position: 'absolute', top: height / 2 - 18, left: -17,
        width: 36, height: 36, borderRadius: 18, backgroundColor: 'white',
        alignItems: 'center', justifyContent: 'center', elevation: 5,
    },
    labels: { position: 'absolute', top: 60, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 9 },
    labelLeft: { color: 'white', fontSize: 10, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 4 },
    labelRight: { color: 'white', fontSize: 10, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 4 },
    topbarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 },
    topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 50 },
    backBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
    projectPill: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5 },
    projectPillText: { color: 'white', fontSize: 11, fontFamily: 'DMSans_500Medium' },
    accuracyPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(74,124,89,0.25)', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, gap: 5 },
    accDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4A7C59' },
    accuracyText: { color: '#7ECB94', fontSize: 10, fontWeight: '600' },
    bottomPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.75)', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    roomInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    roomName: { color: 'white', fontSize: 16, fontWeight: '600' },
    roomSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
    deltaBox: { backgroundColor: 'rgba(217,85,85,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'flex-end' },
    deltaVal: { color: '#F08080', fontSize: 14, fontWeight: '700' },
    deltaLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
    actionPri: { flex: 1, backgroundColor: 'white', borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    actionSec: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    actionTextPri: { color: COLORS.black, fontSize: 13, fontWeight: '600' },
    actionTextSec: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    pin: { position: 'absolute', alignItems: 'center' },
    pinDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.red, borderWidth: 2, borderColor: 'white' },
    pinLine: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.4)' },
    pinTag: { backgroundColor: 'rgba(217,85,85,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    pinTagText: { color: 'white', fontSize: 9, fontWeight: '600' },
});
