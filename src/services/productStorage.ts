// src/services/productStorage.ts
// ATENÇÃO: Este é um MOCK temporário criado apenas para testes da Equipe 2.
// Quando a Equipe 5 entregar o arquivo real com AsyncStorage, substitua
// este arquivo por inteiro pelo deles.
 
import { Product } from '../types/Product';
 
// Simula o AsyncStorage guardando os dados em memória.
let cache: Product[] = [];
 
export async function saveProductsLocally(products: Product[]): Promise<void> {
  cache = products;
  // Versão real (Equipe 5) deve usar algo como:
  // await AsyncStorage.setItem('@products', JSON.stringify(products));
}
 
export async function loadProductsLocally(): Promise<Product[]> {
  // Versão real (Equipe 5):
  // const json = await AsyncStorage.getItem('@products');
  // return json ? JSON.parse(json) : [];
  return cache;
}
 
export async function clearLocalProducts(): Promise<void> {
  cache = [];
  // Versão real (Equipe 5):
  // await AsyncStorage.removeItem('@products');
}
 
 