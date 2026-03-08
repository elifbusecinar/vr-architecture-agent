import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
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

const INITIAL_MATERIALS = [
    { id: '1', name: 'Carrara Marble', category: 'Stone', meta: 'Stone · PBR · Unity Registry', tags: ['4K', 'Normal map', 'Roughness'], size: '18 MB', res: '4096×4096', status: 'Loaded', colors: ['#F5F0E8', '#E8E0D0', '#C8C0A8'] },
    { id: '2', name: 'Oak Wood — Dark', category: 'Wood', meta: 'Wood · PBR · Tileable', tags: ['4K', 'AO map'], size: '12 MB', res: '4096×4096', status: 'Loaded', colors: ['#8A7060', '#6A5040', '#4A3020'] },
    { id: '3', name: 'Venetian Plaster', category: 'Fabric', meta: 'Plaster · PBR · Interior', tags: ['2K', 'Emission'], size: '6 MB', res: '2048×2048', status: 'Cached', colors: ['#D0C8C0', '#B8B0A8', 'rgba(160,152,144,0.5)'] },
    { id: '4', name: 'Brushed Steel', category: 'Metal', meta: 'Metal · PBR · Metallic', tags: ['4K', 'Metallic'], size: '15 MB', res: '4096×4096', status: 'Missing', colors: ['#909090', '#606060', '#303030'] },
    { id: '5', name: 'Clear Glass', category: 'Glass', meta: 'Glass · PBR · Transparent', tags: ['Refraction', 'IOR'], size: '4 MB', res: '1024×1024', status: 'Loaded', colors: ['rgba(200,220,240,0.5)', 'rgba(180,200,220,0.3)'] },
];

