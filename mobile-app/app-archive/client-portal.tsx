import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { Card } from '../src/components/UI/Card';
import { Badge } from '../src/components/UI/Badge';
import { ScreenTransition } from '../src/components/ScreenTransition';

export default function ClientPortalPage() {
    const router = useRouter();
    const [comment, setComment] = useState('The wardrobe in the Master Suite feels a bit narrow. Can we increase the depth by 15cm? I\'d love to see a marble finish on the bathroom counter as well.');

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.portalLabel}>CLIENT PORTAL</Text>
                    <Text style={styles.greeting}>Hello, <Text style={styles.greetingItalic}>Sarah.</Text></Text>
                    <Text style={styles.subtext}>Riverside Penthouse · Review & Comment</Text>

                    <Card variant="dark" style={styles.projectCard}>
                        <View style={styles.projIcon}>
                            <Svg viewBox="0 0 18 18" width={20} height={20}>
                                <Path d="M2 16V8l7-5 7 5v8H2Z" stroke="white" strokeWidth="1.2" fill="none" />
                                <Rect x="6" y="12" width="3" height="4" fill="white" opacity="0.7" />
                            </Svg>
                        </View>
                        <View style={styles.projInfo}>
                            <Text style={styles.projName}>Riverside Penthouse</Text>
                            <Text style={styles.projMeta}>Arch1 · Floor 3 · v2.4 · Updated today</Text>
                        </View>
                        <Badge label="Active" variant="green" dark showDot={false} />
                    </Card>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Approval Banner */}
                    <View style={styles.approveBanner}>
                        <Text style={styles.approveTitle}>Ready for your approval ✓</Text>
                        <Text style={styles.approveSub}>
                            Arch1 has completed the Master Suite and living room and is requesting your sign-off before proceeding.
                        </Text>
                        <View style={styles.approveBtns}>
                            <Button
                                title="Approve design"
                                variant="green"
                                style={{ flex: 1 }}
                                onPress={() => router.push('/client-approval')}
                            />
                            <Button
                                title="Add comment"
                                variant="secondary"
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Rooms to review</Text>

                    <TouchableOpacity style={styles.roomItem}>
                        <View style={[styles.roomThumb, { backgroundColor: '#C8B89A' }]} />
                        <View style={styles.roomInfo}>
                            <Text style={styles.roomName}>Master Suite</Text>
                            <Text style={styles.roomMeta}>7 views · 2 architect notes</Text>
                        </View>
                        <Text style={styles.reaction}>❤️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.roomItem}>
                        <View style={[styles.roomThumb, { backgroundColor: '#B0C8D8' }]} />
                        <View style={styles.roomInfo}>
                            <Text style={styles.roomName}>Living Room</Text>
                            <Text style={styles.roomMeta}>4 views · 1 architect note</Text>
                        </View>
                        <Text style={styles.reaction}>🤔</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.roomItem}>
                        <View style={[styles.roomThumb, { backgroundColor: '#D8C8A8' }]} />
                        <View style={styles.roomInfo}>
                            <Text style={styles.roomName}>Kitchen</Text>
                            <Text style={styles.roomMeta}>3 views · Ready for review</Text>
                        </View>
                        <Text style={[styles.reaction, { opacity: 0.3 }]}>—</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Your comments</Text>
                    <View style={styles.commentBox}>
                        <TextInput
                            style={styles.commentInput}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            placeholder="Share your thoughts…"
                        />
                        <View style={styles.commentFooter}>
                            <View style={styles.commentRoom}>
                                <Svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <Path d="M5.5.5l5 3v5l-5 2.5L.5 8.5v-5l5-3z" stroke={COLORS.gray} strokeWidth=".8" />
                                </Svg>
                                <Text style={styles.commentRoomText}>Master Suite</Text>
                            </View>
                            <Button title="Send →" variant="primary" size="sm" />
                        </View>
                    </View>

                    {/* VR Invite */}
                    <Card variant="feature" style={styles.vrCard}>
                        <View style={styles.vrIcon}>
                            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <Rect x="1" y="5" width="14" height="8" rx="1.5" stroke="white" strokeWidth="1.2" />
                                <Path d="M5 5V4a3 3 0 016 0v1" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
                                <Circle cx="5.5" cy="9" r="1.2" fill="white" />
                                <Circle cx="10.5" cy="9" r="1.2" fill="white" />
                            </Svg>
                        </View>
                        <View style={styles.vrText}>
                            <Text style={styles.vrTitle}>Try VR walkthrough</Text>
                            <Text style={styles.vrSub}>Arch1 set up a Meta Quest 3 for you</Text>
                        </View>
                        <Text style={styles.vrArrow}>›</Text>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    header: {
        backgroundColor: COLORS.soft,
        paddingTop: 52,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    portalLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 8,
        fontFamily: 'DMSans_500Medium',
    },
    greeting: {
        fontSize: 22,
        color: COLORS.white,
        fontFamily: 'PlayfairDisplay_400Regular',
        marginBottom: 4,
    },
    greetingItalic: {
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.4)',
    },
    subtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
        fontFamily: 'DMSans_400Regular',
    },
    projectCard: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    projIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    projInfo: {
        flex: 1,
        marginLeft: 12,
    },
    projName: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.white,
        fontFamily: 'DMSans_500Medium',
    },
    projMeta: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 1,
        fontFamily: 'DMSans_400Regular',
    },
    content: {
        flex: 1,
    },
    approveBanner: {
        margin: 14,
        backgroundColor: 'rgba(74, 124, 89, 0.08)',
        borderColor: 'rgba(74, 124, 89, 0.3)',
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 16,
    },
    approveTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.black,
        marginBottom: 4,
    },
    approveSub: {
        fontSize: 12,
        color: COLORS.gray,
        marginBottom: 12,
        lineHeight: 18,
    },
    approveBtns: {
        flexDirection: 'row',
        gap: 8,
    },
    sectionTitle: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.black,
    },
    roomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        marginHorizontal: 14,
        marginBottom: 8,
        padding: 12,
    },
    roomThumb: {
        width: 52,
        height: 40,
        borderRadius: 8,
    },
    roomInfo: {
        flex: 1,
        marginLeft: 12,
    },
    roomName: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.black,
    },
    roomMeta: {
        fontSize: 11,
        color: COLORS.gray,
        marginTop: 2,
    },
    reaction: {
        fontSize: 18,
    },
    commentBox: {
        marginHorizontal: 14,
        marginBottom: 14,
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 12,
    },
    commentInput: {
        fontSize: 13,
        color: COLORS.black,
        lineHeight: 18,
        height: 60,
        textAlignVertical: 'top',
    },
    commentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    commentRoom: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    commentRoomText: {
        fontSize: 11,
        color: COLORS.gray,
    },
    vrCard: {
        marginHorizontal: 14,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vrIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vrText: {
        flex: 1,
        marginLeft: 12,
    },
    vrTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.white,
    },
    vrSub: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 1,
    },
    vrArrow: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.5)',
    }
});
