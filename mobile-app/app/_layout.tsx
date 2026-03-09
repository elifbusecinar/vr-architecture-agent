import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../src/context/AuthContext';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F0EDE8' },
          animation: 'simple_push',
          animationDuration: 400
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="dashboard" options={{ animation: 'fade' }} />
        <Stack.Screen name="projects" options={{ animation: 'fade' }} />
        <Stack.Screen name="clients" options={{ animation: 'fade' }} />
        <Stack.Screen name="ai-assistant" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
