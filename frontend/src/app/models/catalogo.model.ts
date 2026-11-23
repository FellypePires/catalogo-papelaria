export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  cor: string;
  preco: number;
  categoriaId: number;
  categoriaNome: string;
}

export interface ProdutoRequest {
  nome: string;
  descricao: string;
  cor: string;
  preco: number;
  categoriaId: number;
}

export interface CategoriaRequest {
  nome: string;
  descricao: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  perfil: 'ADMIN' | 'USUARIO';
}

export interface MensagemResponse {
  mensagem: string;
}
