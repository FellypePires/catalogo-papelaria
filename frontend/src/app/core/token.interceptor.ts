import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API } from './api.config';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ehApi = requisicao.url.startsWith(API);
  const token = auth.token();
  const requisicaoSegura = ehApi && token
    ? requisicao.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : requisicao;

  return proximo(requisicaoSegura).pipe(
    catchError((erro: unknown) => {
      const rotaPublica = requisicao.url.startsWith(`${API}/auth/login`) || requisicao.url.startsWith(`${API}/auth/cadastro`);
      if (ehApi && !rotaPublica && (erro as { status?: number }).status === 401) {
        auth.sair();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => erro);
    }),
  );
};
