import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginResponse, MensagemResponse } from '../models/catalogo.model';
import { API } from '../core/api.config';

function valorSalvo(chave: string): string | null {
  const valor = localStorage.getItem(chave);
  return valor && valor !== 'null' && valor !== 'undefined' ? valor : null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API}/auth`;
  private readonly tokenSalvo = signal(valorSalvo('papelaria_token'));
  private readonly perfilSalvo = signal(valorSalvo('papelaria_perfil'));
  private readonly emailSalvo = signal(valorSalvo('papelaria_email') ?? '');

  readonly estaAutenticado = computed(() => {
    const token = this.tokenSalvo();
    return token !== null && token !== '' && token !== 'null' && token !== 'undefined';
  });
  readonly ehAdmin = computed(() => this.perfilSalvo() === 'ADMIN');
  readonly email = computed(() => this.emailSalvo());

  entrar(email: string, senha: string) {
    return this.http.post<LoginResponse>(`${this.url}/login`, { email, senha }).pipe(
      tap((resposta) => {
        localStorage.setItem('papelaria_token', resposta.token);
        localStorage.setItem('papelaria_perfil', resposta.perfil);
        localStorage.setItem('papelaria_email', resposta.email);
        this.tokenSalvo.set(resposta.token);
        this.perfilSalvo.set(resposta.perfil);
        this.emailSalvo.set(resposta.email);
      }),
    );
  }

  cadastrar(email: string, senha: string) {
    return this.http.post<MensagemResponse>(`${this.url}/cadastro`, { email, senha });
  }

  token(): string | null {
    return this.tokenSalvo();
  }

  sair(): void {
    localStorage.removeItem('papelaria_token');
    localStorage.removeItem('papelaria_perfil');
    localStorage.removeItem('papelaria_email');
    this.tokenSalvo.set(null);
    this.perfilSalvo.set(null);
    this.emailSalvo.set('');
  }
}
