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
import { ScreenTransition } from '../src/components/ScreenTransition';

export default function CreateAccountPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [studioName, setStudioName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const nameOk = fullName.length > 2;
    const studioOk = studioName.length > 2;
    const pwOk = password.length >= 6;

    const handleSignup = async () => {
        if (!emailOk || !nameOk || !studioOk || !pwOk) return;
        setSignupError(null);
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSuccess(true);
            setTimeout(() => {
                router.replace('/dashboard');
            }, 1000);
        } catch (err: any) {
            setSignupError('Account creation failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <ScreenTransition type="fade">
                <View style={styles.successOverlay}>
                    <Text style={styles.successTitle}>Welcome aboard.</Text>
                    <Text style={styles.successSub}>INITIALIZING STUDIO WORKSPACE...</Text>
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
                        <Text style={styles.topbarHint}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Log in</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                        <View style={styles.heroSection}>
                            <View style={styles.eyebrowRow}>
                                <View style={styles.eyebrowLine} />
                                <Text style={styles.eyebrowText}>GET STARTED</Text>
                            </View>

                            <Text style={styles.title}>
                                Build your{'\n'}
                                <Text style={styles.titleItalic}>digital studio.</Text>
                            </Text>
                            <Text style={styles.subtext}>
                                Join 500+ architecture firms presenting in 1:1 scale VR.
                            </Text>
                        </View>

                        {signupError && (
                            <View style={styles.errorToast}>
                                <Text style={styles.errorToastText}>⚠ {signupError}</Text>
                            </View>
                        )}

                        <View style={styles.form}>
                            <Input
                                label="Full Name"
                                placeholder="e.g. Jane Doe"
                                value={fullName}
                                onChangeText={setFullName}
                                success={nameOk}
                            />

                            <Input
                                label="Studio Name"
                                placeholder="e.g. Riverside Architects"
                                value={studioName}
                                onChangeText={setStudioName}
                                success={studioOk}
                            />

                            <Input
                                label="Work Email"
                                placeholder="jane@studio.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                success={emailOk}
                            />

                            <Input
                                label="Create Password"
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                success={pwOk}
                                error={password.length > 0 && !pwOk}
                            />

                            <Button
                                title="Create Studio Account"
                                size="lg"
                                loading={isSubmitting}
                                disabled={!emailOk || !nameOk || !studioOk || !pwOk || isSubmitting}
                                onPress={handleSignup}
                                style={{ marginTop: 24 }}
                            />
                        </View>

                        <View style={styles.legal}>
                            <Text style={styles.legalText}>
                                By signing up, you agree to our <Text style={styles.legalLink}>Terms</Text> and <Text style={styles.legalLink}>Privacy Policy</Text>.
                            </Text>
                        </View>
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
    loginLink: { fontSize: 13, color: COLORS.black, fontFamily: 'DMSans_700Bold', textDecorationLine: 'underline' },
    body: { paddingHorizontal: 32, paddingTop: 20, paddingBottom: 60 },
    heroSection: { marginBottom: 32 },
    eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    eyebrowLine: { width: 20, height: 1, backgroundColor: COLORS.border },
    eyebrowText: { fontFamily: 'DMSans_500Medium', fontSize: 10, color: COLORS.gray, letterSpacing: 0.8 },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 38,
        lineHeight: 42,
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
    },
    errorToast: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 24
    },
    errorToastText: { color: '#991B1B', fontFamily: 'DMSans_500Medium', fontSize: 13 },
    form: { width: '100%' },
    legal: { marginTop: 40, alignItems: 'center' },
    legalText: { fontSize: 11, color: COLORS.gray, textAlign: 'center', lineHeight: 16, fontFamily: 'DMSans_400Regular' },
    legalLink: { color: COLORS.black, textDecorationLine: 'underline' },
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
        marginBottom: 12
    },
    successSub: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 2
    },
});
