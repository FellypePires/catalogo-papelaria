import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  email = '';
  senha = '';
  cadastrar = signal(false);
  carregando = signal(false);
  erro = signal('');
  aviso = signal('');

  enviar(): void {
    this.erro.set('');
    this.aviso.set('');
    if (!this.email.trim() || !this.senha) {
      this.erro.set('Preencha o e-mail e a senha.');
      return;
    }

    this.carregando.set(true);
    if (this.cadastrar()) {
      this.auth.cadastrar(this.email, this.senha).subscribe({
        next: (resposta) => {
          this.carregando.set(false);
          this.aviso.set(resposta.mensagem);
          this.cadastrar.set(false);
          this.senha = '';
        },
        error: (erro) => { this.carregando.set(false); this.erro.set(mensagemErro(erro)); },
      });
      return;
    }

    this.auth.entrar(this.email, this.senha).subscribe({
      next: () => {
        this.carregando.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl || '/catalogo');
      },
      error: (erro) => { this.carregando.set(false); this.erro.set(mensagemErro(erro)); },
    });
  }
}
