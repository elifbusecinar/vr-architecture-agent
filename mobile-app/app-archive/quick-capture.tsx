import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

const COLORS = {
    black: '#0D0C0A',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    border: 'rgba(255,255,255,0.15)',
};

export default function QuickCapturePage() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [capturing, setCapturing] = useState(false);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (!cameraRef.current || capturing) return;
        setCapturing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync();
            console.log('Photo captured:', photo?.uri);
            // In a real app, you'd save this to a store or navigate to a preview
            router.push('/dashboard');
        } catch (e) {
            console.error(e);
        } finally {
            setCapturing(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.cameraView} ref={cameraRef} facing="back">
                {/* Simplified Room Perspective Mock */}
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.svgOverlay}>
                    <Path d={`M${width * 0.2} ${height * 0.1} L${width * 0.8} ${height * 0.1} L${width * 0.8} ${height * 0.8} L${width * 0.2} ${height * 0.8} Z`} stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                </Svg>

                <SafeAreaView style={styles.uiOverlay}>
                    <View style={styles.topbar}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Svg width="16" height="16" viewBox="0 0 16 16">
                                <Path d="M10 3L5 8l10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.topTitle}>Quick Capture</Text>
                        <TouchableOpacity style={styles.flashBtn}>
                            <Svg width="15" height="15" viewBox="0 0 15 15">
                                <Path d="M9 1L4 8.5h5.5L7 14l7-8.5H8L9 1Z" fill="white" />
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.focusFrame}>
                        <View style={[styles.corner, styles.tl]} />
                        <View style={[styles.corner, styles.tr]} />
                        <View style={[styles.corner, styles.bl]} />
                        <View style={[styles.corner, styles.br]} />
                    </View>

                    <View style={styles.tagDrawer}>
                        <Text style={styles.tagLabel}>TAG THIS PHOTO</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
                            <View style={[styles.tag, styles.tagActive]}><View style={[styles.tagDot, { backgroundColor: '#4A7C59' }]} /><Text style={styles.tagTextActive}>Master Suite</Text></View>
                            <View style={styles.tag}><View style={[styles.tagDot, { backgroundColor: '#5B8FA8' }]} /><Text style={styles.tagText}>Living Room</Text></View>
                            <View style={styles.tag}><View style={[styles.tagDot, { backgroundColor: '#C4783A' }]} /><Text style={styles.tagText}>Kitchen</Text></View>
                            <View style={styles.tag}><View style={[styles.tagDot, { backgroundColor: '#7B6FA0' }]} /><Text style={styles.tagText}>Bathroom</Text></View>
                        </ScrollView>
                    </View>

                    <View style={styles.bottomArea}>
                        <View style={styles.sideCol}>
                            <TouchableOpacity style={styles.thumbBtn}>
                                <Svg width="18" height="18" viewBox="0 0 18 18">
                                    <Rect x="3" y="3" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                                    <Path d="M3 13l3-3 3 3 2-2 4 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                                </Svg>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modeBtn}>
                                <Svg width="18" height="18" viewBox="0 0 18 18">
                                    <Path d="M3 9l4-4 3 3 3-4 4 5H3z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                                </Svg>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.shutter} onPress={takePicture} disabled={capturing}>
                            <View style={styles.shutterInner}>
                                {capturing ? (
                                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.red }} />
                                ) : (
                                    <Svg viewBox="0 0 22 22" width={22} height={22}>
                                        <Rect x="2" y="6" width="18" height="14" rx="2" fill={COLORS.black} />
                                        <Circle cx="11" cy="13" r="4" fill="white" />
                                    </Svg>
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.projCol}>
                            <TouchableOpacity style={styles.projBtn}>
                                <Svg width="18" height="18" viewBox="0 0 18 18">
                                    <Path d="M2 16V7l7-5 7 5v9H2Z" fill="none" stroke="#7ECB94" strokeWidth="1.2" />
                                    <Rect x="6" y="11" width="3" height="5" fill="#7ECB94" opacity="0.7" />
                                </Svg>
                                <View style={styles.countBadge}><Text style={styles.countText}>7</Text></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    centered: { justifyContent: 'center', alignItems: 'center', padding: 20 },
    permissionText: { color: 'white', textAlign: 'center', marginBottom: 20, fontFamily: 'DMSans_400Regular' },
    permissionBtn: { backgroundColor: COLORS.green, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
    permissionBtnText: { color: 'white', fontFamily: 'DMSans_700Bold' },
    cameraView: { flex: 1 },
    svgOverlay: { position: 'absolute' },
    uiOverlay: { flex: 1 },
    topbar: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
    backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
    topTitle: { fontSize: 13, color: 'white', fontWeight: '600' },
    flashBtn: { width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    focusFrame: { position: 'absolute', top: height * 0.3, left: width * 0.2, width: width * 0.6, height: height * 0.2 },
    corner: { position: 'absolute', width: 20, height: 20, borderColor: 'white' },
    tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 4 },
    tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 4 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 4 },
    br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 4 },
    tagDrawer: { position: 'absolute', bottom: 120, left: 0, right: 0, paddingHorizontal: 16 },
    tagLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 1, marginBottom: 8 },
    tagScroll: { gap: 8 },
    tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
    tagActive: { backgroundColor: 'white' },
    tagDot: { width: 7, height: 7, borderRadius: 3.5 },
    tagText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
    tagTextActive: { color: COLORS.black, fontSize: 11, fontWeight: '700' },
    bottomArea: { position: 'absolute', bottom: 40, left: 0, right: 0, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sideCol: { flexDirection: 'row', gap: 8 },
    thumbBtn: { width: 46, height: 46, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    modeBtn: { width: 46, height: 46, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    shutter: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
    shutterInner: { width: 54, height: 54, borderRadius: 27, borderWidth: 2.5, borderColor: 'rgba(0,0,0,0.12)', alignItems: 'center', justifyContent: 'center' },
    projCol: {},
    projBtn: { width: 46, height: 46, borderRadius: 10, backgroundColor: 'rgba(74,124,89,0.25)', borderWidth: 1.5, borderColor: 'rgba(74,124,89,0.5)', alignItems: 'center', justifyContent: 'center' },
    countBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.green, width: 17, height: 17, borderRadius: 8.5, borderWidth: 1.5, borderColor: COLORS.black, alignItems: 'center', justifyContent: 'center' },
    countText: { color: 'white', fontSize: 9, fontWeight: '700' },
});

