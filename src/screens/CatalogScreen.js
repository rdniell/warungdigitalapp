import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadData, saveData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const SEED_PRODUCTS = [
  { id: '1', name: 'Indomie Goreng', price: 3500, stock: 50, photo: null },
  { id: '2', name: 'Aqua 600ml', price: 4000, stock: 100, photo: null },
  { id: '3', name: 'Teh Botol Sosro', price: 5000, stock: 40, photo: null },
  { id: '4', name: 'Chitato 68g', price: 11000, stock: 25, photo: null },
  { id: '5', name: 'Kopi Kapal Api Sachet', price: 1500, stock: 200, photo: null },
];

export default function CatalogScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    let stored = await loadData(STORAGE_KEYS.PRODUCTS);
    if (!stored) {
      stored = SEED_PRODUCTS;
      await saveData(STORAGE_KEYS.PRODUCTS, stored);
    }
    setProducts(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  function confirmDelete(product) {
    Alert.alert('Hapus Produk', `Hapus "${product.name}" dari katalog?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const next = products.filter((p) => p.id !== product.id);
          setProducts(next);
          await saveData(STORAGE_KEYS.PRODUCTS, next);
        },
      },
    ]);
  }

  if (loading) {
    return <LoadingSpinner label="Memuat katalog..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetail', {
                productId: item.id,
                productName: item.name,
              })
            }
            rightAction={
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item)}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🛍️"
            title="Belum ada produk"
            message="Tambahkan produk pertama untuk warungmu."
          />
        }
        contentContainerStyle={products.length === 0 && styles.emptyContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyContainer: { flexGrow: 1 },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
