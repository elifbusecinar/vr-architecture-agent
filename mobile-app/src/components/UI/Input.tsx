import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    TextStyle
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/Theme';

interface InputProps extends TextInputProps {
    label?: string;
    helperText?: string;
    error?: boolean;
    success?: boolean;
    dark?: boolean;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    helperText,
    error,
    success,
    dark = false,
    rightIcon,
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[
                    styles.label,
                    dark ? styles.labelDark : styles.labelLight,
                    error && { color: COLORS.red },
                    success && { color: COLORS.green }
                ]}>
                    {label}
                </Text>
            )}
            <div className="inp-wrap" style={{ position: 'relative' }}>
                <TextInput
                    style={[
                        styles.input,
                        dark ? styles.inputDark : styles.inputLight,
                        error && styles.inputError,
                        success && styles.inputSuccess,
                        style as TextStyle
                    ]}
                    placeholderTextColor={dark ? 'rgba(255,255,255,0.25)' : COLORS.grayLight}
                    {...props}
                />
                {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
            </div>
            {helperText && (
                <Text style={[
                    styles.helper,
                    error && styles.helperError,
                    success && styles.helperSuccess
                ]}>
                    {helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
        width: '100%',
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 5,
        fontFamily: 'DMSans_500Medium',
    },
    labelLight: {
        color: COLORS.black,
    },
    labelDark: {
        color: 'rgba(255,255,255,0.4)',
    },
    input: {
        height: 44,
        borderRadius: BORDER_RADIUS.input,
        paddingHorizontal: 14,
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
    },
    inputLight: {
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        color: COLORS.black,
    },
    inputDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: COLORS.white,
    },
    inputError: {
        borderColor: COLORS.red,
    },
    inputSuccess: {
        borderColor: COLORS.green,
    },
    iconContainer: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    helper: {
        fontSize: 11,
        marginTop: 4,
        fontFamily: 'DMSans_400Regular',
    },
    helperError: {
        color: COLORS.red,
    },
    helperSuccess: {
        color: COLORS.green,
    },
});
