import AsyncStorage from '@react-native-async-storage/async-storage';

import { isProduct } from '@/services/productApi';
import type { Product } from '@/types/product';

const PRODUCTS_STORAGE_KEY = '@eletroshop:products';

export async function saveProductsLocally(products: Product[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch {
    throw new Error('Não foi possível salvar a lista de produtos no dispositivo.');
  }
}

export async function loadProductsLocally(): Promise<Product[]> {
  try {
    const serializedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!serializedProducts) return [];

    const parsedProducts: unknown = JSON.parse(serializedProducts);
    if (!Array.isArray(parsedProducts)) return [];

    return parsedProducts.filter(isProduct);
  } catch {
    throw new Error('Não foi possível carregar os produtos salvos no dispositivo.');
  }
}

export async function clearLocalProducts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PRODUCTS_STORAGE_KEY);
  } catch {
    throw new Error('Não foi possível limpar os produtos salvos no dispositivo.');
  }
}
