import { Routes } from '@angular/router';
import { loginGuard, adminGuard } from './core/auth.guard';
import { LoginPage } from './pages/login/login.page';
import { CatalogoPage } from './pages/catalogo/catalogo.page';
import { ProdutoFormPage } from './pages/produto-form/produto-form.page';
import { ProdutoDetalhePage } from './pages/produto-detalhe/produto-detalhe.page';
import { CategoriasPage } from './pages/categorias/categorias.page';
import { ProdutosCategoriaPage } from './pages/produtos-categoria/produtos-categoria.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'catalogo', component: CatalogoPage, canActivate: [loginGuard] },
  { path: 'produtos/novo', component: ProdutoFormPage, canActivate: [loginGuard, adminGuard] },
  { path: 'produtos/:id/editar', component: ProdutoFormPage, canActivate: [loginGuard, adminGuard] },
  { path: 'produtos/:id', component: ProdutoDetalhePage, canActivate: [loginGuard] },
  { path: 'categorias', component: CategoriasPage, canActivate: [loginGuard] },
  { path: 'categorias/:id/produtos', component: ProdutosCategoriaPage, canActivate: [loginGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: '**', redirectTo: 'catalogo' },
];
