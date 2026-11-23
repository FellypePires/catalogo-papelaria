package br.com.papelaria.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false, length = 40)
    private String cor;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    protected Produto() {}

    public Produto(String nome, String descricao, String cor, BigDecimal preco, Categoria categoria) {
        atualizar(nome, descricao, cor, preco, categoria);
    }

    public void atualizar(String nome, String descricao, String cor, BigDecimal preco, Categoria categoria) {
        this.nome = nome;
        this.descricao = descricao;
        this.cor = cor;
        this.preco = preco;
        this.categoria = categoria;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public String getCor() { return cor; }
    public BigDecimal getPreco() { return preco; }
    public Categoria getCategoria() { return categoria; }
}
