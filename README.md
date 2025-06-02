# 🍽️ Daily Diet API

A **Daily Diet API** é uma aplicação backend desenvolvida com TypeScript que permite o gerenciamento de refeições, incluindo o registro de alimentos consumidos, controle de horários e categorias, além de possibilitar a autenticação de usuários.

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Knex.js](https://knexjs.org/) – SQL query builder
- [SQLite](https://www.sqlite.org/) – banco de dados leve
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) – para hash de senhas
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – para autenticação via JWT

## 📦 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/lucasdoloh0v/Daily-diet-API.git
cd Daily-diet-API
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

```env
NODE_ENV="development"
DATABASE_CLIENT=sqlite
DATABASE_URL="./db/app.db"
AUTH_SECRET=jwttest
```

### 4. Execute as migrações do banco de dados

```bash
npm run knex -- migrate:latest
```

### 5. Inicie o servidor

```bash
npm run dev
```

O servidor estará rodando em http://localhost:3000

## 🧾 Endpoints Principais

### Autenticação
- <mark>POST /users</mark> – Cria um novo usuário<br>
  campos:
  - name (string)
  - email (string)
  - password (string)

- <mark>POST /users/login</mark> – Retorna um token de autenticação JWT<br>
  campos:
  - email (string)
  - password (string)

### Refeições

 Todas as rotas possuem um middleware de autenticação (preHandler) que verifica se o usuário está autenticado através de JWT. Se não estiver autenticado, retorna status 401.<br>
 O token JWT deve ser enviado no cabeçalho (header) da requisição HTTP seguindo o padrão Bearer Token. Aqui está como deve ser feito:
 - No cabeçalho da requisição, você deve incluir:
    ```
    Authorization: Bearer <seu_token_jwt>
    ```

- <mark>GET /meals</mark> - Lista todas as refeições do usuário
- <mark>GET /meals/:id</mark> - Busca uma refeição específica pelo ID
- <mark>GET /meals/summary</mark> - Retorna um resumo estatístico das refeições do usuário, incluindo:
  - Total de refeições registradas
  - Total de refeições dentro da dieta
  - Total de refeições fora da dieta
  - Maior sequência de refeições dentro da dieta
- <mark>POST /meals</mark> - Cria uma nova refeição<br>
  Campos:
  - name (string)
  - description (string)
  - meal_date (string em formato datetime)
  - in_diet (boolean)
- <mark>PUT /meals/:id</mark> - Atualiza uma refeição existente<br>
  Campos:
  - name (opcional)
  - description (opcional)
  - meal_date (opcional)
  - in_diet (opcional)
- <mark>DELETE /meals/:id</mark> - Remove uma refeição específica
