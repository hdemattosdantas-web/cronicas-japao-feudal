-- Script SQL de inicialização para PostgreSQL
-- Execute este script apenas se criar o banco manualmente

-- Criar banco de dados (execute como superusuário)
-- CREATE DATABASE cronicas_japao_feudal;

-- Conectar ao banco criado
-- \c cronicas_japao_feudal;

-- Criar extensões úteis (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- As tabelas serão criadas automaticamente pelo Prisma Migrate
-- Execute: npx prisma migrate dev --name init

-- Verificar tabelas criadas
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;