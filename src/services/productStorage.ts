import { Product } from '../types/Product';
 
// Simula o AsyncStorage guardando os dados em memória.
let cache: Product[] = [];
 
export async function saveProductsLocally(products: Product[]): Promise<void> {
  cache = products;
  // await AsyncStorage.setItem('@products', JSON.stringify(products));
}
 
export async function loadProductsLocally(): Promise<Product[]> {
  // const json = await AsyncStorage.getItem('@products');
  // return json ? JSON.parse(json) : [];
  return cache;
}
 
export async function clearLocalProducts(): Promise<void> {
  cache = [];
  // await AsyncStorage.removeItem('@products');
}
 
 