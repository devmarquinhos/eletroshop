import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

const PRODUCTS_CACHE_KEY = '@eletroshop:products_cache';

export const saveProductsLocally = async (products: Product[]): Promise<void> =>
{
    try
    {
        const serialized = JSON.stringify(products);
        await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, serialized);
    }
    catch (error)
    {
        throw new Error('Falha ao gravar no cache local');
    }
};

export const loadProductsLocally = async (): Promise<Product[]> =>
{
    try
    {
        const serialized = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
        if (serialized === null)
        {
            return [];
        }
        return JSON.parse(serialized) as Product[];
    }
    catch (error)
    {
        throw new Error('Falha ao ler do cache local');
    }
};

export const clearLocalProducts = async (): Promise<void> =>
{
    try
    {
        await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
    }
    catch (error)
    {
        throw new Error('Falha ao limpar o cache local');
    }
};
