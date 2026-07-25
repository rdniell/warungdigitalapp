import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadData, saveData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';
import { formatRupiah } from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function CartScreen() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = useCallback(async () => {
    const stored = await loadData(STORAGE_KEYS.CART, []);
    setCart(stored);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  async function updateQty(productId, delta) {
    const next = cart
      .map((item) =>
        item.productId === productId ? { ...item, qty: item.qty + delta } : item
      )
      .filter((item) => item.qty > 0);
    setCart(next);
    await saveData(STORAGE_KEYS.CART, next);
  }

  function removeItem(productId) {
    Alert.alert('Hapus Item', 'Hapus item ini dari keranjang?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const next = cart.filter((item) => item.productId !== productId);
          setCart(next);
          await saveData(STORAGE_KEYS.CART, next);
        },
      },
    ]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function handleCheckout() {
    if (cart.length === 0) return;

    setCheckingOut(true);
    const history = await loadData(STORAGE_KEYS.HISTORY, []);
    const transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart,
      total,
    };
    await saveData(STORAGE_KEYS.HISTORY, [transaction, ...history]);
    await saveData(STORAGE_KEYS.CART, []);
    setCart([]);
    setCheckingOut(false);
    Alert.alert('Transaksi Berhasil', `Total ${formatRupiah(total)} tersimpan di riwayat.`);
  }

  if (loading) {
    return <LoadingSpinner label="Memuat keranjang..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.rowPrice}>{formatRupiah(item.price)}</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => updateQty(item.productId, -1)}
              >
                <Ionicons name="remove" size={16} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.qty}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => updateQty(item.productId, 1)}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.productId)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🛒"
            title="Keranjang masih kosong"
            message="Tambahkan produk dari katalog untuk mulai berbelanja."
          />
        }
        contentContainerStyle={cart.length === 0 && styles.emptyContainer}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            disabled={checkingOut}
          >
            <Text style={styles.checkoutButtonText}>
              {checkingOut ? 'Memproses...' : 'Checkout'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyContainer: { flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: '600', color: colors.text },
  rowPrice: { fontSize: 13, color: colors.primary, marginTop: 2 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginRight: 8,
  },
  stepperButton: { paddingHorizontal: 10, paddingVertical: 6 },
  qtyValue: { fontSize: 14, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  removeButton: { padding: 6 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: { fontSize: 15, color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  checkoutButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
