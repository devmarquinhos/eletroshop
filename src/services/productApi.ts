import { Product } from '../types/Product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nome: 'Fone de Ouvido Bluetooth',
    descricao: 'Fone sem fio com cancelamento de ruído e estojo de carregamento',
    categoria: 'Áudio',
    preco: 189.9,
    quantidade: 15,
    disponivel: true,
  },
  {
    id: '2',
    nome: 'Smartwatch Fit Pro',
    descricao: 'Relógio inteligente com monitor cardíaco e GPS integrado',
    categoria: 'Wearables',
    preco: 349.0,
    quantidade: 0,
    disponivel: false,
  },
  {
    id: '3',
    nome: 'Carregador Turbo 65W',
    descricao: 'Carregador USB-C com carregamento rápido para notebooks e celulares',
    categoria: 'Acessórios',
    preco: 79.9,
    quantidade: 42,
    disponivel: true,
  },
  {
    id: '4',
    nome: 'Mouse Gamer RGB',
    descricao: 'Mouse óptico com iluminação RGB e 6 botões programáveis',
    categoria: 'Periféricos',
    preco: 129.9,
    quantidade: 8,
    disponivel: true,
  },
  {
    id: '5',
    nome: 'Caixa de Som Bluetooth',
    descricao: 'Caixa de som portátil à prova d\u2019água, 12h de bateria',
    categoria: 'Áudio',
    preco: 159.9,
    quantidade: 0,
    disponivel: false,
  },
  {
    id: '6',
    nome: 'Teclado Mecânico Compacto',
    descricao: 'Teclado mecânico 60% com switches azuis e retroiluminação',
    categoria: 'Periféricos',
    preco: 249.9,
    quantidade: 6,
    disponivel: true,
  },
];

// Simula uma requisição HTTP com um pequeno atraso.
function delay<T>(value: T, ms = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getProducts(): Promise<Product[]> {
  // Quando a API real existir, troque por:
  // const response = await fetch('http://SEU_IP:PORTA/products');
  // return response.json();
  return delay(MOCK_PRODUCTS);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return delay(MOCK_PRODUCTS.find((p) => p.id === id));
}

export async function createProduct(product: Omit<Product, 'id' | 'disponivel'>): Promise<Product> {
  const novo: Product = {
    ...product,
    id: String(Date.now()),
    disponivel: product.quantidade > 0,
  };
  return delay(novo);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const existente = MOCK_PRODUCTS.find((p) => p.id === id);
  const atualizado = { ...existente, ...product } as Product;
  return delay(atualizado);
}

export async function deleteProduct(id: string): Promise<void> {
  return delay(undefined);
}
