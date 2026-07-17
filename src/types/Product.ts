export type ProductStatus = 'disponivel' | 'indisponivel';

export interface Product
{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stockQuantity: number;
    status: ProductStatus;
}

export type SaveProductsLocally = (products: Product[]) => Promise<void>;

export type LoadProductsLocally = () => Promise<Product[]>;

export type ClearLocalProducts = () => Promise<void>;

export interface ProductStorageService
{
    saveProductsLocally: SaveProductsLocally;
    loadProductsLocally: LoadProductsLocally;
    clearLocalProducts: ClearLocalProducts;
}
