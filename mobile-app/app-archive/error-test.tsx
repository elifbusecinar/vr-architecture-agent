import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { ErrorState, ErrorVariant } from '../src/components/UI/ErrorState';
import { Button } from '../src/components/UI/Button';
import { COLORS } from '../src/constants/Theme';

export default function ErrorTestPage() {
    const [currentVariant, setCurrentVariant] = useState<ErrorVariant | null>(null);
    const [isDark, setIsDark] = useState(false);

    if (currentVariant) {
        return (
            <View style={{ flex: 1 }}>
                <ErrorState
                    variant={currentVariant}
                    dark={isDark}
                    onPrimaryAction={() => setCurrentVariant(null)}
                    primaryActionLabel="Close Preview"
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Error State Previews</Text>

                <View style={styles.row}>
                    <Button title="404 Screen" onPress={() => setCurrentVariant('404')} style={styles.btn} />
                    <Button title="Timeout Screen" onPress={() => { setCurrentVariant('timeout'); setIsDark(true); }} style={styles.btn} />
                </View>

                <View style={styles.row}>
                    <Button title="Model Failed" onPress={() => { setCurrentVariant('model-failed'); setIsDark(false); }} style={styles.btn} />
                    <Button title="Offline Screen" onPress={() => { setCurrentVariant('offline'); setIsDark(false); }} style={styles.btn} />
                </View>

                <View style={styles.row}>
                    <Button
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        variant="secondary"
                        onPress={() => setIsDark(!isDark)}
                        style={styles.btn}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    content: {
        padding: 20,
        paddingTop: 60,
        gap: 20,
    },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        flex: 1,
    }
});
