package br.com.papelaria.config;

import br.com.papelaria.model.Perfil;
import br.com.papelaria.model.Usuario;
import br.com.papelaria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {
    @Bean
    CommandLineRunner criarAdminInicial(UsuarioRepository usuarios, PasswordEncoder encoder,
                                        @Value("${app.admin.email}") String email,
                                        @Value("${app.admin.password}") String senha) {
        return args -> {
            if (!usuarios.existsByEmailIgnoreCase(email)) {
                usuarios.save(new Usuario(email.toLowerCase(), encoder.encode(senha), Perfil.ADMIN));
            }
        };
    }
}
