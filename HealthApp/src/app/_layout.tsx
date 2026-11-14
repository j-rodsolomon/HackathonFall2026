import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import LoginScreen from '@/components/login-screen';
import IntakeScreen from '@/components/intake-screen';
import Menu from '@/components/ui/menu';
import { AuthProvider, useAuth } from '@/auth';

SplashScreen.preventAutoHideAsync();

function Gate() {
  const { user, intake } = useAuth();
  if (!user) return <LoginScreen />;
  if (!intake) return <IntakeScreen />;
  return <Menu />;
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