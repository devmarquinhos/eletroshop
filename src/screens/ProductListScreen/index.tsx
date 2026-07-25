import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
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
import { useProducts } from '@/hooks/use-products';

export function ProductListScreen() {
  const router = useRouter();
  const { status } = useLocalSearchParams<{ status?: string }>();
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
        <BackButton />
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
        <BackButton />
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
            <BackButton />

            {(status === 'created' || status === 'deleted') && (
              <View style={styles.successNotice}>
                <Text style={styles.successNoticeText}>
                  {status === 'created'
                    ? 'Produto cadastrado com sucesso.'
                    : 'Produto excluído com sucesso.'}
                </Text>
              </View>
            )}

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
