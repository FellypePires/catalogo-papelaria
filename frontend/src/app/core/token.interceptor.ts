import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const token = localStorage.getItem('papelaria_token');
  if (!token) return proximo(requisicao);

  return proximo(
    requisicao.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
