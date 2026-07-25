import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/BrandLogo';
import { BackButton } from '@/components/BackButton';
import { ProductItem } from '@/components/ProductItem';
import { Colors, EletroShopColors } from '@/constants/theme';
import {
  clearLocalProducts,
  loadProductsLocally,
} from '@/services/productStorage';
import type { Product } from '@/types/product';

import { styles } from './styles';

export function LocalProductsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocalProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProducts(await loadProductsLocally());
    } catch (caughtError) {
      setProducts([]);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível carregar os produtos locais.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLocalProducts();
    }, [loadLocalProducts]),
  );

  async function handleClearProducts() {
    if (clearing) return;

    try {
      setClearing(true);
      await clearLocalProducts();
      setProducts([]);
      setError(null);
      Alert.alert(
        'Dados locais removidos',
        'A cópia armazenada no dispositivo foi limpa. Os produtos da API não foram excluídos.',
      );
    } catch (caughtError) {
      Alert.alert(
        'Não foi possível limpar',
        caughtError instanceof Error ? caughtError.message : 'Tente novamente.',
      );
    } finally {
      setClearing(false);
    }
  }

  function confirmClearProducts() {
    Alert.alert(
      'Limpar produtos locais?',
      'Essa ação remove somente a cópia armazenada no dispositivo e não altera os produtos da API.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => void handleClearProducts(),
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <BackButton />
        <ActivityIndicator size="large" color={EletroShopColors.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando produtos locais...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View>
            <BrandLogo compact textColor={theme.text} />
            <BackButton />

            <Text style={[styles.title, { color: theme.text }]}>
              Produtos armazenados
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Esta é a última cópia salva no dispositivo e pode não representar
              os dados mais recentes da API.
            </Text>

            <View style={styles.localNotice}>
              <Text style={styles.localNoticeTitle}>Dados locais</Text>
              <Text style={styles.localNoticeText}>
                A API continua sendo a fonte principal dos produtos.
              </Text>
            </View>

            {error && (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void loadLocalProducts()}
                  style={styles.retryLink}>
                  <Text style={styles.retryLinkText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.listHeader}>
              <View>
                <Text style={[styles.listTitle, { color: theme.text }]}>
                  Cópia disponível
                </Text>
                <Text style={[styles.counter, { color: theme.textSecondary }]}>
                  {products.length}{' '}
                  {products.length === 1 ? 'produto salvo' : 'produtos salvos'}
                </Text>
              </View>

              {products.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  disabled={clearing}
                  onPress={confirmClearProducts}
                  style={({ pressed }) => [
                    styles.clearButton,
                    (pressed || clearing) && styles.disabled,
                  ]}>
                  {clearing ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.clearButtonText}>Limpar dados</Text>
                  )}
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Nenhum produto armazenado
              </Text>
              <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                Acesse a listagem principal para carregar os produtos da API e
                criar uma cópia local.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/products')}
                style={({ pressed }) => [
                  styles.productsButton,
                  pressed && styles.disabled,
                ]}>
                <Text style={styles.productsButtonText}>Abrir produtos</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onPress={() =>
              router.push({
                pathname: '/products/[id]',
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}
