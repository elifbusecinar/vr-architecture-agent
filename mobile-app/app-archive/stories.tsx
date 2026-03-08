import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
    blue: '#3A6FA0',
    amber: '#C4783A',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Stories() {
    const router = useRouter();

    const stories = [
        { id: '1', title: 'The Vertical Forest', loc: 'Milan, Italy', desc: 'Integrating 900+ trees into a high-rise residential structure in visual VR.', category: 'Sustainable', color: COLORS.green },
        { id: '2', title: 'Arctic Research Base', loc: 'Svalbard', desc: 'Designing for extreme insulation and modularity using BIM data layers.', category: 'Research', color: COLORS.blue },
        { id: '3', title: 'Museum of Light', loc: 'Tokyo, Japan', desc: 'Experimenting with real-time solar studies and ray-traced shadows.', category: 'Cultural', color: COLORS.amber },
        { id: '4', title: 'Urban Renewal Hub', loc: 'Berlin, Germany', desc: 'Community-led design sessions using shared VR spaces.', category: 'Social', color: COLORS.gray },
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.topRow}>
                        <TouchableOpacity onPress={() => router.back()}><Svg width="20" height="20" viewBox="0 0 20 20"><Path d="M12 4L6 10l6 6" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></TouchableOpacity>
                        <Text style={styles.headerTitle}>Stories</Text>
                        <TouchableOpacity><Svg width="20" height="20" viewBox="0 0 20 20" fill="none"><Circle cx="10" cy="10" r="7" stroke={COLORS.black} strokeWidth="1.3" /><Path d="M10 7v3.5l2 1" stroke={COLORS.black} strokeWidth="1.3" strokeLinecap="round" /></Svg></TouchableOpacity>
                    </View>
                    <Text style={styles.metaLabel}>Jensen & Co · Design Showcase</Text>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Architectural <Text style={styles.heroItalic}>stories</Text></Text>
                        <Text style={styles.heroSub}>Step inside our most challenging projects through immersive VR case studies.</Text>
                    </View>

                    {stories.map(s => (
                        <TouchableOpacity key={s.id} style={styles.storyCard}>
                            <View style={styles.imagePlaceholder}>
                                <View style={[styles.categoryBadge, { backgroundColor: s.color }]}><Text style={styles.categoryText}>{s.category}</Text></View>
                                <View style={styles.eyeBtn}><Svg width="14" height="14" viewBox="0 0 16 16" fill="white"><Path d="M8 3.5c-3 0-5.5 2-6.5 4.5 1 2.5 3.5 4.5 6.5 4.5s5.5-2 6.5-4.5c-1-2.5-3.5-4.5-6.5-4.5zM8 10a2 2 0 110-4 2 2 0 010 4z" /></Svg></View>
                            </View>
                            <View style={styles.storyInfo}>
                                <View style={styles.locRow}><Svg width="10" height="10" viewBox="0 0 12 12" fill="none"><Circle cx="6" cy="6" r="4.5" stroke={COLORS.gray} strokeWidth="1.2" /><Circle cx="6" cy="6" r="1.5" fill={COLORS.gray} /></Svg><Text style={styles.locText}>{s.loc}</Text></View>
                                <Text style={styles.storyTitle}>{s.title}</Text>
                                <Text style={styles.storyDesc}>{s.desc}</Text>

                                <TouchableOpacity style={styles.readMore}>
                                    <Text style={styles.readText}>View VR Tour</Text>
                                    <Svg width="12" height="12" viewBox="0 0 14 14"><Path d="M3 7h8M8 4l3 3-3 3" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" fill="none" /></Svg>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.footerInfo}>
                        <Text style={styles.footerLabel}>Want to build your own story?</Text>
                        <TouchableOpacity style={styles.joinBtn} onPress={() => router.push('/onboarding' as any)}><Text style={styles.joinText}>Get Started for Free</Text></TouchableOpacity>
                    </View>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    header: { padding: 18, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.cream },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    headerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1 },
    metaLabel: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 0.5 },
    content: { flex: 1 },
    scrollContent: { paddingHorizontal: 18, paddingTop: 16 },
    hero: { marginBottom: 24 },
    heroTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 32, color: COLORS.black, letterSpacing: -0.5 },
    heroItalic: { fontStyle: 'italic', color: COLORS.gray },
    heroSub: { fontSize: 13, color: COLORS.gray, marginTop: 10, lineHeight: 20, maxWidth: 260 },
    storyCard: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
    imagePlaceholder: { height: 180, backgroundColor: COLORS.grayLight, opacity: 0.8, position: 'relative' },
    categoryBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    categoryText: { color: 'white', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
    eyeBtn: { position: 'absolute', bottom: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
    storyInfo: { padding: 18 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    locText: { fontSize: 11, color: COLORS.gray, fontWeight: '500' },
    storyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.black, marginBottom: 8 },
    storyDesc: { fontSize: 13, color: '#444', lineHeight: 20, marginBottom: 16 },
    readMore: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    readText: { fontSize: 12, fontWeight: '600', color: COLORS.black },
    footerInfo: { marginTop: 24, alignItems: 'center', padding: 24, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
    footerLabel: { fontSize: 13, color: COLORS.gray, marginBottom: 16 },
    joinBtn: { backgroundColor: COLORS.black, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
    joinText: { color: 'white', fontSize: 13, fontWeight: '600' },
});
