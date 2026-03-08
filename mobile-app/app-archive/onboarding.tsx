import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line, G, Ellipse } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { Toggle } from '../src/components/UI/Toggle';
import { ScreenTransition } from '../src/components/ScreenTransition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            router.replace('/dashboard');
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.visualContainer}>
                            <Svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                                <Circle cx="110" cy="110" r="90" stroke={COLORS.border} strokeWidth="1.5" strokeDasharray="8 6" />
                                <Circle cx="110" cy="110" r="60" stroke={COLORS.border} strokeWidth="1" strokeDasharray="4 6" />
                                <Path d="M50 160V90l60-45 60 45v70H50Z" stroke={COLORS.black} strokeWidth="1.5" strokeLinejoin="round" />
                                <Rect x="85" y="130" width="20" height="30" stroke={COLORS.black} strokeWidth="1.2" />
                                <Rect x="120" y="105" width="22" height="22" stroke={COLORS.black} strokeWidth="1.2" />
                                <Path d="M50 90L110 50L170 90" stroke={COLORS.grayLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <Circle cx="110" cy="50" r="6" fill={COLORS.green} />
                            </Svg>
                        </View>
                        <View style={styles.textContent}>
                            <View style={styles.eyebrow}>
                                <View style={styles.eyebrowDot} />
                                <Text style={styles.eyebrowText}>1 OF 5</Text>
                            </View>
                            <Text style={styles.title}>Welcome to{'\n'}<Text style={styles.titleItalic}>VRarch</Text></Text>
                            <Text style={styles.description}>
                                The professional VR platform for architects. Walk your designs at 1:1 scale before anything is built.
                            </Text>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.visualContainer}>
                            <Svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                                <Circle cx="110" cy="110" r="70" stroke={COLORS.border} strokeWidth="1" />
                                <G transform="translate(60, 60)">
                                    <Circle cx="50" cy="30" r="25" stroke={COLORS.black} strokeWidth="1.5" />
                                    <Path d="M10 100c0-20 15-35 40-35s40 15 40 35" stroke={COLORS.black} strokeWidth="1.5" />
                                    <Circle cx="50" cy="30" r="12" fill={COLORS.green} opacity="0.2" />
                                </G>
                            </Svg>
                        </View>
                        <View style={styles.textContent}>
                            <View style={styles.eyebrow}>
                                <View style={styles.eyebrowDot} />
                                <Text style={styles.eyebrowText}>2 OF 5</Text>
                            </View>
                            <Text style={styles.title}>What's your{'\n'}<Text style={styles.titleItalic}>primary role?</Text></Text>
                            <Text style={styles.description}>
                                We'll tailor the workspace to your needs. Architect, Contractor, or Client.
                            </Text>
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={[styles.stepContainer, { backgroundColor: COLORS.black }]}>
                        <View style={styles.visualContainer}>
                            <Svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                                <Rect x="35" y="80" width="150" height="70" rx="20" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.15)" strokeWidth="1.5" />
                                <Rect x="50" y="95" width="50" height="40" rx="8" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
                                <Rect x="120" y="95" width="50" height="40" rx="8" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
                                <Circle cx="110" cy="70" r="3" fill={COLORS.green} />
                                <Path d="M95 55 A21 21 0 0 1 125 55" stroke="rgba(74,124,89,.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </Svg>
                        </View>
                        <View style={styles.textContent}>
                            <View style={styles.eyebrow}>
                                <View style={[styles.eyebrowDot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                                <Text style={[styles.eyebrowText, { color: 'rgba(255,255,255,0.3)' }]}>3 OF 5</Text>
                            </View>
                            <Text style={[styles.title, { color: COLORS.white }]}>Connect your{'\n'}<Text style={[styles.titleItalic, { color: 'rgba(255,255,255,0.35)' }]}>headset</Text></Text>
                            <Text style={[styles.description, { color: 'rgba(255,255,255,0.4)' }]}>
                                Put on your Meta Quest 3 and open VRarch. We'll pair automatically over WiFi.
                            </Text>
                        </View>
                    </View>
                );
            case 4:
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.visualContainer}>
                            <View style={styles.toggleDemo}>
                                <Toggle value={true} onValueChange={() => { }} label="Push notifications" />
                                <View style={{ height: 20 }} />
                                <Toggle value={true} onValueChange={() => { }} label="Device alerts" />
                                <View style={{ height: 20 }} />
                                <Toggle value={false} onValueChange={() => { }} label="Biometric gate" />
                            </View>
                        </View>
                        <View style={styles.textContent}>
                            <View style={styles.eyebrow}>
                                <View style={styles.eyebrowDot} />
                                <Text style={styles.eyebrowText}>4 OF 5</Text>
                            </View>
                            <Text style={styles.title}>Stay{'\n'}<Text style={styles.titleItalic}>in the loop.</Text></Text>
                            <Text style={styles.description}>
                                Enable notifications to get real-time approvals and team comments.
                            </Text>
                        </View>
                    </View>
                );
            case 5:
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.visualContainer}>
                            <View style={styles.successVisual}>
                                <View style={styles.checkCircle}>
                                    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <Path d="M8 24l12 12 20-24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>
                                </View>
                                <View style={styles.dotsRow}>
                                    <View style={styles.dotTiny} />
                                    <View style={styles.dotTiny} />
                                    <View style={[styles.dotTiny, styles.dotWide]} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.textContent}>
                            <View style={styles.eyebrow}>
                                <View style={[styles.eyebrowDot, { backgroundColor: COLORS.green }]} />
                                <Text style={styles.eyebrowText}>ALL DONE · 5 OF 5</Text>
                            </View>
                            <Text style={styles.title}>You're ready,{'\n'}<Text style={styles.titleItalic}>Arch1.</Text></Text>
                            <Text style={styles.description}>
                                Your studio is set up, your headset is paired. Let's build something remarkable.
                            </Text>
                        </View>
                    </View>
                );
        }
    };

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={[styles.container, step === 3 && { backgroundColor: COLORS.black }]}>
                {/* Progress Indicators */}
                <View style={styles.progressHeader}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressStep,
                                i <= step ? styles.progressStepActive : styles.progressStepInactive,
                                step === 3 && i > step && { backgroundColor: 'rgba(255,255,255,0.1)' },
                                step === 3 && i <= step && { backgroundColor: COLORS.white }
                            ]}
                        />
                    ))}
                </View>

                {renderStepContent()}

                <View style={[styles.footer, step === 3 && { borderTopColor: 'rgba(255,255,255,0.1)' }]}>
                    <Button
                        title={step === 5 ? "Enter Studio" : step === 3 ? "Start Pairing" : "Continue"}
                        variant={step === 3 ? "green" : "primary"}
                        onPress={handleNext}
                        style={styles.nextBtn}
                        size="lg"
                    />
                    <TouchableOpacity onPress={() => router.replace('/dashboard')}>
                        <Text style={[styles.skipText, step === 3 && { color: 'rgba(255,255,255,0.3)' }]}>
                            {step === 5 ? "Take a quick tour" : "Skip — set up later"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    progressHeader: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 20,
        paddingTop: 40,
        height: 50,
    },
    progressStep: {
        flex: 1,
        height: 3,
        borderRadius: 2,
    },
    progressStepActive: {
        backgroundColor: COLORS.black,
    },
    progressStepInactive: {
        backgroundColor: COLORS.border,
    },
    stepContainer: {
        flex: 1,
    },
    visualContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContent: {
        paddingHorizontal: 28,
        paddingBottom: 40,
    },
    eyebrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    eyebrowDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: COLORS.gray,
    },
    eyebrowText: {
        fontSize: 10,
        color: COLORS.gray,
        letterSpacing: 1.2,
        fontFamily: 'DMSans_500Medium',
    },
    title: {
        fontSize: 32,
        lineHeight: 38,
        color: COLORS.black,
        letterSpacing: -0.6,
        fontFamily: 'PlayfairDisplay_400Regular',
        marginBottom: 10,
    },
    titleItalic: {
        fontStyle: 'italic',
        color: COLORS.gray,
    },
    description: {
        fontSize: 14,
        lineHeight: 23,
        color: COLORS.gray,
        fontFamily: 'DMSans_400Regular',
    },
    footer: {
        paddingHorizontal: 28,
        paddingBottom: 30,
        gap: 16,
    },
    nextBtn: {
        width: '100%',
    },
    skipText: {
        textAlign: 'center',
        fontSize: 13,
        color: COLORS.grayLight,
        fontFamily: 'DMSans_400Regular',
    },
    toggleDemo: {
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 20,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    successVisual: {
        alignItems: 'center',
    },
    checkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.green,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: COLORS.green,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dotTiny: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
    },
    dotWide: {
        width: 24,
        backgroundColor: COLORS.green,
    }
});
