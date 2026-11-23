import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  styleUrl: './catalogo.page.scss',
})
export class CatalogoPage implements OnInit {
  produtos: Produto[] = [];
  categorias: Categoria[] = [];
  nome = '';
  cor = '';
  categoriaId = '';
  erro = '';
  carregando = false;

  constructor(private catalogo: CatalogoService, protected auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.catalogo.listarCategorias().subscribe({
      next: (categorias) => { this.categorias = categorias; this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
    this.buscar();
  }

  buscar(): void {
    this.erro = '';
    this.carregando = true;
    this.catalogo.listarProdutos(this.nome, this.cor).subscribe({
      next: (produtos) => { this.produtos = produtos; this.carregando = false; this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.carregando = false; this.cdr.markForCheck(); },
    });
  }

  verCategoria(): void {
    if (this.categoriaId) this.router.navigate(['/categorias', this.categoriaId, 'produtos']);
  }

  excluir(produto: Produto): void {
    if (!confirm(`Excluir o produto "${produto.nome}"?`)) return;
    this.catalogo.excluirProduto(produto.id).subscribe({
      next: () => this.buscar(),
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
  }
}
