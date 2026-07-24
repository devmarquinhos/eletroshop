import type { CreateProductInput, Product } from '@/types/product';

const REQUEST_TIMEOUT_MS = 10_000;

export const PRODUCT_API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export class ProductApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ProductApiError';
  }
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    typeof product.quantity === 'number' &&
    typeof product.available === 'boolean'
  );
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function createProduct(product: CreateProductInput): Promise<Product> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${PRODUCT_API_URL}/products`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
      signal: controller.signal,
    });

    const body = await readJson(response);

    if (!response.ok) {
      const message =
        body && typeof body === 'object' && 'message' in body
          ? String(body.message)
          : `Não foi possível cadastrar o produto (${response.status}).`;

      throw new ProductApiError(message, response.status);
    }

    if (!isProduct(body)) {
      throw new ProductApiError('A API retornou um produto em formato inválido.');
    }

    return body;
  } catch (error) {
    if (error instanceof ProductApiError) throw error;

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ProductApiError('A API demorou demais para responder. Tente novamente.');
    }

    throw new ProductApiError('Não foi possível conectar à API. Verifique o endereço e a rede.');
  } finally {
    clearTimeout(timeout);
  }
}
