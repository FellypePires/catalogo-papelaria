-- Dados iniciais para demonstracao do catalogo.
-- Execute depois de criar o banco e iniciar a API pela primeira vez,
-- para que as tabelas JPA ja existam.

BEGIN;

INSERT INTO categorias (nome, descricao)
VALUES
    ('Escrita', 'Canetas, lápis e acessórios para escrita.'),
    ('Cadernos e Papéis', 'Cadernos e itens de papelaria.')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO produtos (nome, descricao, cor, preco, categoria_id)
SELECT dados.nome, dados.descricao, dados.cor, dados.preco, categorias.id
FROM (VALUES
    ('Caneta Azul Gel', 'Caneta de ponta fina para escrita diária.', 'Azul', 4.50::numeric, 'Escrita'),
    ('Caneta Esferográfica Preta', 'Caneta esferográfica de uso escolar.', 'Preta', 2.50::numeric, 'Escrita'),
    ('Lápis HB', 'Lápis grafite para escrita e desenho.', 'Cinza', 1.50::numeric, 'Escrita'),
    ('Borracha Branca', 'Borracha macia para uso escolar.', 'Branca', 1.20::numeric, 'Escrita'),
    ('Caderno Universitário 10 Matérias', 'Caderno para anotações e atividades.', 'Azul', 24.90::numeric, 'Cadernos e Papéis')
) AS dados(nome, descricao, cor, preco, categoria_nome)
JOIN categorias ON categorias.nome = dados.categoria_nome
WHERE NOT EXISTS (
    SELECT 1
    FROM produtos existentes
    WHERE existentes.nome = dados.nome
      AND existentes.categoria_id = categorias.id
);

COMMIT;
