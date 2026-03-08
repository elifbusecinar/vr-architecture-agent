import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
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
    red: '#D95555',
    amber: '#C4783A',
    purple: '#7B6FA0',
    blue: '#3A6FA0',
};

export default function ProfilePage() {
    const router = useRouter();

    const [notifications, setNotifications] = React.useState(true);
    const [approvals, setApprovals] = React.useState(true);
    const [deviceAlerts, setDeviceAlerts] = React.useState(false);
    const [biometrics, setBiometrics] = React.useState(true);

    return (
        <ScreenTransition type="slide">
            <View style={styles.container}>
                <SafeAreaView style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Svg width="16" height="16" viewBox="0 0 16 16">
                                <Path d="M10 3L5 8l5 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                            <Text style={styles.backText}>Dashboard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity><Text style={styles.editText}>Edit profile</Text></TouchableOpacity>
                    </View>

                    <View style={styles.userRow}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
                        <View>
                            <Text style={styles.name}>Arch<Text style={styles.nameItalic}>1</Text></Text>
                            <Text style={styles.email}>arch1@studioa.com</Text>
                        </View>
                    </View>

                    <View style={styles.roleChips}>
                        <TouchableOpacity style={[styles.roleChip, styles.roleActive]}>
                            <Text style={styles.roleTextActive}>🏛 Architect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roleChip}>
                            <Text style={styles.roleText}>👷 Contractor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roleChip}>
                            <Text style={styles.roleText}>👤 Client</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentScroll}>
                    <Text style={styles.sectionLabel}>Workspace</Text>
                    <View style={styles.group}>
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: 'rgba(74,124,89,0.1)' }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill={COLORS.green}><Path d="M7.5 1L13.5 4.5V10.5L7.5 14L1.5 10.5V4.5L7.5 1Z" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Studio Arc</Text>
                            <View style={styles.planBadge}><Text style={styles.planText}>Pro</Text></View>
                            <View style={styles.arrow}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M5 3l4 4-4 4" stroke={COLORS.grayLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: 'rgba(58,111,160,0.1)' }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill="none" stroke={COLORS.blue} strokeWidth="1.3"><Circle cx="7.5" cy="5" r="2.5" /><Path d="M3 13c0-2.8 2-4 4.5-4s4.5 1.2 4.5 4" strokeLinecap="round" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Team members</Text>
                            <Text style={styles.rowVal}>4 active</Text>
                            <View style={styles.arrow}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M5 3l4 4-4 4" stroke={COLORS.grayLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionLabel}>Notifications</Text>
                    <View style={styles.group}>
                        <View style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: 'rgba(217,85,85,0.1)' }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill={COLORS.red}><Path d="M7.5 1C5 1 3 3 3 5.5V9L1.5 11h12L12 9V5.5C12 3 10 1 7.5 1z" /><Path d="M5.5 11v.5a2 2 0 004 0V11" fill="none" stroke={COLORS.red} strokeWidth="1" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Push notifications</Text>
                            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: COLORS.border, true: COLORS.green }} />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: 'rgba(74,124,89,0.1)' }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill="none" stroke={COLORS.green} strokeWidth="1.3"><Path d="M2 8.5l4.5 4.5 6.5-8" strokeLinecap="round" strokeLinejoin="round" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Approval alerts</Text>
                            <Switch value={approvals} onValueChange={setApprovals} trackColor={{ false: COLORS.border, true: COLORS.green }} />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: 'rgba(196,120,58,0.1)' }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill="none" stroke={COLORS.amber} strokeWidth="1.3"><Circle cx="7.5" cy="7.5" r="5.5" /><Path d="M7.5 4.5v3l2 2" strokeLinecap="round" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Device alerts</Text>
                            <Switch value={deviceAlerts} onValueChange={setDeviceAlerts} trackColor={{ false: COLORS.border, true: COLORS.green }} />
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>VR & Devices</Text>
                    <View style={styles.group}>
                        <TouchableOpacity style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: COLORS.cream }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill="none" stroke={COLORS.black} strokeWidth="1.2"><Rect x="1" y="5" width="13" height="6" rx="1.5" /><Path d="M4 5V4a3.5 3.5 0 017 0v1" /><Circle cx="5" cy="8" r="1" /><Circle cx="10" cy="8" r="1" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Meta Quest 3</Text>
                            <Text style={[styles.rowVal, { color: COLORS.green }]}>Connected</Text>
                            <View style={styles.arrow}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M5 3l4 4-4 4" stroke={COLORS.grayLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></View>
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <View style={[styles.rowIcon, { backgroundColor: COLORS.cream }]}>
                                <Svg viewBox="0 0 15 15" width={15} height={15} fill="none" stroke={COLORS.black} strokeWidth="1.2"><Path d="M7.5 1L3 3.5V9c0 2 2 3.5 4.5 4.5C10 12.5 12 11 12 9V3.5L7.5 1z" /></Svg>
                            </View>
                            <Text style={styles.rowLabel}>Biometric access</Text>
                            <Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ false: COLORS.border, true: COLORS.green }} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.signOutBtn}>
                        <View style={[styles.rowIcon, { backgroundColor: 'rgba(217,85,85,0.1)' }]}>
                            <Svg viewBox="0 0 15 15" width={15} height={15} fill="none" stroke={COLORS.red} strokeWidth="1.2"><Path d="M10 7.5H3M7 4.5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" /><Path d="M12 2v11" strokeLinecap="round" strokeLinejoin="round" /></Svg>
                        </View>
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    header: { backgroundColor: COLORS.black, paddingBottom: 24 },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
    editText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
    userRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 14 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#2A2520', borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontFamily: 'PlayfairDisplay_400Regular', color: 'rgba(255,255,255,0.7)', fontSize: 22 },
    name: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 22, color: 'white' },
    nameItalic: { fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' },
    email: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
    roleChips: { flexDirection: 'row', gap: 6, marginTop: 12, paddingHorizontal: 20 },
    roleChip: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
    roleActive: { backgroundColor: 'white', borderColor: 'white' },
    roleTextActive: { color: COLORS.black, fontSize: 11, fontWeight: '600' },
    roleText: { color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: '500' },
    content: { flex: 1 },
    contentScroll: { paddingBottom: 40 },
    sectionLabel: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 6, fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1 },
    group: { marginHorizontal: 14, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
    rowIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { flex: 1, fontSize: 13, color: COLORS.black },
    rowVal: { fontSize: 12, color: COLORS.gray, marginRight: 4 },
    planBadge: { backgroundColor: 'rgba(74,124,89,0.1)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100 },
    planText: { color: COLORS.green, fontSize: 10, fontWeight: '600' },
    arrow: { width: 14, height: 14 },
    signOutBtn: { marginHorizontal: 14, marginTop: 20, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
    signOutText: { fontSize: 13, color: COLORS.red, fontWeight: '600' },
});
