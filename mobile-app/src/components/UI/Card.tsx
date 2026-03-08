import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants/Theme';

export type CardVariant = 'light' | 'dark' | 'elevated' | 'feature';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'light',
    style,
    onPress,
}) => {
    const Container = onPress ? TouchableOpacity : View;

    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'light':
                return {
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.border
                };
            case 'dark':
                return {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.09)'
                };
            case 'elevated':
                return {
                    backgroundColor: COLORS.white,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 20,
                    elevation: 4,
                };
            case 'feature':
                return { backgroundColor: COLORS.black };
            default:
                return { backgroundColor: COLORS.white };
        }
    };

    return (
        <Container
            style={[styles.base, getVariantStyle(), style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: BORDER_RADIUS.card,
        padding: 16,
    },
});
