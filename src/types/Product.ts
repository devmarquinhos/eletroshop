// src/types/Product.ts
// Interface combinada entre todas as equipes. Ajustem os nomes dos campos
// conforme o que for definido coletivamente com a turma.

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  quantidade: number;
  disponivel: boolean; // calculado pela API: disponivel = quantidade > 0
}
