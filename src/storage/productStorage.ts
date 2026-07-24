import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product } from '@/types/product';

const PRODUCTS_STORAGE_KEY = '@eletroshop:products';

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    (typeof product.id === 'string' ||
      typeof product.id === 'number') &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    typeof product.quantity === 'number' &&
    typeof product.available === 'boolean'
  );
}

export async function saveProducts(
  products: Product[],
): Promise<void> {
  try {
    const productsJson = JSON.stringify(products);

    await AsyncStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      productsJson,
    );
  } catch (error) {
    console.error('Erro ao salvar produtos:', error);
    throw error;
  }
}

export async function getStoredProducts(): Promise<Product[]> {
  try {
    const productsJson = await AsyncStorage.getItem(
      PRODUCTS_STORAGE_KEY,
    );

    if (!productsJson) {
      return [];
    }

    const parsedProducts: unknown = JSON.parse(productsJson);

    if (!Array.isArray(parsedProducts)) {
  return [];
}

const validProducts = parsedProducts.filter(isProduct);

if (validProducts.length !== parsedProducts.length) {
  console.warn(
    'Alguns produtos inválidos foram ignorados no armazenamento.',
  );
}

return validProducts;

  } catch (error) {
    console.error('Erro ao recuperar produtos:', error);
    return [];
  }
}

export async function clearStoredProducts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PRODUCTS_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao remover produtos salvos:', error);
    throw error;
  }
}