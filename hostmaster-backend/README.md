# HostMaster Backend

Sistema de Gerenciamento Hoteleiro - API REST com NestJS

## Estrutura do Projeto

```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                # Data Transfer Objects
│   ├── guards/             # Guards de autenticação
│   ├── strategies/         # Estratégias Passport
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                   # Módulo de usuários
│   ├── dto/
│   ├── entities/
│   ├── users.service.ts
│   └── users.module.ts
├── rooms/                   # Módulo de quartos
│   ├── dto/
│   ├── entities/
│   ├── rooms.controller.ts
│   ├── rooms.service.ts
│   └── rooms.module.ts
├── reservations/            # Módulo de reservas
│   ├── dto/
│   ├── entities/
│   ├── reservations.controller.ts
│   ├── reservations.service.ts
│   └── reservations.module.ts
├── app.module.ts
└── main.ts
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente

## Executar

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Endpoints

### Auth
- POST /api/auth/register - Criar conta
- POST /api/auth/login - Login
- GET /api/auth/profile - Perfil do usuário (autenticado)

### Rooms
- GET /api/rooms - Listar quartos
- POST /api/rooms - Criar quarto
- GET /api/rooms/:id - Buscar quarto
- PATCH /api/rooms/:id - Atualizar quarto
- DELETE /api/rooms/:id - Deletar quarto

### Reservations
- GET /api/reservations - Listar reservas
- POST /api/reservations - Criar reserva
- GET /api/reservations/:id - Buscar reserva
- PATCH /api/reservations/:id - Atualizar reserva
- DELETE /api/reservations/:id - Deletar reserva
