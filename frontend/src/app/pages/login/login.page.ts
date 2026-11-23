import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../core/mensagem-erro';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  email = '';
  senha = '';
  cadastrar = false;
  carregando = false;
  erro = '';
  aviso = '';

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  enviar(): void {
    this.erro = '';
    this.aviso = '';
    if (!this.email.trim() || !this.senha) {
      this.erro = 'Preencha o e-mail e a senha.';
      return;
    }

    this.carregando = true;
    if (this.cadastrar) {
      this.auth.cadastrar(this.email, this.senha).subscribe({
        next: (resposta) => {
          this.carregando = false;
          this.aviso = resposta.mensagem;
          this.cadastrar = false;
          this.senha = '';
          this.cdr.markForCheck();
        },
        error: (erro) => { this.carregando = false; this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
      });
      return;
    }

    this.auth.entrar(this.email, this.senha).subscribe({
      next: () => {
        this.carregando = false;
        const voltar = this.route.snapshot.queryParamMap.get('voltar');
        this.router.navigateByUrl(voltar || '/catalogo');
        this.cdr.markForCheck();
      },
      error: (erro) => { this.carregando = false; this.erro = mensagemErro(erro); this.cdr.markForCheck(); },
    });
  }
}
