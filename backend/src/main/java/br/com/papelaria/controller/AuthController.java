package br.com.papelaria.controller;

import br.com.papelaria.dto.Requests.CadastroRequest;
import br.com.papelaria.dto.Requests.LoginRequest;
import br.com.papelaria.dto.Responses.LoginResponse;
import br.com.papelaria.dto.Responses.MensagemResponse;
import br.com.papelaria.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) { return auth.login(request); }

    @PostMapping("/cadastro") @ResponseStatus(HttpStatus.CREATED)
    public MensagemResponse cadastrar(@Valid @RequestBody CadastroRequest request) {
        auth.cadastrar(request);
        return new MensagemResponse("Conta criada. Agora você pode entrar.");
    }
}
