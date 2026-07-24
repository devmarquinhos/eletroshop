export interface Product {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  available: boolean;
}