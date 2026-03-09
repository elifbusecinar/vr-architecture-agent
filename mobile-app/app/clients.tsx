import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const COLORS = {
    cream: '#F0EDE8',
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    border: '#D8D4CE',
};

export default function ClientsPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Top Bar */}
            <View style={styles.topbar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={COLORS.black} strokeWidth="2">
                        <Path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <Text style={styles.topbarTitle}>My Clients</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.placeholderCard}>
                    <View style={styles.placeholderIcon}>
                        <Svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={COLORS.gray} strokeWidth="1.5">
                            <Circle cx="12" cy="8" r="4" />
                            <Path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                        </Svg>
                    </View>
                    <Text style={styles.placeholderTitle}>Client Portal Coming Soon</Text>
                    <Text style={styles.placeholderSub}>
                        Collaborate directly with your clients, invite them to VR walkthroughs, and manage feedback comments from this dashboard.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <NavItem label="Overview" icon="home" onPress={() => router.replace('/dashboard')} />
                <NavItem label="Projects" icon="projects" onPress={() => router.replace('/projects')} />
                <NavItem label="AI" icon="chat" onPress={() => router.replace('/ai-assistant')} />
                <NavItem label="Clients" icon="users" active onPress={() => { }} />
            </View>
        </SafeAreaView>
    );
}

function NavItem({ label, icon, active, onPress }: { label: string, icon: string, active?: boolean, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onPress}>
            <Svg viewBox="0 0 20 20" width={20} height={20} fill={active ? COLORS.black : 'none'} stroke={active ? 'none' : COLORS.grayLight} strokeWidth="1.4">
                {icon === 'home' && <Path d="M3 10L10 3l7 7v7H13v-4H7v4H3V10Z" fill={active ? COLORS.black : COLORS.grayLight} stroke="none" />}
                {icon === 'projects' && <Rect x="2" y="4" width="16" height="12" rx="2" />}
                {icon === 'chat' && <Path d="M18 13a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" fill={active ? COLORS.black : COLORS.grayLight} stroke="none" />}
                {icon === 'users' && <Circle cx="10" cy="7" r="3" />}
                {icon === 'users' && !active && <Path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />}
                {icon === 'projects' && !active && <Path d="M7 4v12M13 4v12M2 10h16" />}
            </Svg>
            <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
            {active && <View style={styles.navDot} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    topbarTitle: { fontSize: 16, fontWeight: '600', color: COLORS.black, marginLeft: 8 },
    scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    placeholderCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
    },
    placeholderIcon: {
        width: 64, height: 64, borderRadius: 32, backgroundColor: '#F8F7F4',
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    placeholderTitle: { fontSize: 18, fontWeight: '600', color: COLORS.black, textAlign: 'center', marginBottom: 12 },
    placeholderSub: { fontSize: 13, color: COLORS.gray, textAlign: 'center', lineHeight: 20 },
    bottomNav: {
        height: 72,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        paddingTop: 8,
    },
    navItem: { flex: 1, alignItems: 'center' },
    navText: { fontSize: 9, color: COLORS.grayLight, marginTop: 4, letterSpacing: 0.3 },
    navTextActive: { color: COLORS.black, fontWeight: '600' },
    navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.black, marginTop: 2 },
});
