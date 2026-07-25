import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

import { BrandLogo } from '@/components/BrandLogo';
import { BackButton } from '@/components/BackButton';
import { ProductItem } from '@/components/ProductItem';
import { Colors, EletroShopColors } from '@/constants/theme';
import { getProducts, PRODUCT_API_URL } from '@/services/productApi';
import type { Product } from '@/types/product';

type ConnectionState = 'checking' | 'connected' | 'error';

export function ApiProductsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<ConnectionState>('checking');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setConnection('checking');
      setError(null);
      const apiProducts = await getProducts();
      setProducts(apiProducts);
      setConnection('connected');
      setLastUpdate(new Date());
    } catch (caughtError) {
      setConnection('error');
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível consultar a API.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  if (loading && products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <BackButton />
        <ActivityIndicator size="large" color={EletroShopColors.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Consultando a API...
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadProducts(true)}
            colors={[EletroShopColors.primary]}
            tintColor={EletroShopColors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <BrandLogo compact textColor={theme.text} />
            <BackButton />

            <Text style={[styles.title, { color: theme.text }]}>
              Consulta direta à API
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Esta tela não utiliza a cópia local. Todos os dados abaixo foram
              solicitados diretamente ao serviço externo.
            </Text>

            <View style={[styles.connectionCard, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.connectionHeader}>
                <View
                  style={[
                    styles.connectionDot,
                    {
                      backgroundColor:
                        connection === 'connected'
                          ? EletroShopColors.success
                          : connection === 'error'
                            ? EletroShopColors.danger
                            : EletroShopColors.accent,
                    },
                  ]}
                />
                <Text style={[styles.connectionTitle, { color: theme.text }]}>
                  {connection === 'connected'
                    ? 'API conectada'
                    : connection === 'error'
                      ? 'Falha na conexão'
                      : 'Verificando conexão'}
                </Text>
              </View>

              <Text style={[styles.apiLabel, { color: theme.textSecondary }]}>
                Endereço utilizado
              </Text>
              <Text selectable style={[styles.apiUrl, { color: theme.text }]}>
                {PRODUCT_API_URL}
              </Text>

              {lastUpdate && (
                <Text style={[styles.lastUpdate, { color: theme.textSecondary }]}>
                  Última resposta: {lastUpdate.toLocaleTimeString('pt-BR')}
                </Text>
              )}
            </View>

            {error && (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  disabled={refreshing}
                  onPress={() => void loadProducts(true)}
                  style={styles.retryLink}>
                  <Text style={styles.retryLinkText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.listHeader}>
              <View>
                <Text style={[styles.listTitle, { color: theme.text }]}>
                  Resposta da API
                </Text>
                <Text style={[styles.counter, { color: theme.textSecondary }]}>
                  {products.length}{' '}
                  {products.length === 1 ? 'produto recebido' : 'produtos recebidos'}
                </Text>
              </View>
              <Pressable
                disabled={refreshing}
                onPress={() => void loadProducts(true)}
                style={({ pressed }) => [
                  styles.updateButton,
                  { backgroundColor: EletroShopColors.primary },
                  (pressed || refreshing) && styles.disabled,
                ]}>
                {refreshing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Atualizar</Text>
                )}
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                A API não retornou produtos
              </Text>
              <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                Cadastre um produto ou atualize a consulta.
              </Text>
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
