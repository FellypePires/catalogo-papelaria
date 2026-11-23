package br.com.papelaria.controller;

import br.com.papelaria.dto.Requests.CategoriaRequest;
import br.com.papelaria.dto.Responses.CategoriaResponse;
import br.com.papelaria.dto.Responses.ProdutoResponse;
import br.com.papelaria.service.CategoriaService;
import br.com.papelaria.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    private final CategoriaService categorias;
    private final ProdutoService produtos;

    public CategoriaController(CategoriaService categorias, ProdutoService produtos) {
        this.categorias = categorias;
        this.produtos = produtos;
    }

    @GetMapping public List<CategoriaResponse> listar() { return categorias.listar(); }
    @GetMapping("/{id}") public CategoriaResponse buscar(@PathVariable Long id) { return categorias.buscar(id); }
    @GetMapping("/{id}/produtos") public List<ProdutoResponse> produtos(@PathVariable Long id) { return produtos.porCategoria(id); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse criar(@Valid @RequestBody CategoriaRequest request) { return categorias.criar(request); }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return categorias.atualizar(id, request);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { categorias.excluir(id); }
}
