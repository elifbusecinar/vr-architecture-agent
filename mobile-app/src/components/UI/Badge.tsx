import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants/Theme';

export type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray' | 'dark';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    dark?: boolean;
    showDot?: boolean;
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'gray',
    dark = false,
    showDot = true,
    style,
}) => {
    const getVariantStyle = (): ViewStyle => {
        if (dark) {
            switch (variant) {
                case 'green':
                    return {
                        backgroundColor: 'rgba(74, 124, 89, 0.2)',
                        borderColor: 'rgba(74, 124, 89, 0.3)',
                        borderWidth: 1
                    };
                case 'red':
                    return {
                        backgroundColor: 'rgba(217, 85, 85, 0.2)',
                        borderColor: 'rgba(217, 85, 85, 0.3)',
                        borderWidth: 1
                    };
                case 'amber':
                    return {
                        backgroundColor: 'rgba(196, 120, 58, 0.2)',
                        borderColor: 'rgba(196, 120, 58, 0.3)',
                        borderWidth: 1
                    };
                default:
                    return { backgroundColor: 'rgba(255, 255, 255, 0.1)' };
            }
        }

        switch (variant) {
            case 'green':
                return { backgroundColor: 'rgba(74, 124, 89, 0.12)' };
            case 'red':
                return { backgroundColor: 'rgba(217, 85, 85, 0.12)' };
            case 'amber':
                return { backgroundColor: 'rgba(196, 120, 58, 0.12)' };
            case 'blue':
                return { backgroundColor: 'rgba(58, 111, 160, 0.12)' };
            case 'purple':
                return { backgroundColor: 'rgba(123, 111, 160, 0.12)' };
            case 'gray':
                return { backgroundColor: 'rgba(138, 135, 131, 0.12)' };
            default:
                return { backgroundColor: 'rgba(138, 135, 131, 0.12)' };
        }
    };

    const getTextStyle = (): TextStyle => {
        if (dark) {
            switch (variant) {
                case 'green': return { color: '#7ECB94' };
                case 'red': return { color: '#F08080' };
                case 'amber': return { color: '#E8A060' };
                default: return { color: 'white' };
            }
        }

        switch (variant) {
            case 'green': return { color: COLORS.green };
            case 'red': return { color: COLORS.red };
            case 'amber': return { color: COLORS.amber };
            case 'blue': return { color: COLORS.blue };
            case 'purple': return { color: COLORS.purple };
            case 'gray': return { color: COLORS.gray };
            default: return { color: COLORS.gray };
        }
    };

    const getDotColor = () => {
        if (dark) {
            switch (variant) {
                case 'green': return '#7ECB94';
                case 'red': return '#F08080';
                case 'amber': return '#E8A060';
                default: return 'white';
            }
        }
        return getTextStyle().color;
    };

    return (
        <View style={[styles.container, getVariantStyle(), style]}>
            {showDot && (
                <View style={[styles.dot, { backgroundColor: getDotColor() }]} />
            )}
            <Text style={[styles.label, getTextStyle()]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.pill,
        alignSelf: 'flex-start',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        fontFamily: 'DMSans_500Medium',
    },
});
