import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { ProductItem } from '@/components/ProductItem';
import { Colors, EletroShopColors } from '@/constants/theme';
import { useProducts } from '@/hooks/use-products';

export default function ProductListScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const accent =
    scheme === 'dark' ? EletroShopColors.darkAccent : EletroShopColors.accent;
  const hasFocused = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const {
    products,
    loading,
    error,
    refreshing,
    source,
    reloadProducts,
    refreshProducts,
  } = useProducts();

  useFocusEffect(
    useCallback(() => {
      if (hasFocused.current) {
        void reloadProducts();
      } else {
        hasFocused.current = true;
      }
    }, [reloadProducts]),
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.category).filter(Boolean)),
      ).sort((left, right) => left.localeCompare(right, 'pt-BR')),
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (!selectedCategory || product.category === selectedCategory) &&
          (!onlyAvailable || (product.available && product.quantity > 0)),
      ),
    [onlyAvailable, products, selectedCategory],
  );

  if (loading && products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={EletroShopColors.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando produtos...
        </Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorTitle}>Erro ao carregar</Text>
        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {error}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void reloadProducts()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: EletroShopColors.primary },
            pressed && styles.pressed,
          ]}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(product) => product.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refreshProducts()}
            colors={[EletroShopColors.primary]}
            tintColor={EletroShopColors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <BrandLogo compact textColor={theme.text} />

            <View style={styles.titleRow}>
              <View style={styles.titleText}>
                <Text style={[styles.title, { color: theme.text }]}>Produtos</Text>
                <Text style={[styles.counter, { color: theme.textSecondary }]}>
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/create-product')}
                style={({ pressed }) => [
                  styles.createButton,
                  { backgroundColor: accent },
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.buttonText}>Novo produto</Text>
              </Pressable>
            </View>

            {source === 'local' && (
              <View style={styles.localNotice}>
                <Text style={styles.localNoticeText}>
                  Dados locais — a lista pode não estar atualizada.
                </Text>
              </View>
            )}

            {error && products.length > 0 && (
              <Text style={styles.inlineError}>{error}</Text>
            )}

            <Text style={[styles.filterLabel, { color: theme.text }]}>
              Categoria
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}>
              <FilterChip
                label="Todas"
                selected={selectedCategory === null}
                onPress={() => setSelectedCategory(null)}
                textColor={theme.text}
              />
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  selected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                  textColor={theme.text}
                />
              ))}
            </ScrollView>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: onlyAvailable }}
              onPress={() => setOnlyAvailable((current) => !current)}
              style={styles.availabilityFilter}>
              <View
                style={[
                  styles.checkbox,
                  onlyAvailable && {
                    backgroundColor: EletroShopColors.primary,
                    borderColor: EletroShopColors.primary,
                  },
                ]}>
                {onlyAvailable && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.availabilityText, { color: theme.text }]}>
                Mostrar somente disponíveis
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {products.length === 0
                ? 'Nenhum produto cadastrado'
                : 'Nenhum produto encontrado'}
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
              {products.length === 0
                ? 'Cadastre o primeiro produto para começar.'
                : 'Altere os filtros para visualizar outros produtos.'}
            </Text>
          </View>
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

function FilterChip({
  label,
  selected,
  onPress,
  textColor,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  textColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.filterChip,
        selected && {
          backgroundColor: EletroShopColors.primary,
          borderColor: EletroShopColors.primary,
        },
      ]}>
      <Text style={[styles.filterChipText, { color: selected ? '#FFFFFF' : textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
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
  loadingText: {
    marginTop: 12,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  counter: {
    marginTop: 4,
  },
  createButton: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
  localNotice: {
    backgroundColor: '#FFF3E8',
    borderColor: EletroShopColors.accent,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 12,
  },
  localNoticeText: {
    color: '#8A3B00',
    fontSize: 13,
    fontWeight: '700',
  },
  inlineError: {
    color: EletroShopColors.danger,
    marginTop: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 24,
  },
  categoryList: {
    gap: 8,
    paddingVertical: 12,
  },
  filterChip: {
    borderColor: EletroShopColors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  availabilityFilter: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: EletroShopColors.border,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    marginRight: 10,
    width: 22,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyMessage: {
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
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
  retryButton: {
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
