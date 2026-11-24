import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Categoria, Produto } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-catalogo-page',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './catalogo.page.html',
  styleUrl: './catalogo.page.css',
})
export class CatalogoPage implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  nome = '';
  cor = '';
  categoriaId = '';
  erro = signal('');
  carregando = signal(false);

  ngOnInit(): void {
    this.catalogo.listarCategorias().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
    this.buscar();
  }

  buscar(): void {
    this.erro.set('');
    this.carregando.set(true);
    this.catalogo.listarProdutos(this.nome, this.cor).subscribe({
      next: (produtos) => { this.produtos.set(produtos); this.carregando.set(false); },
      error: (erro) => { this.erro.set(mensagemErro(erro)); this.carregando.set(false); },
    });
  }

  verCategoria(): void {
    if (this.categoriaId) this.router.navigate(['/categorias', this.categoriaId, 'produtos']);
  }

  excluir(produto: Produto): void {
    if (!confirm(`Excluir o produto "${produto.nome}"?`)) return;
    this.catalogo.excluirProduto(produto.id).subscribe({
      next: () => this.buscar(),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}
