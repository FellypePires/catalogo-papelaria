package br.com.papelaria.exception;

import br.com.papelaria.dto.Responses.MensagemResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<MensagemResponse> autenticacao(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MensagemResponse("E-mail ou senha inválidos."));
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    ResponseEntity<MensagemResponse> naoEncontrado(RecursoNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MensagemResponse(ex.getMessage()));
    }

    @ExceptionHandler(RegraNegocioException.class)
    ResponseEntity<MensagemResponse> regra(RegraNegocioException ex) {
        return ResponseEntity.badRequest().body(new MensagemResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<MensagemResponse> validacao(MethodArgumentNotValidException ex) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .findFirst().map(erro -> erro.getField() + ": valor inválido ou obrigatório")
                .orElse("Confira os dados informados.");
        return ResponseEntity.badRequest().body(new MensagemResponse(mensagem));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<MensagemResponse> integridade(DataIntegrityViolationException ex) {
        return ResponseEntity.badRequest().body(new MensagemResponse("Já existe um registro com esses dados ou ele está relacionado a outro item."));
    }
}
