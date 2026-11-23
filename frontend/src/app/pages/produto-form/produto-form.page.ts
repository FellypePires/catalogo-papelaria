import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria, ProdutoRequest } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-produto-form-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './produto-form.page.html',
  styleUrl: './produto-form.page.scss',
})
export class ProdutoFormPage implements OnInit {
  id: number | null = null;
  categorias: Categoria[] = [];
  nome = '';
  descricao = '';
  cor = '';
  preco: number | null = null;
  categoriaId: number | null = null;
  erro = '';
  salvando = false;

  constructor(private catalogo: CatalogoService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const valorId = this.route.snapshot.paramMap.get('id');
    this.id = valorId ? Number(valorId) : null;
    this.catalogo.listarCategorias().subscribe({
      next: (categorias) => { this.categorias = categorias; if (categorias.length) this.categoriaId ??= categorias[0].id; this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
    if (this.id) {
      this.catalogo.buscarProduto(this.id).subscribe({
        next: (produto) => {
          this.nome = produto.nome;
          this.descricao = produto.descricao ?? '';
          this.cor = produto.cor;
          this.preco = produto.preco;
          this.categoriaId = produto.categoriaId;
          this.cdr.markForCheck();
        },
        error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
      });
    }
  }

  salvar(): void {
    this.erro = '';
    if (!this.nome.trim() || !this.cor.trim() || !this.preco || this.preco <= 0 || !this.categoriaId) {
      this.erro = 'Preencha nome, cor, preço maior que zero e categoria.';
      return;
    }
    const produto: ProdutoRequest = {
      nome: this.nome.trim(), descricao: this.descricao.trim(), cor: this.cor.trim(),
      preco: this.preco, categoriaId: this.categoriaId,
    };
    this.salvando = true;
    const acao = this.id ? this.catalogo.atualizarProduto(this.id, produto) : this.catalogo.criarProduto(produto);
    acao.subscribe({
      next: (salvo) => { this.router.navigate(['/produtos', salvo.id]); this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.salvando = false; this.cdr.markForCheck(); },
    });
  }
}
