# 🍽️ Daily Diet API

API para gerenciamento de refeições dentro e fora da dieta, desenvolvida com Node.js, TypeScript e Fastify.

## 💻 Tecnologias

- Node.js
- TypeScript
- Fastify
- Knex (Query Builder)
- SQLite
- Zod (Validação)
- JWT (Autenticação)
- Bcryptjs (hash de senhas)
- ESLint

## 🚀 Funcionalidades

### Usuários
- Criação de conta
- Login com autenticação JWT

### Refeições
- Criar, editar e apagar refeições
- Listar todas as refeições
- Visualizar uma refeição específica
- Métricas do usuário:
  - Total de refeições registradas
  - Total de refeições dentro da dieta
  - Total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta

## 📝 Requisitos

- Node.js
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```env
NODE_ENV="development"
DATABASE_CLIENT=sqlite
DATABASE_URL="./db/app.db"
AUTH_SECRET=jwttest
```

4. Execute as migrations:
```bash
npm run knex -- migrate:latest
# ou
yarn knex migrate:latest
```

5. Inicie o servidor:
```bash
npm run dev
# ou
yarn dev
```
O servidor estará rodando em http://localhost:3333

## 🔒 Autenticação

A API utiliza autenticação JWT. Para acessar as rotas protegidas, é necessário:
1. Criar uma conta ou fazer login para receber o token
2. Incluir o token no header das requisições:
```
Authorization: Bearer [seu-token]
```

## 📚 Endpoints

### Usuários

#### POST /users
Cria um novo usuário
```json
{
  "name": "string",
  "email": "string",
  "password": "string (6-10 caracteres)"
}
```

#### POST /users/login
Realiza login
```json
{
  "email": "string",
  "password": "string"
}
```

### Refeições

#### GET /meals
Lista todas as refeições do usuário

#### GET /meals/:id
Busca uma refeição específica

#### GET /meals/summary
Retorna métricas do usuário

#### POST /meals
Cria uma nova refeição
```json
{
  "name": "string",
  "description": "string",
  "meal_date": "string (datetime)",
  "in_diet": boolean
}
```

#### PUT /meals/:id
Atualiza uma refeição existente
```json
{
  "name": "string (opcional)",
  "description": "string (opcional)",
  "meal_date": "string datetime (opcional)",
  "in_diet": "boolean (opcional)"
}
```

#### DELETE /meals/:id
Remove uma refeição
