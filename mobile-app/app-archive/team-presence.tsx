import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { signalRService } from '../src/services/signalr.service';
import { useAuth } from '../src/context/AuthContext';
import { projectService } from '../src/services/project.service';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    cream: '#F0EDE8',
    border: '#D8D4CE',
    white: '#FFFFFF',
    purple: '#7B6FA0',
    amber: '#C4783A',
    blue: '#3A6FA0',
};

export default function TeamPresence() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [members, setMembers] = React.useState<any[]>([
        { id: '1', initials: 'A1', name: 'Arch1 (you)', status: 'Dashboard · Studio Arc', type: 'Web', active: true, color: COLORS.green, badge: 'web' },
        { id: '2', initials: 'JK', name: 'J. Kim', status: 'VR · Riverside Penthouse · Floor 3', type: '🥽 In VR', active: true, color: COLORS.purple, badge: 'vr' },
        { id: '3', initials: 'MR', name: 'M. Ross', status: 'VR · Riverside Penthouse · Floor 2', type: '🥽 In VR', active: true, color: COLORS.purple, badge: 'vr' },
    ]);

    const [activities, setActivities] = React.useState<any[]>([
        { id: '1', initials: 'JK', text: 'J. Kim entered Master Suite in VR', time: '2 min ago', clock: '09:39', color: COLORS.purple },
        { id: '2', initials: 'MR', text: 'M. Ross added annotation #12', time: '8 min ago', clock: '09:33', color: COLORS.amber },
    ]);

    React.useEffect(() => {
        if (!isAuthenticated) return;

        const handleUpdate = (data: any) => {
            if (data.type === 'join' || data.type === 'presence') {
                const newMember = {
                    id: data.UserId || Math.random().toString(),
                    initials: (data.UserName || '??').substring(0, 2).toUpperCase(),
                    name: data.UserName || 'Unknown',
                    status: data.Status || 'Active',
                    type: data.InVR ? '🥽 In VR' : 'Web',
                    active: true,
                    color: data.InVR ? COLORS.purple : COLORS.blue,
                    badge: data.InVR ? 'vr' : 'web'
                };

                setMembers(prev => {
                    const exists = prev.find(m => m.id === newMember.id);
                    if (exists) return prev.map(m => m.id === newMember.id ? newMember : m);
                    return [newMember, ...prev];
                });

                setActivities(prev => [
                    {
                        id: Date.now().toString(),
                        initials: newMember.initials,
                        text: `${newMember.name} joined the session`,
                        time: 'Just now',
                        clock: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        color: newMember.color
                    },
                    ...prev.slice(0, 10)
                ]);
            }
        };

        signalRService.onPresenceUpdate(handleUpdate);

        projectService.getAll().then(res => {
            const pids = res.data?.map(p => p.id) || [];
            if (pids.length > 0) signalRService.startConnection(pids).catch(() => { });
        });

    }, [isAuthenticated]);

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.networkBar}>
                    <View style={styles.networkDot} />
                    <Text style={styles.networkText}>Live Connection Active</Text>
                    <View style={styles.netProgress}><View style={styles.netFill} /></View>
                </View>

                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16"><Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Overview</Text>
                    <TouchableOpacity><Text style={styles.filterText}>Filter</Text></TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.greeting}>
                        <Text style={styles.greetMeta}>Architect Dashboard · Mar 2026</Text>
                        <Text style={styles.greetText}>Good morning, <Text style={styles.greetItalic}>Arch1.</Text></Text>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Team — now</Text>
                        <Text style={styles.sectionCount}>{members.filter(m => m.active).length} active</Text>
                    </View>

                    <View style={styles.members}>
                        {members.map(m => (
                            <View key={m.id} style={[styles.memberRow, !m.active && { opacity: 0.5 }]}>
                                <View style={[styles.avatar, { backgroundColor: m.color }]}>
                                    <Text style={styles.avatarText}>{m.initials}</Text>
                                    <View style={[styles.dot, m.badge === 'vr' ? styles.dotVr : m.badge === 'web' ? styles.dotWeb : styles.dotOffline]} />
                                </View>
                                <View style={styles.memberInfo}>
                                    <Text style={styles.memberName}>{m.name}</Text>
                                    <Text style={styles.memberStatus}>{m.status}</Text>
                                </View>
                                <View style={[styles.badge, m.badge === 'vr' ? styles.badgeVr : m.badge === 'web' ? styles.badgeWeb : styles.badgeOffline]}>
                                    <Text style={[styles.badgeText, { color: m.color }]}>{m.type}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.activitySection}>
                        <Text style={styles.activityTitle}>Recent activity</Text>
                        {activities.map(a => (
                            <View key={a.id} style={styles.activityRow}>
                                <View style={[styles.actAv, { backgroundColor: a.color }]}><Text style={styles.actAvText}>{a.initials}</Text></View>
                                <View style={styles.actTextWrap}>
                                    <Text style={styles.actText}>{a.text} <Text style={{ color: COLORS.gray, fontSize: 10 }}>{a.time}</Text></Text>
                                </View>
                                <Text style={styles.actClock}>{a.clock}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    networkBar: { height: 28, backgroundColor: 'rgba(74, 124, 89, 0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    networkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
    networkText: { fontSize: 11, fontWeight: '500', color: COLORS.green },
    netProgress: { width: 80, height: 2, backgroundColor: 'rgba(74, 124, 89, 0.2)', borderRadius: 1, overflow: 'hidden' },
    netFill: { height: '100%', width: '100%', backgroundColor: COLORS.green },
    topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.black, fontSize: 13, fontWeight: '500' },
    headerTitle: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    filterText: { fontSize: 12, color: COLORS.gray },
    content: { flex: 1 },
    greeting: { padding: 18, paddingTop: 14 },
    greetMeta: { fontSize: 10, color: COLORS.gray, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
    greetText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: COLORS.black },
    greetItalic: { fontStyle: 'italic', color: COLORS.gray },
    sectionHeader: { paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 13, fontWeight: '500', color: COLORS.black },
    sectionCount: { fontSize: 11, color: COLORS.gray },
    members: { paddingHorizontal: 14 },
    memberRow: { backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 11, paddingHorizontal: 14, marginBottom: 7, flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    avatarText: { fontSize: 13, fontWeight: '600', color: 'white' },
    dot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: 'white' },
    dotVr: { backgroundColor: COLORS.purple },
    dotWeb: { backgroundColor: COLORS.green },
    dotOffline: { backgroundColor: COLORS.grayLight },
    memberInfo: { flex: 1 },
    memberName: { fontSize: 13, fontWeight: '500', color: COLORS.black },
    memberStatus: { fontSize: 11, color: COLORS.gray, marginTop: 1 },
    badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100 },
    badgeVr: { backgroundColor: 'rgba(123,111,160,0.12)' },
    badgeWeb: { backgroundColor: 'rgba(74,124,89,0.1)' },
    badgeOffline: { backgroundColor: '#E8E4DE' },
    badgeText: { fontSize: 10, fontWeight: '500' },
    activitySection: { paddingHorizontal: 18, marginTop: 12 },
    activityTitle: { fontSize: 12, fontWeight: '500', color: COLORS.black, marginBottom: 10 },
    activityRow: { flexDirection: 'row', gap: 10, marginBottom: 9, alignItems: 'flex-start' },
    actAv: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    actAvText: { fontSize: 9, fontWeight: '600', color: 'white' },
    actTextWrap: { flex: 1 },
    actText: { fontSize: 12, color: '#2C2A27', lineHeight: 17 },
    actClock: { fontSize: 10, color: '#C8C5C0' },
});
