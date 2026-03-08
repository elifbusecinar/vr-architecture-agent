import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { ScreenTransition } from '../../../src/components/ScreenTransition';

export default function ProjectViewerPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Provide the web-based viewer URL. Assuming frontend is running locally or in prod:
    // This allows the mobile app to simply embed the advanced THREE.js view from the web portal
    // without rebuilding complex shaders and WebGL locally if resources are limited.
    const viewerUrl = `http://10.0.2.2:5173/viewer/${id}?embedded=true`; // Using local emulator URL or prod endpoint

    return (
        <ScreenTransition type="fade">
            <SafeAreaView style={styles.container}>
                <View style={styles.topbar}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                        <Svg viewBox="0 0 16 16" width={16} height={16}>
                            <Path d="M10 3L4 8l6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>3D Model Viewer</Text>
                    <View style={{ width: 34 }} />
                </View>

                <View style={styles.webviewWrapper}>
                    {loading && (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#ffffff" />
                            <Text style={styles.loadingText}>Loading Spatial Engine...</Text>
                        </View>
                    )}
                    <WebView
                        source={{ uri: viewerUrl }}
                        style={styles.webview}
                        onLoadEnd={() => setLoading(false)}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                    />
                </View>
            </SafeAreaView>
        </ScreenTransition>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark immersive mode for viewer
    },
    topbar: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#333'
    },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontFamily: 'DMSans_500Medium',
        fontSize: 14,
    },
    webviewWrapper: {
        flex: 1,
        position: 'relative'
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    loadingText: {
        color: 'white',
        marginTop: 16,
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
        letterSpacing: 1
    }
});
