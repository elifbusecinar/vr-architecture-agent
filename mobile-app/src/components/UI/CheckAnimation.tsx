import React, { useState, useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    View,
    ViewStyle
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, BORDER_RADIUS } from '../../constants/Theme';

interface CheckAnimationProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    size?: number;
    rounded?: boolean;
    style?: ViewStyle;
}

export const CheckAnimation: React.FC<CheckAnimationProps> = ({
    value,
    onValueChange,
    size = 52,
    rounded = true,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const drawAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (value) {
            // Pop scaling
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.15,
                    duration: 150,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.back(1.5)),
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();

            // Draw checkmark
            Animated.timing(drawAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }).start();
        } else {
            drawAnim.setValue(0);
        }
    }, [value]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: rounded ? size / 2 : 14,
                    borderColor: value ? COLORS.green : COLORS.border,
                    backgroundColor: value ? COLORS.green : COLORS.white,
                    borderWidth: 2,
                },
                style
            ]}
        >
            <Animated.View style={{
                transform: [{ scale: scaleAnim }],
                opacity: drawAnim
            }}>
                <Svg width={size * 0.4} height={size * 0.4} viewBox="0 0 20 20">
                    <Path
                        d="M4 10l4.5 4.5 7.5-9"
                        stroke={value ? COLORS.white : COLORS.grayLight}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </Svg>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
