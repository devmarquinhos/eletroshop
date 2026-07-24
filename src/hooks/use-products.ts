import { useCallback, useEffect, useState } from 'react';

import { getProducts } from '@/services/productApi';
import {
  loadProductsLocally,
  saveProductsLocally,
} from '@/services/productStorage';
import type { Product } from '@/types/product';

export type ProductsSource = 'api' | 'local' | null;

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  source: ProductsSource;
  reloadProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<ProductsSource>(null);

  const loadProducts = useCallback(
    async (isRefresh: boolean) => {
      let cachedProducts: Product[] = [];

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        if (!isRefresh) {
          try {
            cachedProducts = await loadProductsLocally();
          } catch (storageError) {
            console.warn('Não foi possível ler o cache local:', storageError);
          }

          if (cachedProducts.length > 0) {
            setProducts(cachedProducts);
            setSource('local');
            setLoading(false);
          }
        }

        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        setSource('api');

        try {
          await saveProductsLocally(loadedProducts);
        } catch (storageError) {
          console.warn('Não foi possível atualizar o cache local:', storageError);
        }
      } catch (caughtError) {
        console.error('Erro ao carregar produtos:', caughtError);
        setError(
          cachedProducts.length > 0
            ? 'A API está indisponível. Exibindo a última lista salva.'
            : caughtError instanceof Error
              ? caughtError.message
              : 'Não foi possível carregar os produtos.',
        );
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
    source,
    reloadProducts,
    refreshProducts,
  };
}
