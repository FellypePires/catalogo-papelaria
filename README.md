# Catálogo Papel & Cia

Projeto de catálogo de papelaria feito com Spring Boot, PostgreSQL e Angular.

## Integrantes

- Fellype Gabriel Pires — RA 60000263
- Pedro Kayser dos Santos — RA 60301340
- Jose Antonio — RA 60009863

## Funcionalidades

- Login com token e dois perfis: `ADMIN` e `USUARIO`.
- O usuário consulta produtos e categorias; o admin também cadastra, edita e exclui.
- CRUD de produtos com escolha da categoria.
- Produtos de uma categoria: `GET /api/categorias/{id}/produtos`.
- Busca por nome e cor: `GET /api/produtos?nome=caneta&cor=azul`.
- A interface consulta a API; não há lista de produtos fixa no front-end.

## 1. Criar o banco PostgreSQL

Com o PostgreSQL iniciado, abra o pgAdmin, conecte-se ao servidor e abra o Query Tool no banco `postgres`. Execute o comando de `database/criar-banco.sql`. O Spring Data JPA cria as tabelas quando a API iniciar.

Por padrão, a aplicação tenta conectar usando `localhost:5432`, usuário `postgres`, senha `postgres` e banco `catalogo_papelaria`. Se o usuário ou a senha forem diferentes, configure as variáveis antes de iniciar o back-end. No PowerShell:

```powershell
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "sua-senha-do-postgres"
```

## 2. Iniciar o back-end

É necessário ter JDK 21 instalado. O Maven Wrapper está incluído no projeto, então não precisa instalar Maven à parte.

```powershell
cd backend
./mvnw.cmd spring-boot:run
```

A API ficará em `http://localhost:8080`.

### Contas para começar

Ao iniciar, a API cria um admin local se a conta ainda não existir:

- E-mail: `admin@papelaria.com`
- Senha: `123456`

Esses valores são apenas para desenvolvimento. Para alterá-los antes de iniciar:

```powershell
$env:ADMIN_EMAIL = "admin@papelaria.com"
$env:ADMIN_PASSWORD = "escolha-uma-senha"
```

Usuários comuns podem ser criados na tela de login. O cadastro não permite escolher o perfil de admin.

## 3. Iniciar o front-end

É necessário ter Node.js instalado.

```powershell
cd frontend
npm install
npm start
```

Abra `http://localhost:4200`. Entre como admin, cadastre categorias na tela **Categorias** e depois adicione produtos. A API permite consultar e filtrar os dados depois que eles forem cadastrados.

## Endpoints principais

| Método | Caminho | Acesso |
|---|---|---|
| `POST` | `/api/auth/login` | público |
| `POST` | `/api/auth/cadastro` | público; cria usuário comum |
| `GET` | `/api/produtos` | admin e usuário |
| `GET` | `/api/produtos/{id}` | admin e usuário |
| `GET` | `/api/produtos?nome=caneta&cor=azul` | admin e usuário |
| `POST` | `/api/produtos` | somente admin |
| `PUT` | `/api/produtos/{id}` | somente admin |
| `DELETE` | `/api/produtos/{id}` | somente admin |
| `GET` | `/api/categorias/{id}/produtos` | admin e usuário |
| `GET` | `/api/categorias` | admin e usuário |
| `POST` | `/api/categorias` | somente admin |
| `PUT` | `/api/categorias/{id}` | somente admin |
| `DELETE` | `/api/categorias/{id}` | somente admin |

## Organização

- `backend/src/main/java/br/com/papelaria/controller`: rotas REST.
- `backend/src/main/java/br/com/papelaria/service`: regras e operações do sistema.
- `backend/src/main/java/br/com/papelaria/repository`: acesso ao PostgreSQL via Spring Data JPA.
- `backend/src/main/java/br/com/papelaria/model`: entidades e perfis.
- `frontend/src/app/pages`: telas Angular.
- `frontend/src/app/services`: chamadas HTTP para a API e autenticação.
- `frontend/src/app/core`: proteção de rotas, envio do token e mensagens de erro.
