import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadData, saveData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';
import { formatRupiah } from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId, productName } = route.params;
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: productName || 'Detail Produk' });
  }, [productName]);

  useEffect(() => {
    async function fetchProduct() {
      const products = await loadData(STORAGE_KEYS.PRODUCTS, []);
      const found = products.find((p) => p.id === productId);
      setProduct(found || null);
      setLoading(false);
    }
    fetchProduct();
  }, [productId]);

  async function handleAddToCart() {
    const cart = await loadData(STORAGE_KEYS.CART, []);
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    let nextCart;
    if (existingIndex >= 0) {
      nextCart = [...cart];
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        qty: nextCart[existingIndex].qty + qty,
      };
    } else {
      nextCart = [
        ...cart,
        { productId: product.id, name: product.name, price: product.price, qty },
      ];
    }

    await saveData(STORAGE_KEYS.CART, nextCart);
    Alert.alert('Berhasil', `${product.name} ditambahkan ke keranjang.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  if (loading) {
    return <LoadingSpinner label="Memuat produk..." />;
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Produk tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {product.photo ? (
        <Image source={{ uri: product.photo }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <Text style={styles.stock}>Stok tersedia: {product.stock}</Text>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Jumlah</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={18} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => setQty((q) => Math.min(product.stock, q + 1))}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Tambah ke Keranjang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: colors.textMuted, fontSize: 15 },
  photo: { width: '100%', height: 220, backgroundColor: colors.surface },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  price: { fontSize: 18, fontWeight: '600', color: colors.primary, marginTop: 6 },
  stock: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  qtyLabel: { fontSize: 15, color: colors.text },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  stepperButton: { paddingHorizontal: 14, paddingVertical: 8 },
  qtyValue: { fontSize: 15, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 28,
    gap: 8,
  },
  addButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
