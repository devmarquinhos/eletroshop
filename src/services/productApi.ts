import type { CreateProductInput, Product } from '@/types/product';

export const PRODUCT_API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message;
  } catch {
    return undefined;
  }
}

export async function createProduct(product: CreateProductInput): Promise<Product> {
  const response = await fetch(`${PRODUCT_API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? `Não foi possível cadastrar o produto (${response.status}).`);
  }

  return (await response.json()) as Product;
}
