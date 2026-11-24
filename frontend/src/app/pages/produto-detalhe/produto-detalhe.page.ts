import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Produto } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-produto-detalhe-page',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produto-detalhe.page.html',
  styleUrl: './produto-detalhe.page.css',
})
export class ProdutoDetalhePage implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  private readonly route = inject(ActivatedRoute);
  protected readonly auth = inject(AuthService);
  produto = signal<Produto | null>(null);
  erro = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogo.buscarProduto(id).subscribe({
      next: (produto) => this.produto.set(produto),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}
