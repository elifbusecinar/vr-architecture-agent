import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, ViewStyle, Dimensions, DimensionValue } from 'react-native';
import { COLORS } from '../constants/Theme';

interface SkeletonProps {
    width: DimensionValue;
    height: DimensionValue;
    borderRadius?: number;
    dark?: boolean;
    style?: ViewStyle;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const SkeletonLoader: React.FC<SkeletonProps> = ({
    width,
    height,
    borderRadius = 8,
    dark = false,
    style
}) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1600,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    return (
        <View style={[
            styles.container,
            { width, height, borderRadius, backgroundColor: dark ? '#2A2622' : '#E8E4DE' },
            style
        ]}>
            <Animated.View style={[
                styles.shimmer,
                {
                    backgroundColor: dark ? '#322E2A' : '#F4F0EB',
                    transform: [{ translateX }],
                    width: '200%',
                    height: '100%',
                }
            ]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.5,
    },
});
