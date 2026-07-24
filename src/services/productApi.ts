import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/types/product';

const REQUEST_TIMEOUT_MS = 10_000;

export const PRODUCT_API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080'
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

export function isProduct(value: unknown): value is Product {
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

function normalizeApiProduct(value: unknown): Product | null {
  if (!value || typeof value !== 'object') return null;

  const product = value as Record<string, unknown>;
  const idIsValid =
    typeof product.id === 'string' ||
    (typeof product.id === 'number' && Number.isFinite(product.id));
  const available =
    typeof product.available === 'boolean'
      ? product.available
      : product.isAvailable;

  if (
    !idIsValid ||
    typeof product.name !== 'string' ||
    typeof product.description !== 'string' ||
    typeof product.category !== 'string' ||
    typeof product.price !== 'number' ||
    !Number.isFinite(product.price) ||
    typeof product.quantity !== 'number' ||
    !Number.isSafeInteger(product.quantity) ||
    typeof available !== 'boolean'
  ) {
    return null;
  }

  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
    available,
  };
}

function getErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object') {
    const errorBody = body as Record<string, unknown>;
    const summary =
      typeof errorBody.message === 'string'
        ? errorBody.message
        : typeof errorBody.detail === 'string'
          ? errorBody.detail
          : null;
    const fieldErrors =
      errorBody.errors && typeof errorBody.errors === 'object'
        ? Object.values(errorBody.errors as Record<string, unknown>).filter(
            (error): error is string => typeof error === 'string',
          )
        : [];

    if (summary && fieldErrors.length > 0) {
      return `${summary} ${fieldErrors.join(' ')}`;
    }

    if (summary) return summary;
  }

  return `A solicitação falhou (${status}).`;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function requestJson(path: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${PRODUCT_API_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      signal: controller.signal,
    });
    const body = await readJson(response);

    if (!response.ok) {
      throw new ProductApiError(
        getErrorMessage(body, response.status),
        response.status,
      );
    }

    return body;
  } catch (error) {
    if (error instanceof ProductApiError) throw error;

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ProductApiError(
        'A API demorou demais para responder. Tente novamente.',
      );
    }

    throw new ProductApiError(
      'Não foi possível conectar à API. Verifique o endereço e a rede.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

function parseProduct(body: unknown): Product {
  const product = normalizeApiProduct(body);

  if (!product) {
    throw new ProductApiError(
      'A API retornou um produto em formato inválido.',
    );
  }

  return product;
}

export async function getProducts(): Promise<Product[]> {
  const body = await requestJson('/products');

  if (!Array.isArray(body)) {
    throw new ProductApiError(
      'A API retornou uma lista de produtos em formato inválido.',
    );
  }

  return body.map(parseProduct);
}

export async function getProductById(id: string): Promise<Product> {
  return parseProduct(
    await requestJson(`/products/${encodeURIComponent(id)}`),
  );
}

export async function createProduct(
  product: CreateProductInput,
): Promise<Product> {
  return parseProduct(
    await requestJson('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  );
}

export async function updateProduct(
  id: string,
  product: UpdateProductInput,
): Promise<Product> {
  return parseProduct(
    await requestJson(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await requestJson(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
