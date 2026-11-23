import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  styleUrl: './categorias.page.scss',
})
export class CategoriasPage implements OnInit {
  categorias: Categoria[] = [];
  nome = '';
  descricao = '';
  erro = '';
  aviso = '';

  constructor(private catalogo: CatalogoService, protected auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.catalogo.listarCategorias().subscribe({
      next: (categorias) => { this.categorias = categorias; this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
  }

  salvar(): void {
    this.erro = '';
    if (!this.nome.trim()) { this.erro = 'Informe o nome da categoria.'; return; }
    this.catalogo.criarCategoria({ nome: this.nome.trim(), descricao: this.descricao.trim() }).subscribe({
      next: () => { this.nome = ''; this.descricao = ''; this.aviso = 'Categoria cadastrada.'; this.carregar(); this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
  }

  excluir(categoria: Categoria): void {
    if (!confirm(`Excluir a categoria "${categoria.nome}"?`)) return;
    this.catalogo.excluirCategoria(categoria.id).subscribe({
      next: () => { this.aviso = 'Categoria excluída.'; this.carregar(); this.cdr.markForCheck(); },
      error: (erro) => { this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
  }
}
