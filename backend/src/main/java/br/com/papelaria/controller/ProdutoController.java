package br.com.papelaria.controller;

import br.com.papelaria.dto.Requests.ProdutoRequest;
import br.com.papelaria.dto.Responses.ProdutoResponse;
import br.com.papelaria.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    private final ProdutoService produtos;
    public ProdutoController(ProdutoService produtos) { this.produtos = produtos; }

    @GetMapping public List<ProdutoResponse> listar(@RequestParam(required = false) String nome,
                                                    @RequestParam(required = false) String cor) {
        return produtos.listar(nome, cor);
    }

    @GetMapping("/{id}") public ProdutoResponse buscar(@PathVariable Long id) { return produtos.buscar(id); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ProdutoResponse criar(@Valid @RequestBody ProdutoRequest request) { return produtos.criar(request); }

    @PutMapping("/{id}")
    public ProdutoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest request) {
        return produtos.atualizar(id, request);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { produtos.excluir(id); }
}
