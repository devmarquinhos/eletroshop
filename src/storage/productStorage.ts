import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product } from '@/types/product';

const PRODUCTS_STORAGE_KEY = '@eletroshop:products';

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

    return parsedProducts as Product[];
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