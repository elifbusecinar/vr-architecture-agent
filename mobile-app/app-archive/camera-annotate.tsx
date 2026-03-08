import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect, Line as SvgLine } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScreenTransition } from '../src/components/ScreenTransition';

const { width, height } = Dimensions.get('window');

const COLORS = {
    black: '#0D0C0A',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    gray: '#8A8783',
    border: 'rgba(255,255,255,0.1)',
};

export default function ARAnnotationPage() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScreenTransition type="slide">
            <View style={styles.container}>
                {/* Camera View */}
                <CameraView style={styles.cameraView} facing="back">
                    <View style={styles.cameraOverlay} />

                    {/* Virtual Room Perspective Mock */}
                    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.svgOverlay}>
                        <Path d={`M${width * 0.2} ${height * 0.2} L${width * 0.8} ${height * 0.2} L${width * 0.8} ${height * 0.7} L${width * 0.2} ${height * 0.7} Z`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                        <SvgLineComp x1={0} y1={0} x2={width * 0.2} y2={height * 0.2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                        <SvgLineComp x1={width} y1={0} x2={width * 0.8} y2={height * 0.2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                        <SvgLineComp x1={0} y1={height} x2={width * 0.2} y2={height * 0.7} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                        <SvgLineComp x1={width} y1={height} x2={width * 0.8} y2={height * 0.7} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                    </Svg>

                    {/* AR Pins */}
                    <View style={[styles.arPin, { top: '30%', left: '50%' }]}>
                        <View style={[styles.pinCircle, { backgroundColor: 'rgba(74,124,89,0.7)', borderColor: COLORS.green }]}>
                            <Text style={styles.pinIcon}>A</Text>
                        </View>
                        <View style={[styles.pinLine, { backgroundColor: 'rgba(74,124,89,0.5)' }]} />
                        <View style={styles.pinLabel}><Text style={styles.pinLabelText}>Window recess — 3cm off spec</Text></View>
                    </View>

                    <View style={[styles.arPin, { top: '50%', left: '25%' }]}>
                        <View style={[styles.pinCircle, { backgroundColor: 'rgba(217,85,85,0.7)', borderColor: COLORS.red }]}>
                            <Text style={styles.pinIcon}>!</Text>
                        </View>
                        <View style={[styles.pinLine, { backgroundColor: 'rgba(217,85,85,0.5)' }]} />
                        <View style={styles.pinLabel}><Text style={styles.pinLabelText}>Door swing clearance ⚠️</Text></View>
                    </View>

                    {/* Crosshair */}
                    <View style={styles.crosshair}>
                        <View style={styles.chRing}>
                            <View style={styles.chDot} />
                            <View style={[styles.chLine, styles.chH, { left: -18 }]} />
                            <View style={[styles.chLine, styles.chH, { right: -18 }]} />
                            <View style={[styles.chLine, styles.chV, { top: -18 }]} />
                            <View style={[styles.chLine, styles.chV, { bottom: -18 }]} />
                        </View>
                    </View>

                    {/* UI Elements */}
                    <SafeAreaView style={styles.uiOverlay}>
                        {/* Top Bar */}
                        <View style={styles.topbar}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                                <Svg width="16" height="16" viewBox="0 0 16 16">
                                    <Path d="M10 3L5 8l10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </Svg>
                                <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
                            <Text style={styles.topTitle}>AR Annotate</Text>
                            <View style={styles.modeToggle}>
                                <View style={[styles.modeBtn, styles.modeActive]}><Text style={styles.modeTextActive}>AR</Text></View>
                                <View style={styles.modeBtn}><Text style={styles.modeText}>Photo</Text></View>
                            </View>
                        </View>

                        {/* Right Panel */}
                        <View style={styles.rightPanel}>
                            <TouchableOpacity style={styles.panelBtn}>
                                <Svg viewBox="0 0 18 18" width={20} height={20}>
                                    <Circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" />
                                    <Path d="M9 5v4l3 2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                </Svg>
                                <View style={styles.notifBadge}><Text style={styles.notifText}>3</Text></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.panelBtn}>
                                <Svg viewBox="0 0 18 18" width={20} height={20}>
                                    <Path d="M4 14l4-4 4 4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                </Svg>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Panel */}
                        <View style={styles.bottomArea}>
                            <View style={styles.inputRow}>
                                <View style={styles.fakeInput}>
                                    <Text style={styles.fakeInputText}>Tap scene to pin annotation...</Text>
                                </View>
                                <TouchableOpacity style={styles.voiceBtn}>
                                    <Svg viewBox="0 0 16 16" width={16} height={16}>
                                        <Rect x="5.5" y="1" width="5" height="8" rx="2.5" fill="rgba(255,255,255,0.6)" />
                                        <Path d="M3 7.5a5 5 0 0010 0" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                    </Svg>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.captureRow}>
                                <View style={styles.sideBtn} />
                                <TouchableOpacity style={styles.captureBtn}>
                                    <View style={styles.captureBtnInner}>
                                        <Svg viewBox="0 0 22 22" width={22} height={22}>
                                            <Path d="M3 8.5C3 7.4 3.9 6.5 5 6.5h1.5l1-2h7l1 2H17c1.1 0 2 .9 2 2V16c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8.5z" fill={COLORS.black} />
                                            <Circle cx="11" cy="12" r="3" fill="white" />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.galleryBtn}>
                                    <View style={styles.galleryInner} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </CameraView>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    centered: { justifyContent: 'center', alignItems: 'center', padding: 20 },
    permissionText: { color: 'white', textAlign: 'center', marginBottom: 20, fontFamily: 'DMSans_400Regular' },
    permissionBtn: { backgroundColor: COLORS.green, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
    permissionBtnText: { color: 'white', fontFamily: 'DMSans_700Bold' },
    cameraView: { flex: 1 },
    cameraOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    svgOverlay: { ...StyleSheet.absoluteFillObject },
    uiOverlay: { ...StyleSheet.absoluteFillObject },

    topbar: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: 'white', fontSize: 13, fontFamily: 'DMSans_500Medium' },
    topTitle: { color: 'white', fontSize: 13, fontFamily: 'DMSans_500Medium' },
    modeToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', padding: 2, borderRadius: 8 },
    modeBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    modeActive: { backgroundColor: 'white' },
    modeText: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'DMSans_700Bold' },
    modeTextActive: { color: COLORS.black, fontSize: 10, fontFamily: 'DMSans_700Bold' },

    arPin: { position: 'absolute', alignItems: 'center' },
    pinCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    pinIcon: { color: 'white', fontSize: 11, fontWeight: '700' },
    pinLine: { width: 1, height: 20 },
    pinLabel: { backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    pinLabelText: { fontSize: 10, color: 'white', fontFamily: 'DMSans_400Regular' },

    crosshair: { position: 'absolute', top: '50%', left: '50%', marginLeft: -30, marginTop: -30 },
    chRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
    chDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'white' },
    chLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.4)' },
    chH: { width: 14, height: 1 },
    chV: { width: 1, height: 14 },

    rightPanel: { position: 'absolute', right: 14, top: '40%', gap: 10 },
    panelBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    notifBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' },
    notifText: { color: 'white', fontSize: 9, fontWeight: '700' },

    bottomArea: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 20 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    fakeInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    fakeInputText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'DMSans_400Regular' },
    voiceBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
    captureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    captureBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
    captureBtnInner: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' },
    sideBtn: { width: 42 },
    galleryBtn: { width: 42, height: 42, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', padding: 3 },
    galleryInner: { flex: 1, borderRadius: 7, backgroundColor: '#333' },
});

const SvgLineComp = ({ x1, y1, x2, y2, stroke, strokeWidth }: any) => (
    <SvgLine x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} />
);
