package br.com.papelaria.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public final class Requests {
    private Requests() {}

    public record CategoriaRequest(
            @NotBlank @Size(max = 80) String nome,
            @Size(max = 240) String descricao) {}

    public record ProdutoRequest(
            @NotBlank @Size(max = 120) String nome,
            @Size(max = 500) String descricao,
            @NotBlank @Size(max = 40) String cor,
            @NotNull @DecimalMin(value = "0.01") BigDecimal preco,
            @NotNull Long categoriaId) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String senha) {}
    public record CadastroRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, max = 72) String senha) {}
}
