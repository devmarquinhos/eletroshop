import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

import { BrandLogo } from '@/components/BrandLogo';
import { Colors, EletroShopColors } from '@/constants/theme';
import { deleteProduct, getProductById } from '@/services/productApi';
import { loadProductsLocally } from '@/services/productStorage';
import type { Product } from '@/types/product';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocalData, setIsLocalData] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProduct = useCallback(async () => {
    if (!id) {
      setError('Identificador do produto não informado.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProduct(await getProductById(id));
      setIsLocalData(false);
    } catch (apiError) {
      try {
        const localProducts = await loadProductsLocally();
        const localProduct = localProducts.find((item) => item.id === id);

        if (localProduct) {
          setProduct(localProduct);
          setIsLocalData(true);
          setError('A API está indisponível. Exibindo os dados salvos.');
          return;
        }
      } catch {
        // A mensagem da API é mais útil quando nenhum dado local está disponível.
      }

      setProduct(null);
      setError(
        apiError instanceof Error
          ? apiError.message
          : 'Não foi possível carregar o produto.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  async function handleDelete() {
    if (!id || deleting) return;

    try {
      setDeleting(true);
      await deleteProduct(id);
      Alert.alert('Produto excluído', 'O produto foi removido com sucesso.', [
        { text: 'OK', onPress: () => router.replace('/products') },
      ]);
    } catch (deleteError) {
      Alert.alert(
        'Não foi possível excluir',
        deleteError instanceof Error
          ? deleteError.message
          : 'Verifique a conexão e tente novamente.',
      );
    } finally {
      setDeleting(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Excluir produto?',
      `Essa ação removerá “${product?.name ?? 'este produto'}” da API e não poderá ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void handleDelete(),
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={EletroShopColors.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando produto...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorTitle}>Produto não encontrado</Text>
        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {error}
        </Text>
        <Pressable
          onPress={() => void loadProduct()}
          style={[styles.primaryButton, { backgroundColor: EletroShopColors.primary }]}>
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: EletroShopColors.primary }}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const isAvailable = product.available && product.quantity > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BrandLogo compact textColor={theme.text} />

        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: EletroShopColors.primary }}>← Voltar para produtos</Text>
        </Pressable>

        {isLocalData && (
          <View style={styles.localNotice}>
            <Text style={styles.localNoticeText}>{error}</Text>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={[styles.category, { color: theme.textSecondary }]}>
                {product.category || 'Sem categoria'}
              </Text>
              <Text style={[styles.title, { color: theme.text }]}>{product.name}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isAvailable
                    ? `${EletroShopColors.success}1A`
                    : `${EletroShopColors.danger}1A`,
                },
              ]}>
              <Text
                style={{
                  color: isAvailable
                    ? EletroShopColors.success
                    : EletroShopColors.danger,
                  fontWeight: '800',
                }}>
                {isAvailable ? 'Disponível' : 'Indisponível'}
              </Text>
            </View>
          </View>

          <Text style={[styles.price, { color: theme.text }]}>
            {currencyFormatter.format(product.price)}
          </Text>

          <DetailRow
            label="Quantidade em estoque"
            value={`${product.quantity} ${product.quantity === 1 ? 'unidade' : 'unidades'}`}
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
          />
          <DetailRow
            label="Identificador"
            value={product.id}
            textColor={theme.text}
            secondaryColor={theme.textSecondary}
          />

          <View style={styles.descriptionSection}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Descrição
            </Text>
            <Text style={[styles.description, { color: theme.text }]}>
              {product.description || 'Nenhuma descrição informada.'}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={deleting}
              onPress={() =>
                router.push({
                  pathname: '/products/[id]/edit',
                  params: { id: product.id },
                })
              }
              style={[
                styles.editButton,
                { backgroundColor: EletroShopColors.primary },
                deleting && styles.disabled,
              ]}>
              <Text style={styles.primaryButtonText}>Editar produto</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={deleting}
              onPress={confirmDelete}
              style={[styles.deleteButton, deleting && styles.disabled]}>
              {deleting ? (
                <ActivityIndicator color={EletroShopColors.danger} />
              ) : (
                <Text style={styles.deleteButtonText}>Excluir produto</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  textColor,
  secondaryColor,
}: {
  label: string;
  value: string;
  textColor: string;
  secondaryColor: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: secondaryColor }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}
