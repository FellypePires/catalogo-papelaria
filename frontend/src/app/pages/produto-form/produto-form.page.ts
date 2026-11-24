import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria, ProdutoRequest } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-produto-form-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './produto-form.page.html',
  styleUrl: './produto-form.page.css',
})
export class ProdutoFormPage implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  id: number | null = null;
  categorias = signal<Categoria[]>([]);
  nome = '';
  descricao = '';
  cor = '';
  preco: number | null = null;
  categoriaId: number | null = null;
  erro = signal('');
  salvando = signal(false);

  ngOnInit(): void {
    const valorId = this.route.snapshot.paramMap.get('id');
    this.id = valorId ? Number(valorId) : null;
    this.catalogo.listarCategorias().subscribe({
      next: (categorias) => { this.categorias.set(categorias); if (categorias.length) this.categoriaId ??= categorias[0].id; },
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
    if (this.id) {
      this.catalogo.buscarProduto(this.id).subscribe({
        next: (produto) => {
          this.nome = produto.nome;
          this.descricao = produto.descricao ?? '';
          this.cor = produto.cor;
          this.preco = produto.preco;
          this.categoriaId = produto.categoriaId;
        },
        error: (erro) => this.erro.set(mensagemErro(erro)),
      });
    }
  }

  salvar(): void {
    this.erro.set('');
    if (!this.nome.trim() || !this.cor.trim() || !this.preco || this.preco <= 0 || !this.categoriaId) {
      this.erro.set('Preencha nome, cor, preço maior que zero e categoria.');
      return;
    }
    const produto: ProdutoRequest = {
      nome: this.nome.trim(), descricao: this.descricao.trim(), cor: this.cor.trim(),
      preco: this.preco, categoriaId: this.categoriaId,
    };
    this.salvando.set(true);
    const acao = this.id ? this.catalogo.atualizarProduto(this.id, produto) : this.catalogo.criarProduto(produto);
    acao.subscribe({
      next: (salvo) => { void this.router.navigate(['/produtos', salvo.id]); },
      error: (erro) => { this.erro.set(mensagemErro(erro)); this.salvando.set(false); },
    });
  }
}
