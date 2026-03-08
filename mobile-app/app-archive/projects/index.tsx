import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { projectService, Project } from '../../src/services/project.service';
import { useAuth } from '../../src/context/AuthContext';
import { ScreenTransition } from '../../src/components/ScreenTransition';

const COLORS = {
    cream: '#F0EDE8',
    black: '#1A1917',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    border: '#D8D4CE',
    white: '#FFFFFF',
    blue: '#3A6FA0',
    amber: '#C4783A',
};

const STYLING_COLORS = ['#1A1917', '#4A7C59', '#7B6FA0', '#5B8FA8'];

export default function ProjectsListPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await projectService.getAll();
            setProjects(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await projectService.getAll();
            setProjects(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchProjects();
    }, [isAuthenticated]);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item, index }: { item: Project; index: number }) => {
        const dateTxt = new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const statusColor = item.status === 'Active' ? COLORS.green : item.status === 'InReview' ? COLORS.amber : COLORS.gray;

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.projectCard}
                onPress={() => router.push(`/projects/${item.id}` as any)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.nameRow}>
                        <Text style={styles.projectName}>{item.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                            <Text style={[styles.statusText, { color: statusColor }]}>● {item.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.clientName}>{item.clientName || 'Private Client'}</Text>
                </View>

                <View style={styles.cardInfo}>
                    <View style={styles.stat}>
                        <Svg width="12" height="12" viewBox="0 0 14 14" fill="none"><Path d="M2 4.5V11a1 1 0 001 1h8a1 1 0 001-1V4.5M2 4.5l5-3 5 3M2 4.5h10M4 12V6M10 12V6" stroke={COLORS.gray} strokeWidth="1.1" /></Svg>
                        <Text style={styles.statVal}>BIM Ready</Text>
                    </View>
                    <View style={styles.stat}>
                        <Svg width="12" height="12" viewBox="0 0 14 14" fill="none"><Circle cx="7" cy="7" r="5" stroke={COLORS.gray} strokeWidth="1.1" /><Path d="M7 3.5V7l2 1" stroke={COLORS.gray} strokeLinecap="round" /></Svg>
                        <Text style={styles.statVal}>{dateTxt}</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.teamAvatars}>
                        {[1, 2, 3].map(i => <View key={i} style={[styles.avatar, { backgroundColor: STYLING_COLORS[i % 4], marginLeft: i === 1 ? 0 : -8 }]} />)}
                        <View style={[styles.avatar, styles.avatarMore]}><Text style={styles.moreText}>+2</Text></View>
                    </View>
                    <Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M5 3l4 4-4 4" stroke={COLORS.grayLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.topRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Svg width="20" height="20" viewBox="0 0 20 20"><Path d="M12 4L6 10l6 6" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>PROJECTS</Text>
                        <TouchableOpacity style={styles.addBtn}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M7 2v10M2 7h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" /></Svg></TouchableOpacity>
                    </View>

                    <View style={styles.searchWrap}>
                        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none"><Circle cx="6" cy="6" r="4.5" stroke={COLORS.gray} strokeWidth="1.2" /><Path d="M9.5 9.5L13 13" stroke={COLORS.gray} strokeWidth="1.2" strokeLinecap="round" /></Svg>
                        <TextInput
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search projects..."
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={COLORS.black} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredProjects}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listScroll}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.black} />
                        }
                        ListHeaderComponent={() => (
                            <View style={styles.filters}>
                                {['All', 'Active', 'Review', 'Approved'].map((f, i) => (
                                    <TouchableOpacity key={f} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
                                        <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No projects found matching your search.</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    headerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1 },
    addBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center' },
    backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    searchWrap: { height: 40, backgroundColor: COLORS.cream, borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10 },
    searchInput: { flex: 1, fontSize: 13, color: COLORS.black },
    listScroll: { padding: 16, paddingBottom: 40 },
    filters: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
    filterChipActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    filterText: { fontSize: 11, fontWeight: '500', color: COLORS.gray },
    filterTextActive: { color: 'white' },
    projectCard: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
    cardHeader: { marginBottom: 14 },
    nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    projectName: { fontSize: 15, fontWeight: '600', color: COLORS.black },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    statusText: { fontSize: 10, fontWeight: '600' },
    clientName: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
    cardInfo: { flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)', paddingBottom: 14, marginBottom: 12 },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statVal: { fontSize: 11, color: COLORS.gray },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    teamAvatars: { flexDirection: 'row' },
    avatar: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'white' },
    avatarMore: { backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
    moreText: { fontSize: 8, fontWeight: '700', color: COLORS.gray },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { paddingTop: 60, alignItems: 'center' },
    emptyText: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: COLORS.gray },
});
