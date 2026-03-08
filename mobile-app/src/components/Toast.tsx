import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/Theme';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

const TOAST_COLORS = {
    success: { bg: COLORS.black, icon: 'rgba(74,124,89,0.3)', accent: '#7ECB94', text: COLORS.white },
    warning: { bg: '#2A1A08', icon: 'rgba(196,120,58,0.3)', accent: COLORS.amber, text: COLORS.amber },
    error: { bg: '#2A0808', icon: 'rgba(217,85,85,0.3)', accent: COLORS.red, text: '#F08080' },
    info: { bg: '#1A1814', icon: 'rgba(255,255,255,0.1)', accent: 'rgba(255,255,255,0.2)', text: 'rgba(255,255,255,0.7)' },
};

interface ToastProps {
    visible: boolean;
    type: ToastType;
    title: string;
    message?: string;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ visible, type, title, message, onClose, duration = 3000 }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 64,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7
                }),
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();

            // Progress bar animation
            Animated.timing(progressWidth, {
                toValue: 1,
                duration: duration,
                useNativeDriver: false, // width cannot be animated with native driver
            }).start();

            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => {
                clearTimeout(timer);
                progressWidth.setValue(0);
            };
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    const currentColors = TOAST_COLORS[type];

    const renderIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <Svg viewBox="0 0 12 12" width={12} height={12}>
                        <Path d="M1.5 6l3.5 3.5 5.5-7" stroke="#7ECB94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </Svg>
                );
            case 'warning':
                return (
                    <Svg viewBox="0 0 12 12" width={12} height={12}>
                        <Path d="M6 2l5.5 9H.5L6 2z" stroke="#E8A060" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                        <Line x1="6" y1="6" x2="6" y2="8.5" stroke="#E8A060" strokeWidth="1.2" strokeLinecap="round" />
                    </Svg>
                );
            case 'error':
                return (
                    <Svg viewBox="0 0 12 12" width={12} height={12}>
                        <Path d="M2 2l8 8M10 2l-8 8" stroke="#F08080" strokeWidth="1.5" strokeLinecap="round" />
                    </Svg>
                );
            case 'info':
                return (
                    <Svg viewBox="0 0 12 12" width={12} height={12}>
                        <Circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,.5)" strokeWidth="1.1" fill="none" />
                        <Line x1="6" y1="5" x2="6" y2="8.5" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" strokeLinecap="round" />
                        <Circle cx="6" cy="4" r=".6" fill="rgba(255,255,255,.5)" />
                    </Svg>
                );
        }
    };

    const widthInterpolation = progressWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Animated.View style={[
            styles.toast,
            {
                backgroundColor: currentColors.bg,
                transform: [{ translateY: slideAnim }],
                opacity,
            },
            type !== 'success' && { borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
        ]}>
            <View style={[styles.icon, { backgroundColor: currentColors.icon }]}>
                {renderIcon()}
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: currentColors.text }]}>{title}</Text>
                {message && <Text style={styles.message}>{message}</Text>}
            </View>

            <Animated.View style={[
                styles.progressBar,
                {
                    backgroundColor: currentColors.accent,
                    width: widthInterpolation,
                }
            ]} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 0, // Animated to slide from top
        left: 12,
        right: 12,
        borderRadius: 12,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        zIndex: 1000,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'DMSans_500Medium',
    },
    message: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 1,
        fontFamily: 'DMSans_400Regular',
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 2,
    },
});
