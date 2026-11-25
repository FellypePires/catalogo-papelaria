package br.com.papelaria.service;

import br.com.papelaria.dto.Requests.ProdutoRequest;
import br.com.papelaria.dto.Responses.ProdutoResponse;
import br.com.papelaria.exception.RecursoNaoEncontradoException;
import br.com.papelaria.model.Produto;
import br.com.papelaria.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProdutoService {
    private final ProdutoRepository produtos;
    private final CategoriaService categorias;

    public ProdutoService(ProdutoRepository produtos, CategoriaService categorias) {
        this.produtos = produtos;
        this.categorias = categorias;
    }

    public List<ProdutoResponse> listar(String nome, String cor) {
        String nomeFiltro = vazioParaNulo(nome);
        String corFiltro = vazioParaNulo(cor);
        List<Produto> resultado;
        if (nomeFiltro != null && corFiltro != null) {
            resultado = produtos.findByNomeContainingIgnoreCaseAndCorContainingIgnoreCase(nomeFiltro, corFiltro);
        } else if (nomeFiltro != null) {
            resultado = produtos.findByNomeContainingIgnoreCase(nomeFiltro);
        } else if (corFiltro != null) {
            resultado = produtos.findByCorContainingIgnoreCase(corFiltro);
        } else {
            resultado = produtos.listarTodos();
        }
        return resultado.stream().map(ProdutoResponse::de).toList();
    }

    public ProdutoResponse buscar(Long id) { return ProdutoResponse.de(encontrar(id)); }

    public List<ProdutoResponse> porCategoria(Long categoriaId) {
        categorias.encontrar(categoriaId);
        return produtos.findByCategoriaId(categoriaId).stream().map(ProdutoResponse::de).toList();
    }

    @Transactional
    public ProdutoResponse criar(ProdutoRequest request) {
        Produto produto = new Produto(request.nome().trim(), request.descricao(), request.cor().trim(),
                request.preco(), categorias.encontrar(request.categoriaId()));
        return ProdutoResponse.de(produtos.save(produto));
    }

    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = encontrar(id);
        produto.atualizar(request.nome().trim(), request.descricao(), request.cor().trim(),
                request.preco(), categorias.encontrar(request.categoriaId()));
        return ProdutoResponse.de(produto);
    }

    @Transactional
    public void excluir(Long id) { produtos.delete(encontrar(id)); }

    private Produto encontrar(Long id) {
        return produtos.buscarPorId(id).orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado."));
    }

    private String vazioParaNulo(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
