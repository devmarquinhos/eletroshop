import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { Colors, EletroShopColors } from '@/constants/theme';
import { getProductById } from '@/services/productApi';
import { loadProductsLocally } from '@/services/productStorage';
import type { Product } from '@/types/product';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocalData, setIsLocalData] = useState(false);

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

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    marginHorizontal: 'auto',
    maxWidth: 760,
    padding: 24,
    paddingBottom: 48,
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12 },
  backLink: {
    alignSelf: 'flex-start',
    marginTop: 24,
    paddingVertical: 8,
  },
  localNotice: {
    backgroundColor: '#FFF3E8',
    borderColor: EletroShopColors.accent,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  localNoticeText: {
    color: '#8A3B00',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    marginTop: 18,
    padding: 24,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  titleContent: { flex: 1 },
  category: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginTop: 5,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 24,
    marginTop: 20,
  },
  detailRow: {
    borderTopColor: EletroShopColors.border,
    borderTopWidth: 1,
    paddingVertical: 15,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  descriptionSection: {
    borderTopColor: EletroShopColors.border,
    borderTopWidth: 1,
    paddingTop: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  errorTitle: {
    color: EletroShopColors.danger,
    fontSize: 22,
    fontWeight: '800',
  },
  errorMessage: {
    marginBottom: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
