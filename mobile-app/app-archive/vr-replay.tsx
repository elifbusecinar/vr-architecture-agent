import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#0A0908',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    amber: '#C4783A',
    gray: 'rgba(255,255,255,0.4)',
};

export default function VRReplayPage() {
    const router = useRouter();

    const onContextCreate = async (gl: any) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new Renderer({ gl });

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x4A7C59,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Add a simple floor grid
        const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x333333);
        gridHelper.position.y = -1;
        scene.add(gridHelper);

        camera.position.z = 3;
        camera.position.y = 1;
        camera.lookAt(0, 0, 0);

        const render = () => {
            requestAnimationFrame(render);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            (renderer as any).render(scene, camera);
            gl.endFrameEXP();
        };
        render();
    };

    return (
        <ScreenTransition type="slide">
            <View style={styles.container}>
                <View style={styles.viewport}>
                    {/* 3D Scene Background */}
                    <GLView style={styles.sceneBg} onContextCreate={onContextCreate} />


                    {/* Ghost Movement Path */}
                    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 375 380">
                        <Path d="M60 300 C80 280 120 250 160 220 C190 195 210 180 230 170 C250 160 270 175 280 200 C290 225 275 260 255 280 C235 300 210 310 185 305 C160 300 140 285 120 280" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="5 4" fill="none" />
                        <Circle cx="230" cy="170" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                        <Circle cx="230" cy="170" r="4" fill="rgba(255,255,255,0.7)" />
                    </Svg>

                    {/* Annotation Pins */}
                    <View style={[styles.pin, { top: '32%', left: '20%' }]}>
                        <View style={[styles.pinDot, styles.pinRed]}>
                            <Text style={styles.pinText}>!</Text>
                        </View>
                        <Text style={styles.pinTime}>02:14</Text>
                    </View>
                    <View style={[styles.pin, { top: '20%', left: '52%' }]}>
                        <View style={[styles.pinDot, styles.pinGreen]}>
                            <Text style={styles.pinText}>A</Text>
                        </View>
                        <Text style={styles.pinTime}>05:38</Text>
                    </View>
                    <View style={[styles.pin, { top: '42%', left: '66%' }]}>
                        <View style={[styles.pinDot, styles.pinAmber]}>
                            <Text style={styles.pinText}>2</Text>
                        </View>
                        <Text style={styles.pinTime}>08:51</Text>
                    </View>

                    <SafeAreaView style={styles.hudOverlay}>
                        <View style={styles.hudTop}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                                <Svg width="16" height="16" viewBox="0 0 16 16">
                                    <Path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </Svg>
                                <Text style={styles.hudBackText}>Sessions</Text>
                            </TouchableOpacity>
                            <Text style={styles.hudTitle}>Riverside Penthouse</Text>
                            <View style={styles.speedBadge}><Text style={styles.speedText}>1×</Text></View>
                        </View>

                        <View style={styles.progressArea}>
                            <View style={styles.roomTag}>
                                <View style={styles.roomDot} />
                                <Text style={styles.roomLabel}>Master Suite</Text>
                            </View>
                            <View style={styles.scrubTrack}>
                                <View style={[styles.scrubFill, { width: '38%' }]} />
                                <View style={[styles.scrubThumb, { left: '38%' }]} />
                                <View style={[styles.tick, { left: '14%', backgroundColor: COLORS.red }]} />
                                <View style={[styles.tick, { left: '36%', backgroundColor: COLORS.green }]} />
                                <View style={[styles.tick, { left: '57%', backgroundColor: COLORS.amber }]} />
                            </View>
                            <View style={styles.timeLabels}>
                                <Text style={styles.timeLabel}>10:52</Text>
                                <Text style={styles.timeLabel}>28:14</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>

                <View style={styles.controls}>
                    <View style={styles.ctrlRow}>
                        <TouchableOpacity style={styles.ctrlBtn}>
                            <Svg width="18" height="18" viewBox="0 0 18 18">
                                <Path d="M4 4v10M7 9l7-5v10L7 9z" fill="rgba(255,255,255,0.6)" />
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ctrlBtn}>
                            <Svg width="18" height="18" viewBox="0 0 18 18">
                                <Rect x="5" y="4" width="2.5" height="10" rx="1" fill="rgba(255,255,255,0.6)" />
                                <Rect x="10.5" y="4" width="2.5" height="10" rx="1" fill="rgba(255,255,255,0.6)" />
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.playBtn}>
                            <Svg width="22" height="22" viewBox="0 0 22 22">
                                <Path d="M8 6l9 5-9 5V6z" fill="#0A0908" />
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ctrlBtn}>
                            <Svg width="18" height="18" viewBox="0 0 18 18">
                                <Path d="M14 4v10M11 9L4 4v10l7-5z" fill="rgba(255,255,255,0.6)" />
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ctrlBtn}>
                            <Svg width="18" height="18" viewBox="0 0 18 18">
                                <Circle cx="9" cy="9" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" fill="none" />
                                <Path d="M9 6v3.5l3 2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.annotList}>
                        <View style={styles.annotRow}>
                            <View style={[styles.annotNum, styles.pinRedShadow]}><Text style={styles.annotNumTextRed}>!</Text></View>
                            <Text style={styles.annotText}>Window reveal 4cm off spec — flagged by Arch1</Text>
                            <Text style={styles.annotTs}>02:14</Text>
                        </View>
                        <View style={[styles.annotRow, styles.annotRowActive]}>
                            <View style={[styles.annotNum, styles.pinGreenShadow]}><Text style={styles.annotNumTextGreen}>A</Text></View>
                            <Text style={[styles.annotText, { color: 'white' }]}>Ceiling height confirmed ✓ — client reaction: positive</Text>
                            <Text style={styles.annotTs}>05:38</Text>
                        </View>
                        <View style={styles.annotRow}>
                            <View style={[styles.annotNum, styles.pinAmberShadow]}><Text style={styles.annotNumTextAmber}>2</Text></View>
                            <Text style={styles.annotText}>Wardrobe placement question — client requested review</Text>
                            <Text style={styles.annotTs}>08:51</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    viewport: { flex: 1, position: 'relative' },
    sceneBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0D0C0B' },
    hudOverlay: { ...StyleSheet.absoluteFillObject },
    hudTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    hudBackText: { color: 'white', fontSize: 13 },
    hudTitle: { color: 'white', fontSize: 13, fontWeight: '600' },
    speedBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    speedText: { color: 'white', fontSize: 11, fontWeight: '700' },
    pin: { position: 'absolute', alignItems: 'center', zIndex: 10 },
    pinDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
    pinRed: { backgroundColor: 'rgba(217,85,85,0.7)', borderColor: COLORS.red },
    pinGreen: { backgroundColor: 'rgba(74,124,89,0.7)', borderColor: COLORS.green },
    pinAmber: { backgroundColor: 'rgba(196,120,58,0.7)', borderColor: COLORS.amber },
    pinText: { color: 'white', fontSize: 10, fontWeight: '700' },
    pinTime: { marginTop: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
    progressArea: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'transparent' },
    roomTag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 },
    roomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
    roomLabel: { color: 'white', fontSize: 11 },
    scrubTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, position: 'relative', marginBottom: 6 },
    scrubFill: { height: '100%', backgroundColor: 'white', borderRadius: 2 },
    scrubThumb: { position: 'absolute', top: -5.5, width: 14, height: 14, backgroundColor: 'white', borderRadius: 7 },
    tick: { position: 'absolute', top: -3, width: 3, height: 9, borderRadius: 2, marginLeft: -1.5 },
    timeLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    timeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
    controls: { backgroundColor: '#0A0908', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34 },
    ctrlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    ctrlBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    playBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
    annotList: { height: 180 },
    annotRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10, marginBottom: 8 },
    annotRowActive: { borderWidth: 1, borderColor: 'rgba(74,124,89,0.2)', backgroundColor: 'rgba(74,124,89,0.06)' },
    annotNum: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    pinRedShadow: { backgroundColor: 'rgba(217,85,85,0.2)', borderColor: 'rgba(217,85,85,0.5)' },
    annotNumTextRed: { color: '#F08080', fontSize: 9, fontWeight: '700' },
    pinGreenShadow: { backgroundColor: 'rgba(74,124,89,0.2)', borderColor: 'rgba(74,124,89,0.5)' },
    annotNumTextGreen: { color: '#7ECB94', fontSize: 9, fontWeight: '700' },
    pinAmberShadow: { backgroundColor: 'rgba(196,120,58,0.2)', borderColor: 'rgba(196,120,58,0.5)' },
    annotNumTextAmber: { color: '#E8A060', fontSize: 9, fontWeight: '700' },
    annotText: { flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 16 },
    annotTs: { fontSize: 10, color: 'rgba(255,255,255,0.25)' },
});
