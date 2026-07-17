export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  available: boolean;
};

export type CreateProductInput = Pick<
  Product,
  'name' | 'description' | 'category' | 'price' | 'quantity'
>;
