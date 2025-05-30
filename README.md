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
  - name
  - email
  - password

- <mark>POST /users/login</mark> – Retorna um token de autenticação<br>
  campos:
  - email
  - password
