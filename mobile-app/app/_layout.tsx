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
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="dashboard" options={{ animation: 'fade' }} />
        <Stack.Screen name="projects/index" options={{ animation: 'simple_push' }} />
        <Stack.Screen name="projects/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="projects/[id]/viewer" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="ai-assistant" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="pairing" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="sessions/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="camera-annotate" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="site-visit" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="tour-recorder" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="client-approval" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="headset-monitor" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="quick-capture" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="offline-sync" options={{ animation: 'slide_from_left' }} />
        <Stack.Screen name="waiting-room" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="session-recap" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="shake-report" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="vr-replay" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="mood-board" options={{ animation: 'simple_push' }} />
        <Stack.Screen name="biometric-gate" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="empty-projects" options={{ animation: 'fade' }} />
        <Stack.Screen name="showroom" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="material-browser" options={{ animation: 'simple_push' }} />
        <Stack.Screen name="team-presence" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="safety-checklist" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="global-search" options={{ animation: 'fade' }} />
        <Stack.Screen name="tag-management" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ar-permission" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="pricing" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="billing/plans" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="billing/estimator" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="billing/compare" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="billing/support" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="analytics" options={{ animation: 'fade' }} />
        <Stack.Screen name="tablet-dashboard" options={{ animation: 'fade' }} />
        <Stack.Screen name="email-digest" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="accessibility-mode" options={{ animation: 'fade' }} />
        <Stack.Screen name="create-account" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="stories" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="projects" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="about-studio" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AuthProvider>
  );
}
