import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ErrorState } from '../src/components/UI/ErrorState';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
    const router = useRouter();

    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <ErrorState
                variant="404"
                onPrimaryAction={() => router.replace('/dashboard')}
                onSecondaryAction={() => router.back()}
                secondaryActionLabel="Go back"
            />
        </>
    );
}
