import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { loadData, saveData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';

export default function AddProductScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  }

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin akses galeri untuk mengambil foto produk.'
      );
      return;
    }

    setPermissionDenied(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length) {
      setPhoto(result.assets[0].uri);
    }
  }

  function validate() {
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) return 'Nama produk wajib diisi.';
    if (!form.price || Number.isNaN(price) || price <= 0) {
      return 'Harga harus berupa angka lebih dari 0.';
    }
    if (!form.stock || Number.isNaN(stock) || stock < 0) {
      return 'Stok harus berupa angka 0 atau lebih.';
    }
    return '';
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    const products = await loadData(STORAGE_KEYS.PRODUCTS, []);
    const newProduct = {
      id: Date.now().toString(),
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      photo,
    };
    await saveData(STORAGE_KEYS.PRODUCTS, [newProduct, ...products]);
    setSaving(false);
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.photoPicker} onPress={handlePickPhoto}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
            <Text style={styles.photoPlaceholderText}>Pilih Foto Produk</Text>
          </View>
        )}
      </TouchableOpacity>

      {permissionDenied && (
        <Text style={styles.permissionWarning}>
          Izin galeri ditolak. Produk tetap bisa disimpan tanpa foto.
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nama Produk"
        placeholderTextColor={colors.textMuted}
        value={form.name}
        onChangeText={(v) => updateField('name', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Harga (mis. 5000)"
        placeholderTextColor={colors.textMuted}
        value={form.price}
        onChangeText={(v) => updateField('price', v)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Stok"
        placeholderTextColor={colors.textMuted}
        value={form.stock}
        onChangeText={(v) => updateField('stock', v)}
        keyboardType="numeric"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Menyimpan...' : 'Simpan Produk'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.background, flexGrow: 1 },
  photoPicker: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  permissionWarning: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
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
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
