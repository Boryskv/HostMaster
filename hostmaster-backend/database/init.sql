-- Script de inicialização do banco de dados HostMaster
-- Execute este script no MySQL Workbench antes de iniciar o backend

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS hostmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE hostmaster;

-- O TypeORM criará as tabelas automaticamente com synchronize: true
-- Este script apenas garante que o banco existe

-- Verificar se o banco foi criado
SELECT 'Banco de dados hostmaster criado com sucesso!' AS status;
