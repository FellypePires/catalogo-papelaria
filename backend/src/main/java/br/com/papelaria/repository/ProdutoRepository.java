package br.com.papelaria.repository;

import br.com.papelaria.model.Produto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @EntityGraph(attributePaths = "categoria")
    List<Produto> findByCategoriaId(Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);

    @Query("select p from Produto p join fetch p.categoria where p.id = :id")
    Optional<Produto> buscarPorId(@Param("id") Long id);

    @Query("select p from Produto p join fetch p.categoria order by p.nome")
    List<Produto> listarTodos();

    @EntityGraph(attributePaths = "categoria")
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    @EntityGraph(attributePaths = "categoria")
    List<Produto> findByCorContainingIgnoreCase(String cor);

    @EntityGraph(attributePaths = "categoria")
    List<Produto> findByNomeContainingIgnoreCaseAndCorContainingIgnoreCase(String nome, String cor);
}
