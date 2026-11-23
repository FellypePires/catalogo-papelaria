package br.com.papelaria.dto;

import br.com.papelaria.model.Categoria;
import br.com.papelaria.model.Produto;

import java.math.BigDecimal;

public final class Responses {
    private Responses() {}

    public record CategoriaResponse(Long id, String nome, String descricao) {
        public static CategoriaResponse de(Categoria categoria) {
            return new CategoriaResponse(categoria.getId(), categoria.getNome(), categoria.getDescricao());
        }
    }

    public record ProdutoResponse(Long id, String nome, String descricao, String cor,
                                  BigDecimal preco, Long categoriaId, String categoriaNome) {
        public static ProdutoResponse de(Produto produto) {
            return new ProdutoResponse(produto.getId(), produto.getNome(), produto.getDescricao(),
                    produto.getCor(), produto.getPreco(), produto.getCategoria().getId(),
                    produto.getCategoria().getNome());
        }
    }

    public record LoginResponse(String token, String email, String perfil) {}
    public record MensagemResponse(String mensagem) {}
}
