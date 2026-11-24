import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Categoria, Produto } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-produtos-categoria-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './produtos-categoria.page.html',
  styleUrl: './produtos-categoria.page.css',
})
export class ProdutosCategoriaPage implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  private readonly route = inject(ActivatedRoute);
  categoria = signal<Categoria | null>(null);
  produtos = signal<Produto[]>([]);
  erro = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogo.buscarCategoria(id).subscribe({ next: (categoria) => this.categoria.set(categoria), error: (erro) => this.erro.set(mensagemErro(erro)) });
    this.catalogo.produtosDaCategoria(id).subscribe({ next: (produtos) => this.produtos.set(produtos), error: (erro) => this.erro.set(mensagemErro(erro)) });
  }
}
