import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { projectService, Project } from '../src/services/project.service';
import { signalRService } from '../src/services/signalr.service';
import { notificationService } from '../src/services/notification.service';
import { dashboardService, DashboardStats } from '../src/services/dashboard.service';
import { aiService, AIResponse } from '../src/services/ai.service';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
    cream: '#F0EDE8',
    creamDark: '#E8E4DE',
    black: '#1A1917',
    blackSoft: '#2C2A27',
    gray: '#8A8783',
    grayLight: '#C8C5C0',
    green: '#4A7C59',
    white: '#FAFAF8',
    border: '#D8D4CE',
};

export default function DashboardPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [aiInsights, setAiInsights] = useState<AIResponse | null>(null);

    useEffect(() => {
        if (!isAuthenticated && !user) {
            router.replace('/login');
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardInfo = async () => {
            setLoading(true);
            try {
                const [projRes, statsRes] = await Promise.all([
                    projectService.getAll(),
                    dashboardService.getStats()
                ]);

                if (isMounted) {
                    setProjects(projRes.data || []);
                    setStats(statsRes);
                    setLoading(false);

                    // Setup realtime & notifications
                    await notificationService.requestPermissions();
                    const projectIds = projRes.data?.map(p => p.id) || [];
                    if (projectIds.length > 0) {
                        await signalRService.startConnection(projectIds);
                        const insights = await aiService.getDashboardInsights(projRes.data);
                        if (isMounted) setAiInsights(insights);
                    }
                }
            } catch (err) {
                console.error("Dashboard fetch error", err);
                if (isMounted) setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchDashboardInfo();
        }

        return () => {
            isMounted = false;
            signalRService.stopConnection().catch(() => { });
        };
    }, [isAuthenticated]);

    const STYLING_COLORS = ['#1A1917', '#4A7C59', '#7B6FA0', '#5B8FA8'];

    const STATS_CARDS = [
        { label: 'Active Projects', val: stats?.activeProjects.toString() || projects.length.toString(), sub: 'this month', color: '#4A7C59', iconType: 'projects' },
        { label: 'Storage Used', val: stats?.storageUsed || '0GB', sub: `${100 - (stats?.storagePercent || 0)}% available`, color: '#5B8FA8', iconType: 'storage' },
        { label: 'In Review', val: stats?.inReview.toString() || projects.filter(p => p.status === 'InReview' || p.status === 'Pending').length.toString(), sub: 'awaiting', color: '#C4783A', iconType: 'none' },
        { label: 'VR Sessions', val: stats?.vrSessions.toString() || '0', sub: 'ready', color: '#7B6FA0', iconType: 'none' },
    ];

    if (!user && loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.black} />
            </SafeAreaView>
        );
    }

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                {/* Top Bar */}
                <View style={styles.topbar}>
                    <View style={styles.logoWrap}>
                        <View style={styles.logoIcon}>
                            <Svg viewBox="0 0 14 14" width={12} height={12}>
                                <Path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" />
                            </Svg>
                        </View>
                        <View>
                            <Text style={styles.logoText}>VR Architecture</Text>
                            <Text style={styles.logoSub}>Architect Portal</Text>
                        </View>
                    </View>

                    <View style={styles.topbarRight}>
                        <TouchableOpacity style={styles.iconBtn} onPress={logout}>
                            <Svg viewBox="0 0 16 16" width={16} height={16}>
                                <Path d="M10 3H14a1 1 0 011 1v8a1 1 0 01-1 1h-4M7 11l3-3-3-3M1 8h9" stroke={COLORS.black} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Svg viewBox="0 0 16 16" width={15} height={15}>
                                <Circle cx="7" cy="7" r="5" stroke="#1A1917" strokeWidth="1.3" fill="none" />
                                <Path d="M11 11l3 3" stroke="#1A1917" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Svg viewBox="0 0 16 16" width={15} height={15}>
                                <Path d="M8 1C5.5 1 3.5 3 3.5 5.5V9L2 11h12l-1.5-2V5.5C12.5 3 10.5 1 8 1Z" fill="#1A1917" />
                                <Path d="M6 11v1a2 2 0 004 0v-1" fill="none" stroke="#1A1917" strokeWidth="1.2" />
                            </Svg>
                            <View style={styles.notifDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Today Banner */}
                    <View style={styles.todayBanner}>
                        <View style={styles.todayDot} />
                        <Text style={styles.todayText}>LIVE STATUS</Text>
                        <View style={styles.todayValWrap}>
                            <Text style={styles.todayVal}>{stats?.activeSessions ? `${stats.activeSessions} Active Cloud Sessions` : projects.length > 0 ? `${projects.length} Active Cloud Projects` : 'No active sessions'}</Text>
                        </View>
                    </View>

                    {/* Greeting */}
                    <View style={styles.greetingWrap}>
                        <Text style={styles.greetingMeta}>Architect Dashboard — Feb 2026</Text>
                        <Text style={styles.greetingText}>
                            Good morning, <Text style={styles.greetingTextItalic}>Arch1.</Text>
                        </Text>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        {STATS_CARDS.map((card, i) => (
                            <View key={i} style={styles.statCard}>
                                <View style={styles.statCardLabelRow}>
                                    <Text style={styles.statCardLabel}>{card.label}</Text>
                                    {card.iconType === 'projects' && (
                                        <Svg viewBox="0 0 12 12" width={12} height={12}>
                                            <Path d="M2 2h8v8H2z" fill="none" stroke="#C8C5C0" strokeWidth="1" />
                                            <Path d="M4 4l4 4M8 4l-4 4" stroke="#C8C5C0" strokeWidth="1" />
                                        </Svg>
                                    )}
                                    {card.iconType === 'storage' && (
                                        <Svg viewBox="0 0 12 12" width={12} height={12}>
                                            <Circle cx="6" cy="6" r="4" fill="none" stroke="#C8C5C0" strokeWidth="1" />
                                        </Svg>
                                    )}
                                </View>
                                <Text style={[styles.statCardVal, card.label === 'Storage Used' && { fontSize: 22, paddingTop: 4 }]}>
                                    {card.val}
                                </Text>
                                <View style={styles.statCardSubRow}>
                                    <Text style={styles.subGreen}>●</Text>
                                    <Text style={styles.statCardSubText}>{card.sub}</Text>
                                </View>
                                <View style={[styles.statBgCircle, { backgroundColor: card.color }]} />
                            </View>
                        ))}
                    </View>

                    {/* Projects section */}
                    <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.sectionTitle}>My Projects</Text>
                        <TouchableOpacity onPress={() => router.push('/projects' as any)}>
                            <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 10, color: COLORS.gray, textDecorationLine: 'underline' }}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.projectsList}>
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.black} style={{ marginTop: 20 }} />
                        ) : projects.length === 0 ? (
                            <Text style={{ textAlign: 'center', color: COLORS.gray, padding: 20, fontFamily: 'DMSans_400Regular' }}>No projects available.</Text>
                        ) : (
                            projects.slice(0, 5).map((project, index) => {
                                const dateTxt = new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                return (
                                    <TouchableOpacity key={project.id} style={styles.projectRow} onPress={() => router.push(`/projects/${project.id}` as any)}>
                                        <View style={[styles.projectIcon, { backgroundColor: STYLING_COLORS[index % STYLING_COLORS.length] }]}>
                                            <Svg viewBox="0 0 16 16" width={16} height={16}>
                                                <Path d="M2 14V6l6-4 6 4v8H2Z" fill="none" stroke="white" strokeWidth="1.2" />
                                                <Rect x="5" y="10" width="3" height="4" fill="white" opacity="0.7" />
                                            </Svg>
                                        </View>
                                        <View style={styles.projectInfo}>
                                            <Text style={styles.projectName}>{project.title}</Text>
                                            <Text style={styles.projectClient}>Client: {project.clientName || 'N/A'}</Text>
                                        </View>
                                        <View style={styles.projectRight}>
                                            <View style={[styles.projectStatusBadge, project.status === 'Active' ? styles.statusActive : styles.statusReview]}>
                                                <Text style={project.status === 'Active' ? styles.statusActiveText : styles.statusReviewText}>{project.status}</Text>
                                            </View>
                                            <Text style={styles.projectDate}>{dateTxt}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                    {/* AI Insights section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>AI FEEDBACK</Text>
                        <TouchableOpacity onPress={() => router.push('/ai-assistant' as any)}>
                            <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 10, color: COLORS.green, textDecorationLine: 'underline' }}>ASK ASSISTANT →</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/ai-assistant' as any)}>
                        <View style={styles.aiBadge}>
                            <Text style={styles.aiBadgeText}>AI INSIGHT</Text>
                        </View>
                        <Text style={styles.aiMessage}>{aiInsights?.message || 'Analyzing project metadata for potential risks...'}</Text>
                        <View style={styles.aiSuggestions}>
                            {(aiInsights?.suggestions || ['Verify structural BIM compliance', 'Update client on recent annotations']).map((s: string, i: number) => (
                                <View key={i} style={styles.aiSuggestion}>
                                    <Text style={styles.aiSuggestionText}>• {s}</Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>

                    {/* Bottom Cards */}
                    <View style={styles.bottomGrid}>
                        <View style={styles.bottomCard}>
                            <View style={styles.bottomCardTitleRow}>
                                <Text style={styles.bottomCardTitle}>Recent Activity</Text>
                                <Text style={styles.bottomCardTitleClear}>Clear</Text>
                            </View>
                            <Text style={styles.noActivity}>No recent activity</Text>
                        </View>
                        <View style={styles.bottomCard}>
                            <View style={styles.bottomCardTitleRow}>
                                <Text style={styles.bottomCardTitle}>This Week</Text>
                                <Text style={styles.bottomCardTitleClear}>capacity</Text>
                            </View>
                            <View style={styles.weekStats}>
                                <View style={styles.weekRow}>
                                    <Text style={styles.weekLabel}>hours</Text>
                                    <Text style={styles.weekVal}>—</Text>
                                </View>
                                <View style={styles.weekRow}>
                                    <Text style={styles.weekLabel}>projects</Text>
                                    <Text style={styles.weekVal}>0</Text>
                                </View>
                                <View style={styles.weekRow}>
                                    <Text style={styles.weekLabel}>sessions</Text>
                                    <Text style={styles.weekVal}>0</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Space for absolute Bottom Nav */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Nav */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => { }}>
                        <Svg viewBox="0 0 20 20" width={20} height={20}>
                            <Path d="M3 10L10 3l7 7v7H13v-4H7v4H3V10Z" fill={COLORS.black} />
                        </Svg>
                        <Text style={[styles.navItemText, styles.navItemTextActive]}>Overview</Text>
                        <View style={styles.navItemDot} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/projects')}>
                        <Svg viewBox="0 0 20 20" width={18} height={18}>
                            <Rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke={COLORS.grayLight} strokeWidth="1.4" />
                            <Path d="M7 4v12M13 4v12M2 10h16" stroke={COLORS.grayLight} strokeWidth="1.2" />
                        </Svg>
                        <Text style={styles.navItemText}>Projects</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/ai-assistant')}>
                        <Svg viewBox="0 0 20 20" width={20} height={20}>
                            <Path d="M18 13a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" fill="none" stroke={COLORS.grayLight} strokeWidth="1.4" />
                        </Svg>
                        <Text style={styles.navItemText}>AI</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/clients')}>
                        <Svg viewBox="0 0 20 20" width={20} height={20}>
                            <Circle cx="10" cy="7" r="3" fill="none" stroke={COLORS.grayLight} strokeWidth="1.4" />
                            <Path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={COLORS.grayLight} strokeWidth="1.4" strokeLinecap="round" fill="none" />
                        </Svg>
                        <Text style={styles.navItemText}>Clients</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    /* Topbar */
    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        height: 52,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.cream,
    },
    logoWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    logoIcon: {
        width: 26,
        height: 26,
        backgroundColor: COLORS.black,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.black,
    },
    logoSub: {
        fontSize: 10,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
    },
    topbarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        width: 34,
        height: 34,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 7,
        height: 7,
        backgroundColor: '#D95555',
        borderRadius: 3.5,
        borderWidth: 1.5,
        borderColor: COLORS.cream,
    },
    newBtn: {
        backgroundColor: COLORS.black,
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 34,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    newBtnText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'DMSans_500Medium',
    },
    /* Today Banner */
    todayBanner: {
        marginHorizontal: 14,
        marginTop: 10,
        backgroundColor: COLORS.black,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    todayDot: {
        width: 7,
        height: 7,
        backgroundColor: '#D95555',
        borderRadius: 3.5,
    },
    todayText: {
        fontSize: 11,
        fontFamily: 'DMSans_500Medium',
        color: '#888',
    },
    todayValWrap: {
        backgroundColor: '#333',
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 7,
    },
    todayVal: {
        fontSize: 11,
        fontFamily: 'DMSans_400Regular',
        color: '#888',
    },
    /* Greeting */
    greetingWrap: {
        paddingHorizontal: 18,
        paddingTop: 6,
    },
    greetingMeta: {
        fontSize: 10,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    greetingText: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 32,
        color: COLORS.black,
        letterSpacing: -0.5,
        lineHeight: 36,
        marginTop: 6,
    },
    greetingTextItalic: {
        fontFamily: 'PlayfairDisplay_400Regular_Italic',
        color: COLORS.gray,
    },
    /* Stats Grid */
    statsGrid: {
        paddingTop: 14,
        paddingHorizontal: 14,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        width: '48.5%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    statCardLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statCardLabel: {
        fontSize: 11,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.gray,
        letterSpacing: 0.2,
    },
    statCardVal: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 34,
        color: COLORS.black,
        lineHeight: 36,
    },
    statCardSubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        zIndex: 2,
    },
    subGreen: {
        color: COLORS.green,
        fontSize: 10,
        fontWeight: '700',
    },
    statCardSubText: {
        fontSize: 10,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.gray,
    },
    statBgCircle: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        width: 60,
        height: 60,
        borderRadius: 30,
        opacity: 0.08,
        zIndex: 1,
    },
    /* Projects Section */
    sectionHeader: {
        paddingTop: 16,
        paddingHorizontal: 18,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.black,
        letterSpacing: -0.1,
    },
    sectionMeta: {
        fontSize: 11,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
    },
    projectsList: {
        paddingHorizontal: 14,
    },
    projectRow: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
    },
    projectIcon: {
        width: 36,
        height: 36,
        backgroundColor: COLORS.black,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectInfo: {
        flex: 1,
    },
    projectName: {
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.black,
        letterSpacing: -0.1,
    },
    projectClient: {
        fontSize: 11,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
        marginTop: 2,
    },
    projectRight: {
        alignItems: 'flex-end',
    },
    projectStatusBadge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 100,
    },
    statusActive: {
        backgroundColor: '#E8F2EC',
    },
    statusActiveText: {
        fontSize: 10,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.green,
    },
    statusReview: {
        backgroundColor: '#FEF3CD',
    },
    statusReviewText: {
        fontSize: 10,
        fontFamily: 'DMSans_500Medium',
        color: '#B8831A',
    },
    projectDate: {
        fontSize: 10,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
        marginTop: 4,
    },
    /* Bottom Grid */
    bottomGrid: {
        paddingTop: 4,
        paddingHorizontal: 14,
        paddingBottom: 20,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
    },
    bottomCard: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        width: '48.5%',
    },
    bottomCardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bottomCardTitle: {
        fontSize: 11,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.black,
    },
    bottomCardTitleClear: {
        fontSize: 10,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.grayLight,
    },
    noActivity: {
        fontSize: 11,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.grayLight,
        textAlign: 'center',
        paddingVertical: 10,
    },
    weekStats: {
        gap: 6,
    },
    weekRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weekLabel: {
        fontSize: 10,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
    },
    weekVal: {
        fontSize: 14,
        fontFamily: 'DMSans_700Bold',
        color: COLORS.black,
    },
    /* Bottom Nav */
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 84,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 12,
        paddingBottom: 20,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
    },
    navItemText: {
        fontSize: 9,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.grayLight,
        letterSpacing: 0.3,
    },
    navItemTextActive: {
        color: COLORS.black,
        fontFamily: 'DMSans_500Medium',
    },
    navItemDot: {
        width: 4,
        height: 4,
        backgroundColor: COLORS.black,
        borderRadius: 2,
        marginTop: 1,
    },
    /* AI Card Styles */
    aiCard: {
        marginHorizontal: 14,
        marginBottom: 16,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    aiBadge: {
        backgroundColor: 'rgba(74, 124, 89, 0.1)',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    aiBadgeText: {
        fontSize: 9,
        fontFamily: 'DMSans_700Bold',
        color: COLORS.green,
        letterSpacing: 0.5,
    },
    aiMessage: {
        fontSize: 14,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.black,
        lineHeight: 20,
    },
    aiSuggestions: {
        marginTop: 12,
        gap: 6,
    },
    aiSuggestion: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiSuggestionText: {
        fontSize: 12,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.gray,
    },
});
