import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { loadData, saveData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginScreen({ navigation }) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    storeName: '',
    ownerName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      const session = await loadData(STORAGE_KEYS.SESSION);
      if (session?.loggedIn) {
        navigation.replace('Main');
        return;
      }
      setCheckingSession(false);
    }
    restoreSession();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  }

  async function handleRegister() {
    const storeName = form.storeName.trim();
    const ownerName = form.ownerName.trim();

    if (!storeName || !ownerName || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setSubmitting(true);
    await saveData(STORAGE_KEYS.ACCOUNT, { storeName, ownerName, password: form.password });
    await saveData(STORAGE_KEYS.SESSION, { loggedIn: true, storeName, ownerName });
    setSubmitting(false);
    navigation.replace('Main');
  }

  async function handleLogin() {
    const storeName = form.storeName.trim();

    if (!storeName || !form.password) {
      setError('Nama warung dan password wajib diisi.');
      return;
    }

    setSubmitting(true);
    const account = await loadData(STORAGE_KEYS.ACCOUNT);
    setSubmitting(false);

    if (!account) {
      setError('Akun belum terdaftar. Silakan daftar dulu.');
      return;
    }
    if (account.storeName !== storeName || account.password !== form.password) {
      setError('Nama warung atau password salah.');
      return;
    }

    await saveData(STORAGE_KEYS.SESSION, {
      loggedIn: true,
      storeName: account.storeName,
      ownerName: account.ownerName,
    });
    navigation.replace('Main');
  }

  function handleSubmit() {
    if (mode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  }

  if (checkingSession) {
    return <LoadingSpinner label="Memeriksa sesi login..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>Warung Digital</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Masuk untuk mengelola warungmu' : 'Daftarkan warungmu'}
        </Text>

        {mode === 'register' && (
          <TextInput
            style={styles.input}
            placeholder="Nama Pemilik"
            placeholderTextColor={colors.textMuted}
            value={form.ownerName}
            onChangeText={(v) => updateField('ownerName', v)}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Nama Warung"
          placeholderTextColor={colors.textMuted}
          value={form.storeName}
          onChangeText={(v) => updateField('storeName', v)}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={form.password}
          onChangeText={(v) => updateField('password', v)}
          secureTextEntry
        />

        {mode === 'register' && (
          <TextInput
            style={styles.input}
            placeholder="Konfirmasi Password"
            placeholderTextColor={colors.textMuted}
            value={form.confirmPassword}
            onChangeText={(v) => updateField('confirmPassword', v)}
            secureTextEntry
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
        >
          <Text style={styles.switchText}>
            {mode === 'login'
              ? 'Belum punya akun? Daftar di sini'
              : 'Sudah punya akun? Masuk di sini'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 13,
  },
});
