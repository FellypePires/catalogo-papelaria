import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginResponse, MensagemResponse } from '../models/catalogo.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = 'http://localhost:8080/api/auth';
  private readonly tokenSalvo = signal(localStorage.getItem('papelaria_token'));
  private readonly perfilSalvo = signal(localStorage.getItem('papelaria_perfil'));
  private readonly emailSalvo = signal(localStorage.getItem('papelaria_email') ?? '');

  readonly estaAutenticado = computed(() => !!this.tokenSalvo());
  readonly ehAdmin = computed(() => this.perfilSalvo() === 'ADMIN');
  readonly email = computed(() => this.emailSalvo());

  constructor(private http: HttpClient) {}

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
