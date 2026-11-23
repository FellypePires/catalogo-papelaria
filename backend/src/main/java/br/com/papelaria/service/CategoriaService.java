package br.com.papelaria.service;

import br.com.papelaria.dto.Requests.CategoriaRequest;
import br.com.papelaria.dto.Responses.CategoriaResponse;
import br.com.papelaria.exception.RecursoNaoEncontradoException;
import br.com.papelaria.exception.RegraNegocioException;
import br.com.papelaria.model.Categoria;
import br.com.papelaria.repository.CategoriaRepository;
import br.com.papelaria.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository categorias;
    private final ProdutoRepository produtos;

    public CategoriaService(CategoriaRepository categorias, ProdutoRepository produtos) {
        this.categorias = categorias;
        this.produtos = produtos;
    }

    public List<CategoriaResponse> listar() {
        return categorias.findAll().stream().map(CategoriaResponse::de).toList();
    }

    public CategoriaResponse buscar(Long id) { return CategoriaResponse.de(encontrar(id)); }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest request) {
        validarNome(request.nome(), null);
        return CategoriaResponse.de(categorias.save(new Categoria(request.nome().trim(), request.descricao())));
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = encontrar(id);
        validarNome(request.nome(), id);
        categoria.atualizar(request.nome().trim(), request.descricao());
        return CategoriaResponse.de(categoria);
    }

    @Transactional
    public void excluir(Long id) {
        Categoria categoria = encontrar(id);
        if (produtos.existsByCategoriaId(id)) {
            throw new RegraNegocioException("Remova ou mova os produtos desta categoria antes de excluí-la.");
        }
        categorias.delete(categoria);
    }

    public Categoria encontrar(Long id) {
        return categorias.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada."));
    }

    private void validarNome(String nome, Long idAtual) {
        boolean duplicado = categorias.existsByNomeIgnoreCase(nome.trim())
                && (idAtual == null || !categorias.findById(idAtual).orElseThrow().getNome().equalsIgnoreCase(nome.trim()));
        if (duplicado) throw new RegraNegocioException("Já existe uma categoria com esse nome.");
    }
}
