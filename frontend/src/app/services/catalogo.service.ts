import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Categoria, CategoriaRequest, Produto, ProdutoRequest } from '../models/catalogo.model';
import { API } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly url = API;

  listarProdutos(nome = '', cor = '') {
    let params = new HttpParams();
    if (nome.trim()) params = params.set('nome', nome.trim());
    if (cor.trim()) params = params.set('cor', cor.trim());
    return this.http.get<Produto[]>(`${this.url}/produtos`, { params });
  }

  buscarProduto(id: number) {
    return this.http.get<Produto>(`${this.url}/produtos/${id}`);
  }

  criarProduto(produto: ProdutoRequest) {
    return this.http.post<Produto>(`${this.url}/produtos`, produto);
  }

  atualizarProduto(id: number, produto: ProdutoRequest) {
    return this.http.put<Produto>(`${this.url}/produtos/${id}`, produto);
  }

  excluirProduto(id: number) {
    return this.http.delete<void>(`${this.url}/produtos/${id}`);
  }

  listarCategorias() {
    return this.http.get<Categoria[]>(`${this.url}/categorias`);
  }

  buscarCategoria(id: number) {
    return this.http.get<Categoria>(`${this.url}/categorias/${id}`);
  }

  produtosDaCategoria(id: number) {
    return this.http.get<Produto[]>(`${this.url}/categorias/${id}/produtos`);
  }

  criarCategoria(categoria: CategoriaRequest) {
    return this.http.post<Categoria>(`${this.url}/categorias`, categoria);
  }

  atualizarCategoria(id: number, categoria: CategoriaRequest) {
    return this.http.put<Categoria>(`${this.url}/categorias/${id}`, categoria);
  }

  excluirCategoria(id: number) {
    return this.http.delete<void>(`${this.url}/categorias/${id}`);
  }
}
