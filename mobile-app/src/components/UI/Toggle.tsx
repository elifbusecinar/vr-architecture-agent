import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/Theme';

interface ToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label?: string;
    dark?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
    value,
    onValueChange,
    label,
    dark = false,
}) => {
    const [animatedValue] = React.useState(new Animated.Value(value ? 1 : 0));

    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [3, 21],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [dark ? 'rgba(255, 255, 255, 0.12)' : COLORS.grayLight, COLORS.green],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={styles.container}
        >
            <Animated.View style={[styles.track, { backgroundColor }]}>
                <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
            </Animated.View>
            {label && (
                <Text style={[styles.label, dark ? styles.labelDark : styles.labelLight]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    track: {
        width: 44,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    label: {
        fontSize: 13,
        fontFamily: 'DMSans_400Regular',
    },
    labelLight: {
        color: COLORS.black,
    },
    labelDark: {
        color: 'rgba(255,255,255,0.7)',
    },
});
