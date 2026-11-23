import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Categoria, Produto } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-produtos-categoria-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './produtos-categoria.page.html',
  styleUrl: './produtos-categoria.page.scss',
})
export class ProdutosCategoriaPage implements OnInit {
  categoria: Categoria | null = null;
  produtos: Produto[] = [];
  erro = '';
  constructor(private catalogo: CatalogoService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogo.buscarCategoria(id).subscribe({ next: (categoria) => { this.categoria = categoria; this.cdr.markForCheck(); }, error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); } });
    this.catalogo.produtosDaCategoria(id).subscribe({ next: (produtos) => { this.produtos = produtos; this.cdr.markForCheck(); }, error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); } });
  }
}
