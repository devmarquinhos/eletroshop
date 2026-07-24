import type { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: 'produto-1',
    name: 'Notebook Gamer',
    description: 'Notebook com 16 GB de memória RAM e SSD de 512 GB.',
    category: 'Computadores',
    price: 4599.9,
    quantity: 5,
    available: true,
  },
  {
    id: 'produto-2',
    name: 'Mouse sem fio',
    description: 'Mouse ergonômico com conexão USB.',
    category: 'Periféricos',
    price: 89.9,
    quantity: 12,
    available: true,
  },
  {
    id: 'produto-3',
    name: 'Teclado mecânico',
    description: 'Teclado mecânico com iluminação RGB.',
    category: 'Periféricos',
    price: 249.9,
    quantity: 0,
    available: false,
  },
  {
    id: 'produto-4',
    name: 'Smartphone 128 GB',
    description: 'Smartphone com câmera dupla e tela de 6,5 polegadas.',
    category: 'Smartphones',
    price: 1799,
    quantity: 3,
    available: true,
  },
];
