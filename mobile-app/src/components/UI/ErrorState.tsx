import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/Theme';
import { Button } from './Button';
import { ScreenTransition } from '../ScreenTransition';

export type ErrorVariant = '404' | 'timeout' | 'model-failed' | 'offline';

interface ErrorStateProps {
    variant: ErrorVariant;
    title?: string;
    description?: string;
    onPrimaryAction?: () => void;
    primaryActionLabel?: string;
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
    errorCode?: string;
    dark?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    variant,
    title,
    description,
    onPrimaryAction,
    primaryActionLabel,
    onSecondaryAction,
    secondaryActionLabel,
    errorCode,
    dark = false,
}) => {
    const renderIcon = () => {
        const iconColor = dark ? COLORS.white : COLORS.black;
        const iconSecondary = dark ? 'rgba(255,255,255,0.25)' : COLORS.grayLight;

        switch (variant) {
            case '404':
                return (
                    <View style={styles.iconContainer}>
                        <Text style={[styles.errorCode, { color: iconColor }]}>
                            4<Text style={{ color: iconSecondary, fontStyle: 'italic' }}>0</Text>4
                        </Text>
                    </View>
                );
            case 'timeout':
                return (
                    <View style={styles.iconContainer}>
                        <View style={styles.timeoutRing}>
                            <Svg width={80} height={80} viewBox="0 0 80 80">
                                <Circle cx="40" cy="40" r="34" stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} strokeWidth="4" fill="none" />
                                <Circle cx="40" cy="40" r="34" stroke={COLORS.amber} strokeWidth="4" fill="none" strokeDasharray="213" strokeDashoffset="80" strokeLinecap="round" transform="rotate(-90 40 40)" />
                            </Svg>
                            <Text style={[styles.timeoutText, { color: iconColor }]}>2:14</Text>
                        </View>
                        <Text style={[styles.errorCode, { color: iconColor, fontSize: 48 }]}>
                            Time<Text style={{ color: iconSecondary, fontStyle: 'italic' }}>out</Text>
                        </Text>
                    </View>
                );
            case 'model-failed':
                return (
                    <View style={styles.iconContainer}>
                        <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
                            <Rect x="10" y="20" width="60" height="45" rx="6" stroke={iconSecondary} strokeWidth="2" />
                            <Path d="M20 50L30 35L42 45L52 32L65 50" stroke={iconSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <Circle cx="28" cy="32" r="4" fill={iconSecondary} />
                            <G transform="translate(48, 10)">
                                <Circle cx="12" cy="12" r="12" fill={dark ? COLORS.black : COLORS.white} stroke={COLORS.red} strokeWidth="2" />
                                <Path d="M8 8l8 8M16 8l-8 8" stroke={COLORS.red} strokeWidth="2" strokeLinecap="round" />
                            </G>
                        </Svg>
                        <Text style={[styles.errorCode, { color: iconColor, fontSize: 48, marginTop: 10 }]}>
                            3<Text style={{ color: iconSecondary, fontStyle: 'italic' }}>D</Text>
                        </Text>
                    </View>
                );
            case 'offline':
                return (
                    <View style={styles.iconContainer}>
                        <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
                            <Path d="M10 38 A50 50 0 0 1 70 38" stroke={iconSecondary} strokeWidth="2.5" strokeLinecap="round" />
                            <Path d="M20 50 A36 36 0 0 1 60 50" stroke={iconSecondary} strokeWidth="2.5" strokeLinecap="round" />
                            <Path d="M30 62 A22 22 0 0 1 50 62" stroke={COLORS.red} strokeWidth="2.5" strokeLinecap="round" />
                            <Circle cx="40" cy="72" r="4" fill={COLORS.red} />
                            <G transform="translate(55, 10)">
                                <Line x1="0" y1="0" x2="15" y2="15" stroke={COLORS.red} strokeWidth="2.5" strokeLinecap="round" />
                                <Line x1="15" y1="0" x2="0" y2="15" stroke={COLORS.red} strokeWidth="2.5" strokeLinecap="round" />
                            </G>
                        </Svg>
                    </View>
                );
        }
    };

    const getDefaults = () => {
        switch (variant) {
            case '404':
                return {
                    title: "Project not found",
                    description: "This project may have been deleted, archived, or you may not have access.",
                    primary: "Go to dashboard",
                    secondary: "Contact team",
                    code: "PRJ_404"
                };
            case 'timeout':
                return {
                    title: "Session expired",
                    description: "Your VR session was interrupted after 28 minutes of inactivity. All changes were saved.",
                    primary: "Rejoin session",
                    secondary: "View saved recording",
                    code: "VSS_2926"
                };
            case 'model-failed':
                return {
                    title: "Model failed",
                    description: "The file couldn't be loaded. It may be corrupted or exceed the 500MB limit.",
                    primary: "Upload new file",
                    secondary: "Use last version",
                    code: "GLB_PARSE_FAIL"
                };
            case 'offline':
                return {
                    title: "Connection lost",
                    description: "You're offline. Changes will sync automatically when you reconnect.",
                    primary: "Retry connection",
                    secondary: "Continue offline",
                    code: "NET_OFFLINE"
                };
        }
    };

    const defaults = getDefaults();

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
                {variant === 'offline' && (
                    <View style={styles.offlineBar}>
                        <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <Path d="M1 1l10 10M8.5 3.5A6 6 0 012 9.5M10 5.5A6 6 0 016 11" stroke="#F08080" strokeWidth="1.3" strokeLinecap="round" />
                        </Svg>
                        <Text style={styles.offlineBarText}>No internet connection</Text>
                    </View>
                )}

                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.content}>
                        {renderIcon()}

                        <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>
                            {title || defaults.title.split(' ')[0]} <Text style={{ fontStyle: 'italic', color: dark ? 'rgba(255,255,255,0.4)' : COLORS.gray }}>{title ? '' : defaults.title.split(' ')[1]}</Text>
                        </Text>

                        <Text style={[styles.description, { color: dark ? 'rgba(255,255,255,0.35)' : COLORS.gray }]}>
                            {description || defaults.description}
                        </Text>

                        {variant === 'offline' && (
                            <View style={styles.capabilitiesCard}>
                                <Text style={styles.capabilitiesTitle}>Available offline</Text>
                                <View style={styles.capabilityRow}>
                                    <Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M2 7l3.5 3.5 6.5-7" stroke={COLORS.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                                    <Text style={styles.capabilityText}>View downloaded models</Text>
                                </View>
                                <View style={styles.capabilityRow}>
                                    <Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M2 7l3.5 3.5 6.5-7" stroke={COLORS.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
                                    <Text style={styles.capabilityText}>Add annotations (sync later)</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.actions}>
                            <Button
                                title={primaryActionLabel || defaults.primary}
                                variant={dark ? 'primary-dark' : 'primary'}
                                onPress={onPrimaryAction}
                                style={styles.btn}
                            />
                            <Button
                                title={secondaryActionLabel || defaults.secondary}
                                variant={dark ? 'ghost-dark' : 'secondary'}
                                onPress={onSecondaryAction}
                                style={styles.btn}
                            />
                        </View>

                        <Text style={[styles.footerText, { color: dark ? 'rgba(255,255,255,0.15)' : COLORS.grayLight }]}>
                            Error code: {errorCode || defaults.code}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    containerDark: {
        backgroundColor: '#0E0D0C',
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 28,
    },
    content: {
        alignItems: 'center',
        textAlign: 'center',
    },
    iconContainer: {
        marginBottom: 28,
        alignItems: 'center',
    },
    errorCode: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 72,
        letterSpacing: -2,
    },
    timeoutRing: {
        width: 80,
        height: 80,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    timeoutText: {
        position: 'absolute',
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 20,
        fontStyle: 'italic',
    },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 24,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 23,
        textAlign: 'center',
        marginBottom: 28,
        maxWidth: 260,
        fontFamily: 'DMSans_400Regular',
    },
    actions: {
        width: '100%',
        gap: 10,
    },
    btn: {
        width: '100%',
    },
    footerText: {
        fontSize: 11,
        marginTop: 16,
        fontFamily: 'DMSans_400Regular',
    },
    offlineBar: {
        height: 32,
        backgroundColor: 'rgba(217, 85, 85, 0.15)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(217, 85, 85, 0.2)',
    },
    offlineBarText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#F08080',
        fontFamily: 'DMSans_500Medium',
    },
    capabilitiesCard: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
    },
    capabilitiesTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.black,
        marginBottom: 10,
        fontFamily: 'DMSans_500Medium',
    },
    capabilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 7,
    },
    capabilityText: {
        fontSize: 12,
        color: COLORS.black,
        fontFamily: 'DMSans_400Regular',
    },
});
