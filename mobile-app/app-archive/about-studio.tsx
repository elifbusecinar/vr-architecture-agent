import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    cream: '#F0EDE8',
    creamDark: '#E8E4DE',
    border: '#D8D4CE',
    white: '#FFFFFF',
};

export default function AboutStudio() {
    const router = useRouter();

    const team = [
        { name: 'Sarah Jensen', role: 'Principal Architect', bio: 'Specializing in sustainable urban habitats and bio-morphic structures.' },
        { name: 'Marcus Chen', role: 'Technical Director', bio: 'Expert in BIM integration and large-scale digital twins.' },
        { name: 'Elena Rossi', role: 'Lead Interior Architect', bio: 'Focused on human-centric spaces and light-ray interactions.' },
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity onPress={() => router.back()}><Svg width="20" height="20" viewBox="0 0 20 20"><Path d="M12 4L6 10l6 6" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></TouchableOpacity>
                    <Text style={styles.headerTitle}>Our Studio</Text>
                    <View style={{ width: 20 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Jensen & <Text style={styles.heroItalic}>Partners</Text></Text>
                        <Text style={styles.heroSub}>A multidisciplinary architectural practice at the intersection of reality and virtual space.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Philosophy</Text>
                        <Text style={styles.bodyText}>We believe architecture is not just about building structures, but about creating atmospheres. By utilizing VR and real-time collaboration, we bring our clients into the design process early, ensuring every corner of their future space is felt, not just seen.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>The Team</Text>
                        {team.map((member, i) => (
                            <View key={i} style={styles.teamMember}>
                                <View style={styles.memberAvatar} />
                                <View style={styles.memberInfo}>
                                    <Text style={styles.memberName}>{member.name}</Text>
                                    <Text style={styles.memberRole}>{member.role}</Text>
                                    <Text style={styles.memberBio}>{member.bio}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={[styles.section, styles.accentSection]}>
                        <Text style={[styles.sectionLabel, { color: 'white' }]}>Our Technology</Text>
                        <Text style={[styles.bodyText, { color: 'rgba(255,255,255,0.7)' }]}>Our stack is built on .NET 8, Unity 6, and Azure Spatial Anchors. We provide the industry's most reliable real-time BIM synchronization platform for mobile and headset devices.</Text>
                    </View>

                    <View style={styles.contactCard}>
                        <Text style={styles.contactTitle}>Work with us</Text>
                        <Text style={styles.contactSub}>Interested in a VR-native design process? Let's discuss your next project.</Text>
                        <TouchableOpacity style={styles.contactBtn}><Text style={styles.contactBtnText}>Send Inquiry</Text></TouchableOpacity>
                    </View>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    headerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1 },
    content: { flex: 1 },
    hero: { padding: 32, backgroundColor: COLORS.cream, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    heroTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 36, color: COLORS.black, letterSpacing: -1 },
    heroItalic: { fontStyle: 'italic', color: COLORS.gray },
    heroSub: { fontSize: 14, color: COLORS.gray, marginTop: 12, lineHeight: 22 },
    section: { padding: 24 },
    sectionLabel: { fontSize: 10, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 },
    bodyText: { fontSize: 14, color: '#444', lineHeight: 24 },
    teamMember: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    memberAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.creamDark },
    memberInfo: { flex: 1 },
    memberName: { fontSize: 15, fontWeight: '600', color: COLORS.black },
    memberRole: { fontSize: 12, color: COLORS.green, fontWeight: '500', marginBottom: 4 },
    memberBio: { fontSize: 12, color: COLORS.gray, lineHeight: 18 },
    accentSection: { backgroundColor: COLORS.black, borderRadius: 24, margin: 16 },
    contactCard: { margin: 24, padding: 24, backgroundColor: COLORS.cream, borderRadius: 20, alignItems: 'center' },
    contactTitle: { fontSize: 20, fontWeight: '600', color: COLORS.black, marginBottom: 8 },
    contactSub: { fontSize: 13, color: COLORS.gray, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
    contactBtn: { backgroundColor: COLORS.black, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 100 },
    contactBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
