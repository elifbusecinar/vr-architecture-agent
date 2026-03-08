import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
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
    blue: '#3A6FA0',
    purple: '#7B6FA0',
};

export default function TagManagement() {
    const router = useRouter();

    const tags = [
        { id: '1', name: 'Urgent', badge: 'High', color: '#E8603A', sub: 'Safety hazards, structural issues', count: 12 },
        { id: '2', name: 'Review Needed', badge: 'Review', color: COLORS.amber, sub: 'Needs architect review before proceeding', count: 18 },
        { id: '3', name: 'Solved', badge: 'Done', color: COLORS.green, sub: 'Resolved and verified by team', count: 9 },
        { id: '4', name: 'Client Comment', badge: 'Client', color: COLORS.blue, sub: 'Notes from client VR session', count: 8 },
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16"><Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                        <Text style={styles.backText}>Annotations</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tags</Text>
                    <TouchableOpacity style={styles.addBtn}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M7 2v10M2 7h10" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" fill="none" /></Svg><Text style={styles.addText}>New</Text></TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}><Text style={styles.statVal}>8</Text><Text style={styles.statLabel}>Total tags</Text></View>
                    <View style={styles.statBox}><Text style={styles.statVal}>47</Text><Text style={styles.statLabel}>Annotations</Text></View>
                    <View style={styles.statBox}><Text style={[styles.statVal, { color: COLORS.red }]}>3</Text><Text style={styles.statLabel}>Untagged</Text></View>
                </View>

                <View style={styles.colorPicker}>
                    <Text style={styles.cpLabel}>Edit: Urgent — pick a color</Text>
                    <View style={styles.cpSwatches}>
                        {['#D95555', '#E8603A', '#C4783A', '#C4A83A', '#4A7C59', '#3A6FA0', '#7B6FA0', '#8A8783', '#1A1917'].map((c, i) => (
                            <TouchableOpacity key={c} style={[styles.swatch, { backgroundColor: c }, i === 1 && styles.swatchSelected]} />
                        ))}
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Drag to reorder priority</Text>
                <ScrollView style={styles.list} contentContainerStyle={styles.listScroll}>
                    {tags.map(tag => (
                        <View key={tag.id} style={styles.item}>
                            <View style={styles.dragHandle}><View style={styles.dragBar} /><View style={styles.dragBar} /><View style={styles.dragBar} /></View>
                            <View style={[styles.colorRing, { backgroundColor: `${tag.color}25`, borderColor: `${tag.color}80` }]}>
                                <View style={[styles.dot, { backgroundColor: tag.color }]} />
                            </View>
                            <View style={styles.info}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.nameText}>{tag.name}</Text>
                                    <View style={[styles.tagBadge, { backgroundColor: `${tag.color}1F` }]}><Text style={[styles.tagBadgeText, { color: tag.color }]}>● {tag.badge}</Text></View>
                                </View>
                                <Text style={styles.metaText}>{tag.sub}</Text>
                            </View>
                            <View style={styles.countBox}>
                                <Text style={styles.countVal}>{tag.count}</Text>
                                <Text style={styles.countLabel}>uses</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: COLORS.black, fontSize: 13, fontWeight: '500' },
    headerTitle: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    addText: { fontSize: 13, fontWeight: '500', color: COLORS.black },
    statsRow: { padding: 14, flexDirection: 'row', gap: 8 },
    statBox: { flex: 1, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 10, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: '600', color: COLORS.black },
    statLabel: { fontSize: 10, color: COLORS.gray, marginTop: 3 },
    colorPicker: { marginHorizontal: 14, backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 10 },
    cpLabel: { fontSize: 11, fontWeight: '500', color: COLORS.black, marginBottom: 10 },
    cpSwatches: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    swatch: { width: 30, height: 30, borderRadius: 15 },
    swatchSelected: { borderWidth: 3, borderColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
    sectionLabel: { paddingHorizontal: 18, paddingBottom: 8, fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1 },
    list: { flex: 1 },
    listScroll: { paddingHorizontal: 14, paddingBottom: 40 },
    item: { backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 13, paddingHorizontal: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
    dragHandle: { gap: 3, padding: 2 },
    dragBar: { width: 12, height: 1.5, backgroundColor: COLORS.grayLight, borderRadius: 1 },
    colorRing: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    dot: { width: 14, height: 14, borderRadius: 7 },
    info: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    nameText: { fontSize: 13, fontWeight: '500', color: COLORS.black },
    tagBadge: { paddingHorizontal: 9, paddingVertical: 2, borderRadius: 100 },
    tagBadgeText: { fontSize: 10, fontWeight: '500' },
    metaText: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
    countBox: { alignItems: 'flex-end' },
    countVal: { fontSize: 12, fontWeight: '600', color: '#2C2A27' },
    countLabel: { fontSize: 10, color: COLORS.gray, fontWeight: '400', marginTop: 1 },
});
