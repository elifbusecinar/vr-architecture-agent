import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    cream: '#F0EDE8',
    creamDark: '#E8E4DE',
    black: '#1A1917',
    blackSoft: '#2C2A27',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    border: '#D8D4CE',
    red: '#D95555',
    amber: '#C4783A',
    blue: '#3A6FA0',
    purple: '#7B6FA0',
    white: '#FAFAF8',
};

const notifications = [
    { id: 1, type: 'approval', title: 'Client approved Riverside Penthouse 🎉', sub: 'Sarah Jensen signed off after VR walkthrough', project: 'Riverside Penthouse', time: '2m', unread: true },
    { id: 2, type: 'comment', title: 'New comment from J. Kim', sub: '"The wardrobe depth should be increased by 10cm — see annotation #7"', project: 'The Arc Studio', time: '14m', unread: true },
    { id: 3, type: 'device', title: 'Headset battery low — 12%', sub: 'Meta Quest 3 · Arch1 device needs charging', project: 'Device alert', time: '32m', unread: true },
    { id: 4, type: 'session', title: 'VR Session recording ready', sub: '28m 14s · 7 annotations · ready to replay', project: 'Riverside Penthouse', time: '1h', unread: true },
    { id: 5, type: 'sync', title: 'Sync complete — 5 items uploaded', sub: '3 notes + 2 photos synced from offline session', project: 'Riverside Penthouse', time: '2h', unread: false },
    { id: 6, type: 'comment', title: 'Annotation resolved by M. Ross', sub: 'Door clearance issue marked as fixed', project: 'The Arc Studio', time: '5h', unread: false },
    { id: 7, type: 'approval', title: 'Review request sent to client', sub: 'Awaiting Sarah Jensen\'s response', project: 'Riverside Penthouse', time: '8h', unread: false },
];

export default function NotificationsPage() {
    const router = useRouter();

    const renderIcon = (type: string) => {
        switch (type) {
            case 'approval': return <Svg viewBox="0 0 17 17" width={17} height={17}><Path d="M2 8.5l4.5 4.5 8.5-9" stroke={COLORS.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>;
            case 'comment': return <Svg viewBox="0 0 17 17" width={17} height={17}><Path d="M2 3h13v9H9l-4 3V12H2V3z" fill="none" stroke={COLORS.blue} strokeWidth="1.4" strokeLinejoin="round" /></Svg>;
            case 'device': return <Svg viewBox="0 0 17 17" width={17} height={17}><Path d="M8.5 2a6.5 6.5 0 010 13A6.5 6.5 0 018.5 2zm0 3v4l3 2" stroke={COLORS.red} strokeWidth="1.4" strokeLinecap="round" fill="none" /></Svg>;
            case 'session': return <Svg viewBox="0 0 17 17" width={17} height={17}><Circle cx="8.5" cy="8.5" r="6" fill="none" stroke={COLORS.purple} strokeWidth="1.4" /><Path d="M6.5 6l5 2.5-5 2.5V6z" fill={COLORS.purple} /></Svg>;
            case 'sync': return <Svg viewBox="0 0 17 17" width={17} height={17}><Path d="M14 8.5A5.5 5.5 0 013 8.5M3 8.5L5.5 6M3 8.5L5.5 11" stroke={COLORS.amber} strokeWidth="1.4" strokeLinecap="round" fill="none" /></Svg>;
            default: return null;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'approval': return 'rgba(74,124,89,0.12)';
            case 'comment': return 'rgba(58,111,160,0.1)';
            case 'device': return 'rgba(217,85,85,0.1)';
            case 'session': return 'rgba(123,111,160,0.1)';
            case 'sync': return 'rgba(196,120,58,0.1)';
            default: return COLORS.creamDark;
        }
    };

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16">
                            <Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Notifications</Text>
                    <TouchableOpacity><Text style={styles.clearText}>Clear all</Text></TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        <View style={[styles.filterItem, styles.filterActive]}>
                            <Text style={styles.filterTextActive}>All</Text>
                            <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
                        </View>
                        <View style={styles.filterItem}><Text style={styles.filterText}>Approvals</Text></View>
                        <View style={styles.filterItem}><Text style={styles.filterText}>Comments</Text></View>
                        <View style={styles.filterItem}><Text style={styles.filterText}>Devices</Text></View>
                        <View style={styles.filterItem}><Text style={styles.filterText}>Sessions</Text></View>
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.list}>
                    <Text style={styles.dateSep}>Today</Text>
                    {notifications.filter(n => n.id <= 4).map(item => (
                        <TouchableOpacity key={item.id} style={[styles.item, item.unread && styles.itemUnread]}>
                            {item.unread && <View style={styles.unreadDot} />}
                            <View style={[styles.iconBox, { backgroundColor: getIconBg(item.type) }]}>
                                {renderIcon(item.type)}
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSub}>{item.sub}</Text>
                                <View style={styles.projBadge}>
                                    <Text style={styles.projText}>{item.project}</Text>
                                </View>
                            </View>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </TouchableOpacity>
                    ))}

                    <Text style={styles.dateSep}>Yesterday</Text>
                    {notifications.filter(n => n.id > 4).map(item => (
                        <TouchableOpacity key={item.id} style={[styles.item, item.unread && styles.itemUnread]}>
                            <View style={[styles.iconBox, { backgroundColor: getIconBg(item.type) }]}>
                                {renderIcon(item.type)}
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSub}>{item.sub}</Text>
                                <View style={styles.projBadge}>
                                    <Text style={styles.projText}>{item.project}</Text>
                                </View>
                            </View>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: 'white' },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.black, fontSize: 13, fontFamily: 'DMSans_500Medium' },
    title: { fontSize: 15, fontFamily: 'DMSans_700Bold', color: COLORS.black },
    clearText: { fontSize: 12, color: COLORS.gray, fontFamily: 'DMSans_400Regular' },
    filterRow: { height: 44, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: 'white' },
    filterScroll: { paddingHorizontal: 16 },
    filterItem: { height: 44, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    filterActive: { borderBottomColor: COLORS.black },
    filterText: { color: COLORS.gray, fontSize: 12, fontFamily: 'DMSans_400Regular' },
    filterTextActive: { color: COLORS.black, fontSize: 12, fontFamily: 'DMSans_700Bold' },
    badge: { backgroundColor: COLORS.red, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    badgeText: { color: 'white', fontSize: 9, fontFamily: 'DMSans_700Bold' },
    list: { paddingVertical: 8 },
    dateSep: { paddingHorizontal: 18, paddingVertical: 12, fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'DMSans_700Bold' },
    item: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        alignItems: 'flex-start',
        gap: 12,
        marginHorizontal: 14,
        borderRadius: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    itemUnread: { backgroundColor: 'rgba(74,124,89,0.02)', borderColor: 'rgba(74,124,89,0.1)' },
    unreadDot: { position: 'absolute', left: 8, top: 24, width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
    iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1 },
    itemTitle: { fontSize: 13, fontFamily: 'DMSans_700Bold', color: COLORS.black, lineHeight: 18 },
    itemSub: { fontSize: 12, color: COLORS.gray, marginTop: 2, lineHeight: 16, fontFamily: 'DMSans_400Regular' },
    projBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.cream, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
    projText: { fontSize: 9, color: COLORS.gray, fontFamily: 'DMSans_700Bold', textTransform: 'uppercase' },
    timeText: { fontSize: 10, color: COLORS.grayLight, marginTop: 2, fontFamily: 'DMSans_400Regular' },
});
