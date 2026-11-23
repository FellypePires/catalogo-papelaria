import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErro(erro: unknown): string {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) return 'Não foi possível conectar à API. Confira se o back-end está rodando.';
    if (erro.status === 401) return 'E-mail ou senha inválidos. Entre novamente.';
    if (erro.status === 403) return 'Seu perfil não tem permissão para fazer isso.';
    if (erro.status === 404) return 'O registro solicitado não foi encontrado.';
    return erro.error?.mensagem ?? 'Ocorreu um erro. Confira os dados e tente novamente.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
