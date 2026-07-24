import { useCallback, useEffect, useState } from 'react';

import { mockProducts } from '@/mocks/products';
import {
  getStoredProducts,
  saveProducts,
} from '@/storage/productStorage';
import type { Product } from '@/types/product';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  reloadProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(
    async (isRefresh: boolean) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        if (!isRefresh) {
          const storedProducts = await getStoredProducts();

          if (storedProducts.length > 0) {
            setProducts(storedProducts);
            setLoading(false);
          }
        }

        // Simula a futura chamada getProducts().
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Será substituído pelos dados da API.
        const loadedProducts = mockProducts;

        setProducts(loadedProducts);
        await saveProducts(loadedProducts);
      } catch (caughtError) {
        console.error('Erro ao carregar produtos:', caughtError);

        setError('Não foi possível atualizar os produtos.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const reloadProducts = useCallback(async () => {
    await loadProducts(false);
  }, [loadProducts]);

  const refreshProducts = useCallback(async () => {
    await loadProducts(true);
  }, [loadProducts]);

  useEffect(() => {
    void reloadProducts();
  }, [reloadProducts]);

  return {
    products,
    loading,
    error,
    refreshing,
    reloadProducts,
    refreshProducts,
  };
}