import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { Input } from '../src/components/UI/Input';
import { useAuth } from '../src/context/AuthContext';
import { ScreenTransition } from '../src/components/ScreenTransition';

export default function LoginPage() {
    const router = useRouter();
    const { login, loginSSO } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSSOSubmit = async () => {
        setLoginError(null);
        setIsSubmitting(true);
        try {
            const user = await loginSSO();
            if (user) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.replace('/dashboard');
                }, 1000);
            }
        } catch (err: any) {
            setLoginError('SSO Login failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!emailOk || password.length === 0) return;
        setLoginError(null);
        setIsSubmitting(true);

        try {
            const user = await login({ email, password });
            if (user) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.replace('/dashboard');
                }, 1000);
            } else {
                setLoginError('Invalid credentials. Please try again.');
                setIsSubmitting(false);
            }
        } catch (err: any) {
            setLoginError(err?.message || 'Invalid credentials. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <ScreenTransition type="fade">
                <View style={styles.successOverlay}>
                    <Text style={styles.successTitle}>Welcome back.</Text>
                    <Text style={styles.successSub}>LOADING WORKSPACE...</Text>
                </View>
            </ScreenTransition>
        );
    }

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.topbar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <Path d="M10 3L5 8l5 5" stroke={COLORS.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.topbarHint}>New to VRarch?</Text>
                        <TouchableOpacity onPress={() => { /* Create account page coming soon */ }}>
                            <Text style={styles.signupLink}>Create account</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                        <View style={styles.eyebrowRow}>
                            <View style={styles.eyebrowLine} />
                            <Text style={styles.eyebrowText}>SIGN IN</Text>
                        </View>

                        <Text style={styles.title}>
                            Step inside{'\n'}
                            <Text style={styles.titleItalic}>your space.</Text>
                        </Text>
                        <Text style={styles.subtext}>
                            Enter your credentials and watch the room come to life.
                        </Text>

                        {loginError && (
                            <View style={styles.errorToast}>
                                <Text style={styles.errorToastText}>⚠ {loginError}</Text>
                            </View>
                        )}

                        <View style={styles.form}>
                            <Input
                                label="Email address"
                                placeholder="you@studio.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                success={emailOk}
                            />

                            <View style={styles.passwordHeader}>
                                <Text style={styles.fieldLabel}>Password</Text>
                                <TouchableOpacity>
                                    <Text style={styles.forgotLink}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>
                            <Input
                                placeholder="Enter password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                success={password.length > 0}
                            />

                            <Button
                                title="Enter workspace"
                                size="lg"
                                loading={isSubmitting}
                                disabled={!emailOk || password.length === 0 || isSubmitting}
                                onPress={handleSubmit}
                                pill
                                style={{ marginTop: 12 }}
                            />
                        </View>

                        <View style={styles.orDividerRow}>
                            <View style={styles.orDividerLine} />
                            <Text style={styles.orDividerText}>or</Text>
                            <View style={styles.orDividerLine} />
                        </View>

                        <Button
                            title="Continue with SSO"
                            variant="secondary"
                            size="md"
                            onPress={handleSSOSubmit}
                            disabled={isSubmitting}
                            icon={
                                <Svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.black} strokeWidth="2">
                                    <Rect x="2" y="3" width="20" height="14" rx="2" />
                                    <Path d="M8 21h8M12 17v4" />
                                </Svg>
                            }
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    topbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
    },
    backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    topbarHint: { fontSize: 13, color: COLORS.gray, fontFamily: 'DMSans_400Regular', marginLeft: 'auto', marginRight: 8 },
    signupLink: { fontSize: 13, color: COLORS.black, fontFamily: 'DMSans_700Bold', textDecorationLine: 'underline' },
    body: { paddingHorizontal: 32, paddingTop: 40, paddingBottom: 60 },
    eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    eyebrowLine: { width: 20, height: 1, backgroundColor: COLORS.border },
    eyebrowText: { fontFamily: 'DMSans_500Medium', fontSize: 10, color: COLORS.gray, letterSpacing: 0.8 },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 42,
        lineHeight: 46,
        color: COLORS.black,
        letterSpacing: -0.5,
        marginBottom: 10
    },
    titleItalic: {
        fontStyle: 'italic',
        color: COLORS.gray,
    },
    subtext: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 14,
        lineHeight: 22,
        color: COLORS.soft,
        marginBottom: 40
    },
    errorToast: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 24
    },
    errorToastText: { color: '#991B1B', fontFamily: 'DMSans_500Medium', fontSize: 13 },
    form: { width: '100%' },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: -4, // Adjust for input spacing
        zIndex: 1,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.black,
        fontFamily: 'DMSans_500Medium',
        marginBottom: 8,
    },
    forgotLink: {
        fontSize: 11,
        color: COLORS.gray,
        fontFamily: 'DMSans_400Regular',
    },
    orDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
        gap: 14,
    },
    orDividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    orDividerText: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: COLORS.grayLight },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200
    },
    successTitle: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 36,
        color: COLORS.white,
        marginBottom: 12,
        letterSpacing: -0.8
    },
    successSub: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
});
