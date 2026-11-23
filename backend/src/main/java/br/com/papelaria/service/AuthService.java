package br.com.papelaria.service;

import br.com.papelaria.dto.Requests.CadastroRequest;
import br.com.papelaria.dto.Requests.LoginRequest;
import br.com.papelaria.dto.Responses.LoginResponse;
import br.com.papelaria.exception.RegraNegocioException;
import br.com.papelaria.model.Perfil;
import br.com.papelaria.model.Usuario;
import br.com.papelaria.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AuthService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtEncoder jwtEncoder) {
        this.usuarios = usuarios;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        var autenticacao = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.senha()));
        Usuario usuario = usuarios.findByEmailIgnoreCase(autenticacao.getName())
                .orElseThrow(() -> new RegraNegocioException("E-mail ou senha inválidos."));

        Instant agora = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer("papelaria-api")
                .issuedAt(agora)
                .expiresAt(agora.plus(8, ChronoUnit.HOURS))
                .subject(usuario.getEmail())
                .claim("roles", List.of("ROLE_" + usuario.getPerfil().name()))
                .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        return new LoginResponse(token, usuario.getEmail(), usuario.getPerfil().name());
    }

    public void cadastrar(CadastroRequest request) {
        String email = request.email().trim().toLowerCase();
        if (usuarios.existsByEmailIgnoreCase(email)) {
            throw new RegraNegocioException("Já existe uma conta com esse e-mail.");
        }
        usuarios.save(new Usuario(email, passwordEncoder.encode(request.senha()), Perfil.USUARIO));
    }
}
