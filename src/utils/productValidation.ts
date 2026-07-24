import type { CreateProductInput } from '@/types/product';

export type ProductFormErrors = Partial<
  Record<'name' | 'description' | 'category' | 'price' | 'quantity', string>
>;

type ProductFormValues = {
  name: string;
  description: string;
  category: string;
  price: string;
  quantity: string;
};

type ProductValidationResult =
  | { data: CreateProductInput; errors: null }
  | { data: null; errors: ProductFormErrors };

function parsePrice(value: string) {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseQuantity(value: string) {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function validateProductForm(
  values: ProductFormValues,
): ProductValidationResult {
  const errors: ProductFormErrors = {};
  const price = parsePrice(values.price);
  const quantity = parseQuantity(values.quantity);

  if (!values.name.trim()) errors.name = 'Informe o nome do produto.';
  if (!values.description.trim()) {
    errors.description = 'Informe a descrição do produto.';
  }
  if (!values.category.trim()) {
    errors.category = 'Informe a categoria do produto.';
  }

  if (!values.price.trim()) {
    errors.price = 'Informe o preço do produto.';
  } else if (price === null) {
    errors.price =
      'Use um preço igual ou maior que zero, com até 2 casas decimais.';
  }

  if (quantity === null) {
    errors.quantity = 'Use um número inteiro igual ou maior que zero.';
  }

  if (Object.keys(errors).length > 0 || price === null || quantity === null) {
    return { data: null, errors };
  }

  return {
    data: {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      price,
      quantity,
    },
    errors: null,
  };
}
