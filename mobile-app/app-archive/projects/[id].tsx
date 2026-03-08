import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { projectService } from '../../src/services/project.service';
import { useAuth } from '../../src/context/AuthContext';
import { ScreenTransition } from '../../src/components/ScreenTransition';

const COLORS = {
    cream: '#F0EDE8',
    black: '#1A1917',
    gray: '#8A8783',
    green: '#4A7C59',
    border: '#D8D4CE',
};

export default function ProjectDetailPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && !user) {
            router.replace('/login');
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                const data = await projectService.getDetail(id as string);
                setProject(data);
            } catch (e) {
                console.error("Failed to fetch project detail", e);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && id) {
            fetchProject();
        }
    }, [id, isAuthenticated]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.black} />
            </SafeAreaView>
        );
    }

    if (!project) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontFamily: 'DMSans_400Regular', color: COLORS.gray }}>Project could not be found.</Text>
                <TouchableOpacity
                    style={{ marginTop: 16, backgroundColor: COLORS.black, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
                    onPress={() => router.back()}
                >
                    <Text style={{ color: 'white', fontFamily: 'DMSans_500Medium' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <ScreenTransition type="slide">
            <View style={styles.container}>
                {/* Header section with black bg */}
                <View style={styles.darkHeader}>
                    <View style={styles.topbar}>
                        <TouchableOpacity style={styles.backBtnHeader} onPress={() => router.back()}>
                            <Svg viewBox="0 0 16 16" width={16} height={16}>
                                <Path d="M10 3L4 8l6 5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </Svg>
                            <Text style={styles.backTextHeader}>Projects</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuBtn}>
                            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>···</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerContent}>
                        <Text style={styles.title}>
                            {project.title.split(' ')[0]}{'\n'}
                            <Text style={styles.titleItalic}>{project.title.split(' ').slice(1).join(' ')}</Text>
                        </Text>
                        <Text style={styles.client}>
                            {project.clientName || 'Jensen & Co'} · {project.category || 'Floor 3'} · Last updated 2h ago
                        </Text>

                        <View style={styles.chipsRow}>
                            <View style={[styles.chip, styles.activeChip]}>
                                <Text style={styles.activeChipText}>{project.status}</Text>
                            </View>
                            <View style={styles.chip}>
                                <Text style={styles.chipText}>v2.4</Text>
                            </View>
                            <View style={styles.chip}>
                                <Text style={styles.chipText}>4 members</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Start VR Session Button */}
                    <TouchableOpacity style={styles.sessionBtn} onPress={() => router.push(`/projects/${project.id}/viewer` as any)}>
                        <View style={styles.sessionIcon}>
                            <Svg viewBox="0 0 20 20" width={18} height={18}>
                                <Rect x="1" y="6" width="18" height="10" rx="2" fill="white" />
                                <Path d="M7 6V4a3 3 0 016 0v2" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                            </Svg>
                        </View>
                        <View style={styles.sessionTextWrap}>
                            <Text style={styles.sessionTitle}>Start VR Session</Text>
                            <Text style={styles.sessionSub}>Meta Quest 3 ready · 2 online</Text>
                        </View>
                        <Text style={styles.sessionArrow}>›</Text>
                    </TouchableOpacity>

                    {/* Metrics */}
                    <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>28</Text>
                            <Text style={styles.metricLabel}>Sessions</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>7</Text>
                            <Text style={styles.metricLabel}>Open notes</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>94%</Text>
                            <Text style={styles.metricLabel}>Approved</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Recent annotations</Text>

                    {project.waypoints && project.waypoints.length > 0 ? (
                        project.waypoints.map((wp: any, i: number) => (
                            <TouchableOpacity key={wp.id} style={styles.annotRow}>
                                <View style={[styles.annotNum, { backgroundColor: i % 2 === 0 ? COLORS.green : '#C4783A' }]}>
                                    <Text style={styles.annotNumText}>{String.fromCharCode(65 + i)}</Text>
                                </View>
                                <View style={styles.annotInfo}>
                                    <Text style={styles.annotTitle}>{wp.title}</Text>
                                    <Text style={styles.annotMeta}>{wp.description || 'Master Suite · Arch1 · Pend.'}</Text>
                                </View>
                                <Text style={styles.annotTime}>{2 + i}h</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No annotations recorded yet.</Text>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    darkHeader: {
        backgroundColor: COLORS.black,
        paddingTop: 52,
        paddingBottom: 24,
    },
    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    backBtnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    backTextHeader: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
    },
    menuBtn: {
        padding: 4,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 28,
        color: 'white',
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    titleItalic: {
        fontFamily: 'PlayfairDisplay_400Regular_Italic',
        color: 'rgba(255,255,255,0.5)',
    },
    client: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 6,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 14,
    },
    chip: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 100,
    },
    activeChip: {
        backgroundColor: COLORS.green,
        borderColor: COLORS.green,
    },
    chipText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontFamily: 'DMSans_500Medium',
    },
    activeChipText: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'DMSans_500Medium',
    },
    scrollContent: {
        paddingHorizontal: 0,
    },
    sessionBtn: {
        margin: 16,
        backgroundColor: COLORS.green,
        borderRadius: 18,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        shadowColor: COLORS.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    sessionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sessionTextWrap: {
        flex: 1,
    },
    sessionTitle: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'DMSans_700Bold',
    },
    sessionSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontFamily: 'DMSans_400Regular',
        marginTop: 2,
    },
    sessionArrow: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 22,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        gap: 8,
        marginBottom: 20,
    },
    metricItem: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    metricVal: {
        fontFamily: 'DMSans_700Bold',
        fontSize: 20,
        color: COLORS.black,
    },
    metricLabel: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 10,
        color: COLORS.gray,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        paddingHorizontal: 20,
        fontSize: 13,
        fontFamily: 'DMSans_700Bold',
        color: COLORS.black,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    annotRow: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        marginHorizontal: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    annotNum: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    annotNumText: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'DMSans_700Bold',
    },
    annotInfo: {
        flex: 1,
    },
    annotTitle: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 13,
        color: COLORS.black,
    },
    annotMeta: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 11,
        color: COLORS.gray,
        marginTop: 2,
    },
    annotTime: {
        fontSize: 10,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
    },
    emptyText: {
        paddingHorizontal: 20,
        color: COLORS.gray,
        fontStyle: 'italic',
        fontSize: 12,
    }
});
