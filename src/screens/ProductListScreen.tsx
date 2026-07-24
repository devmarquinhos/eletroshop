import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockProducts } from '@/mocks/products';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Product } from '@/types/product';

export default function ProductListScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    async function loadProducts() {
  try {
    setLoading(true);
    setError(null);

    setProducts(mockProducts);
  } catch {
    setError('Não foi possível carregar os produtos.');
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadProducts();
}, []);
    
    useEffect(() => {
        loadProducts();
    }, []);
    if (loading) {
  return (
    <ThemedView style={styles.centered}>
      <ActivityIndicator size="large" color="#0052FF" />
      <ThemedText style={styles.loadingText}>
        Carregando produtos...
      </ThemedText>
    </ThemedView>
  );
}

    return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="title">Lista de produtos</ThemedText>

        <ThemedText style={styles.counter}>
          {products.length} produtos carregados
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  counter: {
    marginTop: 8,
    color: '#6B7280',
  },
  centered: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F5F7FA',
},
loadingText: {
  marginTop: 12,
  color: '#6B7280',
},
});