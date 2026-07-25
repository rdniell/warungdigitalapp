import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadData, STORAGE_KEYS } from '../services/storage';
import { colors } from '../constants/colors';
import { formatRupiah } from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchHistory() {
        const stored = await loadData(STORAGE_KEYS.HISTORY, []);
        setHistory(stored);
        setLoading(false);
      }
      fetchHistory();
    }, [])
  );

  if (loading) {
    return <LoadingSpinner label="Memuat riwayat..." />;
  }

  return (
    <FlatList
      style={styles.container}
      data={history}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <Text style={styles.total}>{formatRupiah(item.total)}</Text>
          </View>
          <Text style={styles.itemsSummary} numberOfLines={2}>
            {item.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <EmptyState
          icon="🧾"
          title="Belum ada transaksi"
          message="Riwayat transaksi akan muncul setelah checkout."
        />
      }
      contentContainerStyle={history.length === 0 && styles.emptyContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyContainer: { flexGrow: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  date: { fontSize: 12, color: colors.textMuted },
  total: { fontSize: 15, fontWeight: '700', color: colors.primary },
  itemsSummary: { fontSize: 13, color: colors.text },
});
