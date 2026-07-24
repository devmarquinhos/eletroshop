export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  available: boolean;
}

export type CreateProductInput = Omit<Product, 'id' | 'available'>;
