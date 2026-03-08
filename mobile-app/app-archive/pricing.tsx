import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/Theme';

export default function PricingRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/billing/plans' as any);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.black} />
        </View>
    );
}
