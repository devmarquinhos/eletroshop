// src/components/ProductItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types/Product';

interface ProductItemProps {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductItem({ product, onPress }: ProductItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.info}>
        <Text style={styles.nome}>{product.nome}</Text>
        <Text style={styles.categoria}>{product.categoria}</Text>
        <Text style={styles.detalhes}>
          R$ {product.preco.toFixed(2)} · Qtd: {product.quantidade}
        </Text>
      </View>

      <View
        style={[
          styles.badge,
          product.disponivel ? styles.badgeDisponivel : styles.badgeIndisponivel,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            product.disponivel ? styles.badgeTextDisponivel : styles.badgeTextIndisponivel,
          ]}
        >
          {product.disponivel ? 'Disponível' : 'Indisponível'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#1D6FE0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2E',
  },
  categoria: {
    fontSize: 12,
    color: '#1D6FE0',
    fontWeight: '600',
    marginTop: 2,
  },
  detalhes: {
    fontSize: 14,
    marginTop: 4,
    color: '#3A3A3C',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeDisponivel: {
    backgroundColor: '#E3EEFC',
  },
  badgeIndisponivel: {
    backgroundColor: '#EFEFF1',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3A3A3C',
  },
  badgeTextDisponivel: {
    color: '#1D6FE0',
  },
  badgeTextIndisponivel: {
    color: '#8A8A8E',
  },
});
