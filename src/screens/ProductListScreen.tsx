import { useProducts } from '@/hooks/use-products';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProductListScreen() {

  const {
  products,
  loading,
  error,
  refreshing,
  reloadProducts,
  refreshProducts,
} = useProducts();

  if (loading && products.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0052FF" />

        <ThemedText style={styles.loadingText}>
          Carregando produtos...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error && products.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorTitle}>
          Erro ao carregar
        </ThemedText>

        <ThemedText style={styles.errorMessage}>
          {error}
        </ThemedText>

        <Pressable
          onPress={() => void reloadProducts()}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <ThemedText style={styles.buttonText}>
            Tentar novamente
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Lista de produtos
        </ThemedText>

        <ThemedText style={styles.counter}>
          {products.length}{' '}
          {products.length === 1
            ? 'produto carregado'
            : 'produtos carregados'}
        </ThemedText>

        {error && (
          <ThemedText style={styles.inlineError}>
            {error}
          </ThemedText>
        )}

        <Pressable
          disabled={refreshing}
          onPress={() => void refreshProducts()}
          style={({ pressed }) => [
            styles.refreshButton,
            (pressed || refreshing) && styles.buttonPressed,
          ]}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.buttonText}>
              Atualizar lista
            </ThemedText>
          )}
        </Pressable>
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
  title: {
    color: '#1A1D29',
  },
  counter: {
    marginTop: 8,
    color: '#6B7280',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E53935',
  },
  errorMessage: {
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6B7280',
  },
  inlineError: {
    marginTop: 12,
    color: '#E53935',
  },
  refreshButton: {
    minHeight: 48,
    marginTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#0052FF',
  },
  retryButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#0052FF',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});