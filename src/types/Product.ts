export interface Product {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  quantidade: number;
  disponivel: boolean; // calculado pela API: disponivel = quantidade > 0
}
