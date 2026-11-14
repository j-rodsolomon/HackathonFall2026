import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import LoginScreen from '@/components/login-screen';
import IntakeScreen from '@/components/intake-screen';
import HearingScreen from '@/components/ui/hearing';
import Menu from '@/components/ui/menu';
import { AuthProvider, useAuth } from '@/auth';

SplashScreen.preventAutoHideAsync();

function Gate() {
  const { user, intake } = useAuth();
  const [showHearing, setShowHearing] = useState(false);

  if (!user) return <LoginScreen />;
  if (!intake) return <IntakeScreen />;
  if (showHearing) return <HearingScreen onBack={() => setShowHearing(false)} />;

  return (
    <Menu
      onSelect={(section) => {
        if (section === 'Hearing') setShowHearing(true);
      }}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <Gate />
      </AuthProvider>
    </ThemeProvider>
  );
}