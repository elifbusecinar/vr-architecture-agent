import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
    red: '#D95555',
    blue: '#3A6FA0',
};

export default function GlobalSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('marble');

    const results = [
        { id: '1', type: 'Materials', title: 'White Marble — Carrara', match: 'MaterialRegistry · 4K · 18 MB · Loaded', iconType: 'mat', colors: ['#F5F0E8', '#E8E0D0'] },
        { id: '2', type: 'Materials', title: 'Grey Marble — Marquina', match: 'MaterialRegistry · 2K · 9 MB · Cached', iconType: 'mat', colors: ['#D8D0C8', '#C0B8B0'] },
        { id: '3', type: 'Annotations', title: 'Annotation #4 — Bathroom', match: '"marble countertop size needs revision"', iconType: 'note', iconBg: 'rgba(217,85,85,0.1)', iconColor: '#D95555' },
        { id: '4', type: 'Annotations', title: 'Annotation #9 — Kitchen', match: '"alternative color suggestion for marble island"', iconType: 'note', iconBg: 'rgba(58,111,160,0.1)', iconColor: '#3A6FA0' },
        { id: '5', type: 'BIM Data', title: 'Floor Spec — BIM Layer 3', match: 'Material: Marble · Zone A · IFC 4.0', iconType: 'bim', iconBg: 'rgba(74,124,89,0.1)', iconColor: '#4A7C59' },
    ];

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.searchBar}>
                        <Svg viewBox="0 0 15 15" width={16} height={16} fill="none"><Circle cx="6.5" cy="6.5" r="4.5" stroke={COLORS.black} strokeWidth="1.3" /><Path d="M10 10l3 3" stroke={COLORS.black} strokeWidth="1.3" strokeLinecap="round" /></Svg>
                        <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Search everything..." />
                        <View style={styles.kbd}><Text style={styles.kbdText}>⌘K</Text></View>
                    </View>
                    <Text style={styles.queryPreview}>Showing results for <Text style={styles.queryHighlight}>{query}</Text> across all content</Text>
                </View>

                <View style={styles.scopes}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scopeScroll}>
                        {['All', 'Projects', 'Notes', 'Tours', 'BIM'].map((s, i) => (
                            <TouchableOpacity key={s} style={[styles.scope, i === 0 && styles.scopeActive]}>
                                <Text style={[styles.scopeText, i === 0 && { color: 'white' }]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView style={styles.results} contentContainerStyle={styles.resultsScroll}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Materials (2)</Text><View style={styles.divider} /></View>
                        {results.filter(r => r.type === 'Materials').map(r => (
                            <View key={r.id} style={styles.item}>
                                <View style={styles.iconBox}>
                                    {r.colors ? (
                                        <View style={[styles.gradientIcon, { backgroundColor: r.colors[0] }]} />
                                    ) : <View style={[styles.icon, { backgroundColor: r.iconBg }]} />}
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.itemTitle}>{r.title}</Text>
                                    <Text style={styles.itemMatch}>{r.match}</Text>
                                </View>
                                <Text style={styles.itemMeta}>Mat.</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Annotations (3)</Text><View style={styles.divider} /></View>
                        {results.filter(r => r.type === 'Annotations').map(r => (
                            <View key={r.id} style={styles.item}>
                                <View style={[styles.icon, { backgroundColor: r.iconBg }]} />
                                <View style={styles.info}>
                                    <Text style={styles.itemTitle}>{r.title}</Text>
                                    <Text style={styles.itemMatch} numberOfLines={1}>{r.match}</Text>
                                </View>
                                <Text style={styles.itemMeta}>Note</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>BIM Data (1)</Text><View style={styles.divider} /></View>
                        {results.filter(r => r.type === 'BIM Data').map(r => (
                            <View key={r.id} style={styles.item}>
                                <View style={[styles.icon, { backgroundColor: r.iconBg }]} />
                                <View style={styles.info}>
                                    <Text style={styles.itemTitle}>{r.title}</Text>
                                    <Text style={styles.itemMatch}>{r.match}</Text>
                                </View>
                                <Text style={styles.itemMeta}>BIM</Text>
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
    header: { padding: 12, paddingBottom: 0 },
    searchBar: { height: 48, backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.black, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16 },
    input: { flex: 1, fontSize: 14, color: COLORS.black, fontWeight: '400' },
    kbd: { backgroundColor: COLORS.creamDark, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 7, borderWidth: 1, borderColor: COLORS.border },
    kbdText: { fontSize: 10, color: COLORS.gray },
    queryPreview: { marginHorizontal: 4, marginTop: 10, fontSize: 12, color: COLORS.gray, flexDirection: 'row', alignItems: 'center', gap: 6 },
    queryHighlight: { color: COLORS.black, fontWeight: '500', backgroundColor: 'rgba(74,124,89,0.1)', paddingHorizontal: 5, borderRadius: 4 },
    scopes: { marginTop: 14 },
    scopeScroll: { paddingHorizontal: 16, gap: 6, paddingBottom: 10 },
    scope: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border },
    scopeActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    scopeText: { fontSize: 11, color: COLORS.black, fontWeight: '500' },
    results: { flex: 1 },
    resultsScroll: { paddingHorizontal: 14, paddingBottom: 40 },
    section: { marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 2 },
    sectionLabel: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1 },
    divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
    item: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 11, paddingHorizontal: 13, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 11 },
    iconBox: { width: 34, height: 34, borderRadius: 9, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
    gradientIcon: { flex: 1 },
    icon: { width: 34, height: 34, borderRadius: 9 },
    info: { flex: 1 },
    itemTitle: { fontSize: 13, fontWeight: '500', color: COLORS.black },
    itemMatch: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
    itemMeta: { fontSize: 10, color: COLORS.grayLight },
});
