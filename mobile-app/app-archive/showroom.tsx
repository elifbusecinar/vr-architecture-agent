import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';
import { SkeletonLoader } from '../src/components/SkeletonLoader';
import { Toast, ToastType } from '../src/components/Toast';
import { ActionSheet } from '../src/components/ActionSheet';

const COLORS = {
    black: '#1A1917',
    gray: '#8A8783',
    cream: '#F0EDE8',
    border: '#D8D4CE',
    white: '#FFFFFF',
    green: '#4A7C59',
    red: '#D95555',
    amber: '#C4783A',
    blue: '#3A6FA0',
    purple: '#7B6FA0',
};

export default function ShowroomPage() {
    const router = useRouter();

    // Toast State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastTitle, setToastTitle] = useState('');
    const [toastMsg, setToastMsg] = useState('');

    // Bottom Sheet State
    const [sheetVisible, setSheetVisible] = useState(false);

    const showToast = (type: ToastType, title: string, msg: string) => {
        setToastType(type);
        setToastTitle(title);
        setToastMsg(msg);
        setToastVisible(true);
    };

    const actions = [
        { id: 'share', label: 'Share project', sub: 'Send link or invite team', iconBg: 'rgba(58,111,160,0.1)', iconColor: COLORS.blue, icon: (c: string) => <Svg width={17} height={17} viewBox="0 0 17 17"><Circle cx="12" cy="4" r="2" stroke={c} strokeWidth="1.3" fill="none" /><Circle cx="4" cy="8.5" r="2" stroke={c} strokeWidth="1.3" fill="none" /><Circle cx="12" cy="13" r="2" stroke={c} strokeWidth="1.3" fill="none" /><Path d="M6 7.5l4-2.5M6 9.5l4 2.5" stroke={c} strokeWidth="1.2" fill="none" /></Svg> },
        { id: 'export', label: 'Export report', sub: 'PDF summary with annotations', iconBg: 'rgba(74,124,89,0.1)', iconColor: COLORS.green, icon: (c: string) => <Svg width={17} height={17} viewBox="0 0 17 17"><Path d="M13 7V4L9.5 1H3v15h10v-5" stroke={c} strokeWidth="1.3" fill="none" /><Path d="M9 1v4h4" stroke={c} strokeWidth="1.2" /><Path d="M10 11l4-4m0 4h-4v-4" stroke={c} strokeWidth="1.2" fill="none" /></Svg> },
        { id: 'delete', label: 'Delete project', sub: 'Permanent · cannot be undone', type: 'danger' as const, iconBg: 'rgba(217,85,85,0.1)', iconColor: COLORS.red, icon: (c: string) => <Svg width={17} height={17} viewBox="0 0 17 17"><Path d="M3 5h11M7 5V3h3v2M5 5l.5 9h6l.5-9" stroke={c} strokeWidth="1.3" fill="none" /></Svg> },
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16"><Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                    </TouchableOpacity>
                    <Text style={styles.title}>UI Showroom</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>
                    <Text style={styles.label}>Skeleton Loaders</Text>
                    <View style={styles.card}>
                        <SkeletonLoader width="100%" height={160} borderRadius={12} style={{ marginBottom: 16 }} />
                        <SkeletonLoader width="70%" height={20} style={{ marginBottom: 8 }} />
                        <SkeletonLoader width="40%" height={16} />
                    </View>

                    <Text style={styles.label}>Toast Notifications</Text>
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={[styles.btn, { borderColor: COLORS.green }]} onPress={() => showToast('success', 'Note synced successfully', 'Master Suite · saved to model')}>
                            <Text style={[styles.btnText, { color: COLORS.green }]}>Success</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { borderColor: COLORS.amber }]} onPress={() => showToast('warning', 'Sync delayed', 'Poor connection detected')}>
                            <Text style={[styles.btnText, { color: COLORS.amber }]}>Warning</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { borderColor: COLORS.red }]} onPress={() => showToast('error', 'Upload failed', 'File limit exceeded')}>
                            <Text style={[styles.btnText, { color: COLORS.red }]}>Error</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { borderColor: COLORS.black }]} onPress={() => showToast('info', 'New VR session', 'J. Kim started a session')}>
                            <Text style={[styles.btnText, { color: COLORS.black }]}>Info</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Bottom Sheet</Text>
                    <TouchableOpacity style={styles.mainBtn} onPress={() => setSheetVisible(true)}>
                        <Text style={styles.mainBtnText}>Open Project Actions</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Animated States</Text>
                    <View style={styles.badgeRow}>
                        <View style={styles.loadingBadge}><Text style={styles.loadingText}>Fetching models...</Text></View>
                    </View>
                </ScrollView>

                <Toast
                    visible={toastVisible}
                    type={toastType}
                    title={toastTitle}
                    message={toastMsg}
                    onClose={() => setToastVisible(false)}
                />

                <ActionSheet
                    visible={sheetVisible}
                    title="Riverside Penthouse"
                    subtitle="Jensen & Co · Floor 3 · v2.4"
                    actions={actions}
                    onAction={(id) => { console.log('Action:', id); setSheetVisible(false); }}
                    onClose={() => setSheetVisible(false)}
                />
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: '700', color: COLORS.black },
    scroll: { padding: 20 },
    label: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginTop: 24 },
    card: { backgroundColor: 'white', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
    btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, backgroundColor: 'white' },
    btnText: { fontSize: 13, fontWeight: '700' },
    mainBtn: { width: '100%', height: 52, backgroundColor: COLORS.black, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
    badgeRow: { flexDirection: 'row' },
    loadingBadge: { backgroundColor: COLORS.black, borderRadius: 100, paddingHorizontal: 16, paddingVertical: 10 },
    loadingText: { color: 'white', fontSize: 12, fontWeight: '600' },
});