export default function MaterialBrowser() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [materials, setMaterials] = useState(INITIAL_MATERIALS);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/zip', 'application/x-zip-compressed'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                const newMaterial = {
                    id: Math.random().toString(),
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    category: 'Imported',
                    meta: `Custom · ${file.mimeType || 'Asset'} · Locally Loaded`,
                    tags: ['Local', 'Imported'],
                    size: `${(file.size || 0 / 1024 / 1024).toFixed(1)} MB`,
                    res: 'Original',
                    status: 'Loaded',
                    colors: ['#A0A0A0', '#808080']
                };
                setMaterials([newMaterial, ...materials]);
            }
        } catch (err) {
            console.error('Pick error', err);
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            // Simulate adding a newly synced material
            const syncedMat = { id: 's1', name: 'Polished Concrete', category: 'Stone', meta: 'Stone · Cloud · Sycned', tags: ['8K', 'V-Ray'], size: '44 MB', res: '8192×8192', status: 'Loaded', colors: ['#D0D0D0', '#B0B0B0'] };
            setMaterials(prev => prev.some(m => m.id === 's1') ? prev : [syncedMat, ...prev]);
        }, 1200);
    };

    const filtered = materials.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || m.category === category || (category === 'Stone' && m.category === 'Imported');
        return matchesSearch && matchesCategory;
    });

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Svg width="16" height="16" viewBox="0 0 16 16"><Path d="M10 3L5 8l5 5" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                        <Text style={styles.backText}>Dashboard</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Architectural Registry</Text>
                    <TouchableOpacity onPress={handleSync} disabled={isSyncing}>
                        <Text style={[styles.syncText, isSyncing && { opacity: 0.5 }]}>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchRow}>
                    <View style={styles.searchBar}>
                        <Svg viewBox="0 0 15 15" width={15} height={15} fill="none"><Circle cx="6.5" cy="6.5" r="4.5" stroke={COLORS.gray} strokeWidth="1.3" /><Path d="M10 10l3 3" stroke={COLORS.gray} strokeWidth="1.3" strokeLinecap="round" /></Svg>
                        <TextInput style={styles.input} value={search} onChangeText={setSearch} placeholder="Search materials..." placeholderTextColor={COLORS.grayLight} />
                        {search !== '' && (
                            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}><Svg width="10" height="10" viewBox="0 0 10 10"><Path d="M2 2l6 6M8 2l-6 6" stroke="white" strokeWidth="1.3" strokeLinecap="round" /></Svg></TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleImport} style={styles.importBtn}>
                            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></Svg>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {['All', 'Stone', 'Wood', 'Metal', 'Fabric', 'Glass'].map((cat) => (
                            <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.filterChip, category === cat && styles.filterChipActive]}>
                                <Text style={[styles.filterText, category === cat && styles.filterTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}><Text style={styles.statVal}>{filtered.filter(m => m.status === 'Loaded').length}</Text><Text style={styles.statLabel}>Loaded</Text></View>
                    <View style={styles.statBox}><Text style={styles.statVal}>{(filtered.reduce((acc, current) => acc + parseFloat(current.size), 0)).toFixed(1)}GB</Text><Text style={styles.statLabel}>Size</Text></View>
                    <View style={styles.statBox}><Text style={[styles.statVal, { color: COLORS.red }]}>{filtered.filter(m => m.status === 'Missing').length}</Text><Text style={styles.statLabel}>Issues</Text></View>
                </View>

                <ScrollView style={styles.list} contentContainerStyle={styles.listScroll}>
                    {filtered.map(item => (
                        <View key={item.id} style={styles.item}>
                            <View style={[styles.swatch, { backgroundColor: item.colors[0] }]}>
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMeta}>{item.meta}</Text>
                                <View style={styles.tagRow}>
                                    {item.tags.map(tag => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}
                                </View>
                            </View>
                            <View style={item.status === 'Loaded' ? styles.itemRight : styles.itemRight}>
                                <Text style={styles.itemSize}>{item.size}</Text>
                                <Text style={styles.itemRes}>{item.res}</Text>
                                <View style={[styles.statusBadge, item.status === 'Loaded' ? styles.statusLoaded : item.status === 'Cached' ? styles.statusCached : styles.statusMissing]}>
                                    <Text style={[styles.statusText, item.status === 'Loaded' ? { color: COLORS.green } : item.status === 'Cached' ? { color: COLORS.blue } : { color: COLORS.red }]}>
                                        {item.status === 'Loaded' ? '● Loaded' : item.status === 'Cached' ? '○ Cached' : '✕ Missing'}
                                    </Text>
                                </View>
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
    headerTitle: { fontSize: 18, fontFamily: 'PlayfairDisplay_400Regular', color: COLORS.black, letterSpacing: -0.5 },
    syncText: { fontSize: 12, color: COLORS.green, fontFamily: 'DMSans_700Bold' },
    searchRow: { padding: 10, paddingHorizontal: 14 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, height: 40, paddingHorizontal: 12, gap: 9 },
    input: { flex: 1, fontSize: 13, color: COLORS.black },
    importBtn: { width: 32, height: 32, backgroundColor: COLORS.black, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
    clearBtn: { width: 18, height: 18, backgroundColor: COLORS.black, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
    filterRow: { height: 44 },
    filterScroll: { paddingHorizontal: 14, gap: 6 },
    filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, height: 28 },
    filterChipActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    filterText: { fontSize: 11, fontWeight: '500', color: '#2C2A27' },
    filterTextActive: { color: 'white' },
    statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 10 },
    statBox: { flex: 1, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 10, alignItems: 'center' },
    statVal: { fontSize: 18, fontWeight: '600', color: COLORS.black },
    statLabel: { fontSize: 10, color: COLORS.gray, marginTop: 3 },
    list: { flex: 1 },
    listScroll: { paddingHorizontal: 14, paddingBottom: 40, paddingTop: 6 },
    item: {
        backgroundColor: 'white',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 14,
        flexDirection: 'row',
        gap: 14,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    swatch: { width: 48, height: 48, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 14, fontFamily: 'DMSans_700Bold', color: COLORS.black },
    itemMeta: { fontSize: 11, fontFamily: 'DMSans_400Regular', color: COLORS.gray, marginTop: 2 },
    tagRow: { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
    tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, backgroundColor: COLORS.cream },
    tagText: { fontSize: 9, fontFamily: 'DMSans_700Bold', color: COLORS.gray },
    itemRight: { alignItems: 'flex-end' },
    itemSize: { fontSize: 12, fontFamily: 'DMSans_700Bold', color: COLORS.black },
    itemRes: { fontSize: 10, fontFamily: 'DMSans_400Regular', color: COLORS.gray, marginTop: 2 },
    statusBadge: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
    statusLoaded: { backgroundColor: 'rgba(74,124,89,0.06)' },
    statusCached: { backgroundColor: 'rgba(58,111,160,0.06)' },
    statusMissing: { backgroundColor: 'rgba(217,85,85,0.06)' },
    statusText: { fontSize: 9, fontFamily: 'DMSans_700Bold', textTransform: 'uppercase' },
});
