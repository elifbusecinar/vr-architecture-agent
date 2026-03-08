import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/Theme';
import { Button } from '../src/components/UI/Button';
import { Input } from '../src/components/UI/Input';
import { Badge } from '../src/components/UI/Badge';
import { Card } from '../src/components/UI/Card';
import { Toggle } from '../src/components/UI/Toggle';
import { SkeletonLoader } from '../src/components/SkeletonLoader';
import { CheckAnimation } from '../src/components/UI/CheckAnimation';
import { HapticIndicator } from '../src/components/UI/HapticIndicator';
import { ScreenTransition } from '../src/components/ScreenTransition';

export default function StyleguidePage() {
    const router = useRouter();
    const [toggleVal, setToggleVal] = useState(true);
    const [checkVal, setCheckVal] = useState(false);
    const [inputText, setInputText] = useState('');

    return (
        <ScreenTransition type="slide">
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: 'UI System', headerStyle: { backgroundColor: COLORS.cream } }} />

                <ScrollView contentContainerStyle={styles.scroll}>
                    <Text style={styles.sectionLabel}>TYPOGRAPHY</Text>
                    <View style={styles.section}>
                        <Text style={styles.h1}>Playfair Display H1</Text>
                        <Text style={styles.h1Italic}>Playfair Display Italic</Text>
                        <Text style={styles.body}>DM Sans Body - Professional architectural typography for mobile interfaces.</Text>
                    </View>

                    <Text style={styles.sectionLabel}>BUTTONS</Text>
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Button title="Primary" style={styles.flex1} />
                            <Button title="Secondary" variant="secondary" style={styles.flex1} />
                        </View>
                        <View style={styles.row}>
                            <Button title="Green" variant="green" style={styles.flex1} />
                            <Button title="Ghost" variant="ghost" style={styles.flex1} />
                        </View>
                        <View style={styles.row}>
                            <Button title="Loading" loading style={styles.flex1} />
                            <Button title="Pill Shape" pill variant="primary-dark" style={styles.flex1} />
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>INPUTS</Text>
                    <View style={styles.section}>
                        <Input
                            label="Email Address"
                            placeholder="you@studio.com"
                            value={inputText}
                            onChangeText={setInputText}
                            success={inputText.includes('@')}
                            helperText="We'll never share your email."
                        />
                        <Input
                            label="Password"
                            secureTextEntry={true}
                            placeholder="••••••••"
                            error={inputText.length > 0 && inputText.length < 6}
                            helperText={inputText.length > 0 && inputText.length < 6 ? "Minimum 6 characters required" : ""}
                        />
                    </View>

                    <Text style={styles.sectionLabel}>BADGES</Text>
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Badge label="Active" variant="green" />
                            <Badge label="Pending" variant="amber" />
                            <Badge label="Error" variant="red" />
                            <Badge label="Dark" variant="dark" />
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>INTERACTIVE</Text>
                    <View style={styles.section}>
                        <View style={styles.rowCenter}>
                            <Toggle label="Notifications" value={toggleVal} onValueChange={setToggleVal} />
                        </View>
                        <View style={styles.rowCenter}>
                            <Text style={styles.itemLabel}>Check Animation:</Text>
                            <CheckAnimation value={checkVal} onValueChange={setCheckVal} size={44} />
                        </View>
                        <View style={styles.rowCenter}>
                            <Text style={styles.itemLabel}>Haptic Feedback:</Text>
                            <HapticIndicator type="success">
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>
                            </HapticIndicator>
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>SKELETONS</Text>
                    <View style={styles.section}>
                        <SkeletonLoader width="100%" height={20} borderRadius={4} style={{ marginBottom: 10 }} />
                        <View style={styles.row}>
                            <SkeletonLoader width={60} height={60} borderRadius={30} />
                            <View style={{ flex: 1, gap: 10 }}>
                                <SkeletonLoader width="80%" height={15} />
                                <SkeletonLoader width="40%" height={15} />
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>CARDS</Text>
                    <View style={styles.section}>
                        <Card style={{ marginBottom: 15 }}>
                            <Text style={{ fontWeight: '600' }}>Light Card</Text>
                            <Text style={{ color: COLORS.gray, marginTop: 4 }}>Standard elevated container for content.</Text>
                        </Card>
                        <Card variant="dark" style={{ marginBottom: 15 }}>
                            <Text style={{ fontWeight: '600', color: COLORS.white }}>Dark Card</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Premium dark mode card variant.</Text>
                        </Card>
                        <Card variant="feature">
                            <Text style={{ fontWeight: '600', color: COLORS.white }}>Feature Card</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Used for special call-to-actions.</Text>
                        </Card>
                    </View>

                    <Text style={styles.sectionLabel}>ERROR SCREENS</Text>
                    <View style={styles.section}>
                        <Button
                            title="Preview Error System"
                            variant="secondary"
                            onPress={() => router.push('/error-test')}
                        />
                    </View>

                    <View style={{ height: 60 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    scroll: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.gray,
        letterSpacing: 1.5,
        marginBottom: 12,
        marginTop: 20,
        fontFamily: 'DMSans_500Medium',
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 15,
    },
    h1: {
        fontSize: 32,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: COLORS.black,
    },
    h1Italic: {
        fontSize: 32,
        fontFamily: 'PlayfairDisplay_400Regular_Italic',
        color: COLORS.gray,
    },
    body: {
        fontSize: 14,
        lineHeight: 22,
        color: COLORS.soft,
        fontFamily: 'DMSans_400Regular',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    flex1: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 14,
        color: COLORS.black,
        fontFamily: 'DMSans_500Medium',
    }
});
