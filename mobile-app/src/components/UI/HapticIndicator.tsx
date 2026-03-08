import React, { useRef } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    View,
    Easing,
    ViewStyle,
    GestureResponderEvent
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../constants/Theme';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success';

interface HapticIndicatorProps {
    type?: HapticType;
    children?: React.ReactNode;
    style?: ViewStyle;
    onPress?: (event: GestureResponderEvent) => void;
}

export const HapticIndicator: React.FC<HapticIndicatorProps> = ({
    type = 'light',
    children,
    style,
    onPress,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;

    const handlePress = (e: GestureResponderEvent) => {
        // Haptic feedback
        switch (type) {
            case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
            case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
            case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
        }

        // Animated ripple effect
        rippleScale.setValue(1);
        rippleOpacity.setValue(0.5);

        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0.92,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            Animated.timing(rippleScale, {
                toValue: 3,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
        ]).start(() => {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });

        if (onPress) {
            onPress(e);
        }
    };

    const getHapticColors = () => {
        switch (type) {
            case 'medium': return { border: 'rgba(196, 120, 58, 0.4)', bg: 'rgba(196, 120, 58, 0.8)' };
            case 'heavy': return { border: 'rgba(217, 85, 85, 0.5)', bg: 'rgba(217, 85, 85, 0.8)' };
            case 'success': return { border: 'rgba(74, 124, 89, 0.5)', bg: COLORS.green };
            default: return { border: 'rgba(255, 255, 255, 0.1)', bg: 'rgba(255, 255, 255, 0.1)' };
        }
    };

    const colors = getHapticColors();

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={1}
                style={[
                    styles.ring,
                    { borderColor: colors.border }
                ]}
            >
                <Animated.View
                    style={[
                        styles.ripple,
                        {
                            borderColor: colors.border,
                            transform: [{ scale: rippleScale }],
                            opacity: rippleOpacity
                        }
                    ]}
                />
                <View style={[styles.inner, { backgroundColor: colors.bg }]}>
                    {children}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    ring: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    ripple: {
        position: 'absolute',
        width: 100, // Slightly larger than ring
        height: 100,
        borderRadius: 50,
        borderWidth: 1.5,
    },
    inner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
