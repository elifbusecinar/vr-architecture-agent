import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/Theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'green' | 'primary-dark' | 'ghost-dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
    title?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    pill?: boolean;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    pill = false,
    style,
    textStyle,
    disabled,
    ...props
}) => {
    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: COLORS.black };
            case 'secondary':
                return {
                    backgroundColor: COLORS.cream,
                    borderWidth: 1.5,
                    borderColor: COLORS.border
                };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            case 'danger':
                return { backgroundColor: COLORS.red };
            case 'green':
                return { backgroundColor: COLORS.green };
            case 'primary-dark':
                return { backgroundColor: COLORS.white };
            case 'ghost-dark':
                return {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                };
            default:
                return { backgroundColor: COLORS.black };
        }
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontFamily: 'DMSans_500Medium',
            fontWeight: '500',
        };

        if (variant === 'primary' || variant === 'danger' || variant === 'green') {
            base.color = COLORS.white;
        } else if (variant === 'secondary' || variant === 'ghost') {
            base.color = COLORS.black;
        } else if (variant === 'primary-dark') {
            base.color = COLORS.black;
        } else if (variant === 'ghost-dark') {
            base.color = COLORS.white;
        }

        switch (size) {
            case 'sm':
                base.fontSize = 12;
                break;
            case 'md':
                base.fontSize = 14;
                break;
            case 'lg':
                base.fontSize = 15;
                break;
        }

        return base;
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 9 };
            case 'md':
                return { paddingVertical: 13, paddingHorizontal: 20, borderRadius: BORDER_RADIUS.input };
            case 'lg':
                return { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14 };
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.base,
                getSizeStyle(),
                getVariantStyle(),
                pill && { borderRadius: BORDER_RADIUS.pill },
                disabled && styles.disabled,
                style
            ]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary-dark' ? COLORS.black : COLORS.white}
                />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.icon}>{icon}</View>}
                    {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    icon: {
        marginRight: 4,
    },
    disabled: {
        opacity: 0.5,
    },
});
