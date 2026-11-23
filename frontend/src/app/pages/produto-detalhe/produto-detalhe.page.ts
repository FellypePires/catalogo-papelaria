import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  styleUrl: './produto-detalhe.page.scss',
})
export class ProdutoDetalhePage implements OnInit {
  produto: Produto | null = null;
  erro = '';
  constructor(private catalogo: CatalogoService, private route: ActivatedRoute, protected auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogo.buscarProduto(id).subscribe({
      next: (produto) => { this.produto = produto; this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
  }
}
