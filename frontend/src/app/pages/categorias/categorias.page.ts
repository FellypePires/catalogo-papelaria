import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-categorias-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './categorias.page.html',
  styleUrl: './categorias.page.css',
})
export class CategoriasPage implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  protected readonly auth = inject(AuthService);
  categorias = signal<Categoria[]>([]);
  carregando = signal(false);
  nome = '';
  descricao = '';
  erro = signal('');
  aviso = signal('');

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando.set(true);
    this.catalogo.listarCategorias().subscribe({
      next: (categorias) => { this.categorias.set(categorias); this.carregando.set(false); },
      error: (erro) => { this.erro.set(mensagemErro(erro)); this.carregando.set(false); },
    });
  }

  salvar(): void {
    this.erro.set('');
    if (!this.nome.trim()) { this.erro.set('Informe o nome da categoria.'); return; }
    this.catalogo.criarCategoria({ nome: this.nome.trim(), descricao: this.descricao.trim() }).subscribe({
      next: () => { this.nome = ''; this.descricao = ''; this.aviso.set('Categoria cadastrada.'); this.carregar(); },
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }

  excluir(categoria: Categoria): void {
    if (!confirm(`Excluir a categoria "${categoria.nome}"?`)) return;
    this.catalogo.excluirCategoria(categoria.id).subscribe({
      next: () => { this.aviso.set('Categoria excluída.'); this.carregar(); },
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}
