package br.com.papelaria.repository;

import br.com.papelaria.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "categoria")
    List<Produto> findByCategoriaId(Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);

    @Query("select p from Produto p join fetch p.categoria where p.id = :id")
    Optional<Produto> buscarPorId(@Param("id") Long id);

    @Query("""
            select p from Produto p join fetch p.categoria
            where (:nome is null or lower(p.nome) like lower(concat('%', :nome, '%')))
              and (:cor is null or lower(p.cor) like lower(concat('%', :cor, '%')))
            order by p.nome
            """)
    List<Produto> buscar(@Param("nome") String nome, @Param("cor") String cor);
}
