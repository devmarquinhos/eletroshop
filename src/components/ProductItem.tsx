import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { Colors, EletroShopColors } from '@/constants/theme';
import type { Product } from '@/types/product';

type ProductItemProps = {
  product: Product;
  onPress: () => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function ProductItem({ product, onPress }: ProductItemProps) {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const isAvailable = product.available && product.quantity > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${product.name}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
          {product.name}
        </Text>
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
            style={[
              styles.statusText,
              {
                color: isAvailable
                  ? EletroShopColors.success
                  : EletroShopColors.danger,
              },
            ]}>
            {isAvailable ? 'Disponível' : 'Indisponível'}
          </Text>
        </View>
      </View>

      <Text style={[styles.category, { color: theme.textSecondary }]}>
        {product.category || 'Sem categoria'}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.price, { color: theme.text }]}>
          {currencyFormatter.format(product.price)}
        </Text>
        <Text style={[styles.quantity, { color: theme.textSecondary }]}>
          {product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    gap: 8,
    padding: 18,
  },
  pressed: {
    opacity: 0.72,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  category: {
    fontSize: 13,
  },
  footer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  },
  quantity: {
    fontSize: 13,
  },
});
