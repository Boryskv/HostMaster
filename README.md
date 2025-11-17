# HostMaster 🏨

Sistema completo de gerenciamento hoteleiro desenvolvido com React e NestJS.

## 📋 Sobre o Projeto

HostMaster é uma aplicação web moderna para gerenciamento de hotéis, permitindo controle de quartos, reservas e usuários de forma eficiente e intuitiva.

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **React Router DOM** - Navegação entre páginas
- **Vite** - Build tool e dev server
- **CSS3** - Estilização moderna

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript/JavaScript
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação via tokens
- **Passport** - Middleware de autenticação
- **Bcrypt** - Hash de senhas

## 📁 Estrutura do Projeto

```
HostMaster/
├── hostmaster-frontend/     # Aplicação React
│   ├── src/
│   │   ├── hostmaster/
│   │   │   ├── pages/      # Páginas da aplicação
│   │   │   ├── components/ # Componentes reutilizáveis
│   │   │   ├── services/   # Serviços de API
│   │   │   ├── context/    # Context API
│   │   │   └── hooks/      # Custom hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── router.jsx
│   └── package.json
│
└── hostmaster-backend/      # API NestJS
    ├── src/
    │   ├── auth/           # Módulo de autenticação
    │   ├── users/          # Módulo de usuários
    │   ├── rooms/          # Módulo de quartos
    │   ├── reservations/   # Módulo de reservas
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Backend

```bash
# Navegar para a pasta do backend
cd hostmaster-backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run start:dev
```

O backend estará rodando em `http://localhost:3000/api`

### Frontend

```bash
# Navegar para a pasta do frontend
cd hostmaster-frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (autenticado)

### Quartos
- `GET /api/rooms` - Listar todos os quartos
- `POST /api/rooms` - Criar novo quarto
- `GET /api/rooms/:id` - Buscar quarto específico
- `PATCH /api/rooms/:id` - Atualizar quarto
- `DELETE /api/rooms/:id` - Deletar quarto

### Reservas
- `GET /api/reservations` - Listar todas as reservas
- `POST /api/reservations` - Criar nova reserva
- `GET /api/reservations/:id` - Buscar reserva específica
- `PATCH /api/reservations/:id` - Atualizar reserva
- `DELETE /api/reservations/:id` - Deletar reserva

## 🎨 Funcionalidades

- ✅ Autenticação JWT
- ✅ Cadastro e login de usuários
- ✅ Gerenciamento de quartos
- ✅ Sistema de reservas
- ✅ Dashboard administrativo
- ✅ Interface responsiva
- ✅ Validação de dados
- ✅ Proteção de rotas

## 🛠️ Scripts Disponíveis

### Frontend
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
```

### Backend
```bash
npm run start:dev    # Inicia servidor de desenvolvimento
npm run build        # Compila o projeto
npm run start:prod   # Inicia servidor de produção
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para gerenciamento hoteleiro moderno.
