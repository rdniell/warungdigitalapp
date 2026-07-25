import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadData, removeData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfileScreen({ navigation }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchAccount() {
        const stored = await loadData(STORAGE_KEYS.ACCOUNT);
        setAccount(stored);
        setLoading(false);
      }
      fetchAccount();
    }, [])
  );

  function handleLogout() {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await removeData(STORAGE_KEYS.SESSION);
          const rootNavigation = navigation.getParent() ?? navigation;
          rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }

  if (loading) {
    return <LoadingSpinner label="Memuat profil..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="storefront" size={40} color={colors.primary} />
      </View>

      <Text style={styles.storeName}>{account?.storeName ?? '-'}</Text>
      <Text style={styles.ownerName}>Pemilik: {account?.ownerName ?? '-'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  storeName: { fontSize: 20, fontWeight: '700', color: colors.text },
  ownerName: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 32,
  },
  logoutText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
