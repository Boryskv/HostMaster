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

## Configuração do Banco de Dados

### MySQL Workbench

1. **Abra o MySQL Workbench**
2. **Conecte ao servidor MySQL** (localhost:3306)
3. **Execute o script de inicialização:**
   ```sql
   -- Arquivo: database/init.sql
   CREATE DATABASE IF NOT EXISTS hostmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Configuração

As credenciais do banco estão no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=1234
DB_DATABASE=hostmaster
```

## Instalação

```bash
npm install
```

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

## Tecnologias

- NestJS
- TypeORM
- MySQL
- JWT Authentication
- Bcrypt
- Class Validator

## Notas

- O TypeORM está configurado com `synchronize: true` para desenvolvimento
- As tabelas serão criadas automaticamente ao iniciar o servidor
- Em produção, use migrations em vez de synchronize
