import React from 'react';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, LayoutAnimationConfig } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

interface Props {
    children: React.ReactNode;
    type?: 'fade' | 'slide';
}

/**
 * ScreenTransition wrapper to provide high-fidelity animations on all platforms,
 * including Web where standard Stack animations are often missing.
 */
export const ScreenTransition: React.FC<Props> = ({ children, type = 'slide' }) => {
    const enteringAnim = type === 'slide' ? SlideInRight.duration(500).springify().damping(18) : FadeIn.duration(500);
    const exitingAnim = type === 'slide' ? SlideOutLeft.duration(500) : FadeOut.duration(500);

    return (
        <LayoutAnimationConfig skipEntering={false}>
            <Animated.View
                entering={enteringAnim}
                exiting={exitingAnim}
                style={styles.container}
            >
                {children}
            </Animated.View>
        </LayoutAnimationConfig>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
