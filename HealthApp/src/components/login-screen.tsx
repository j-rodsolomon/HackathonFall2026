import { useState } from 'react';
import {
  Text, TextInput, Pressable, Image,
  KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet,
} from 'react-native';
import { useAuth } from '@/auth';

const DEMO_EMAIL = 'patient@demo.com';
const DEMO_PASSWORD = 'demo123';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // fake delay
    setLoading(false);
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Wrong email or password.');
      return;
    }
    signIn(email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../../assets/images/fiz-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#8b93a7"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#8b93a7"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log in</Text>}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#000206',
  },
  logo: { width: '100%', height: 180, marginBottom: 8 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2a3142',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#0b0f1a',
  },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#f87171' },
});