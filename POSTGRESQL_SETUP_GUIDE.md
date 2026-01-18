# 🐘 Guia: Configuração PostgreSQL para Crônicas do Japão Feudal

## 📋 Pré-requisitos

1. **PostgreSQL instalado** (versão 12+)
2. **Conta no Railway** ou **PostgreSQL local**
3. **Variável DATABASE_URL** configurada

---

## 🚀 Opção 1: Railway (Recomendado - Cloud)

### 1. Criar Banco no Railway

```bash
1. Acesse: https://railway.app
2. Faça login ou crie conta
3. Clique em "New Project"
4. Escolha "Add Database"
5. Selecione "PostgreSQL"
6. Aguarde a criação
```

### 2. Obter DATABASE_URL

```bash
# No Railway Dashboard:
1. Clique no banco PostgreSQL criado
2. Vá em "Variables"
3. Copie a DATABASE_URL
# Formato: postgresql://user:password@host:port/database
```

### 3. Configurar no Projeto

```bash
# Criar/editar .env.local
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### 4. Executar Migração

```bash
npx prisma migrate dev --name init
```

---

## 🖥️ Opção 2: PostgreSQL Local

### 1. Instalar PostgreSQL

```bash
# Windows (usando Chocolatey)
choco install postgresql

# Ou baixar de: https://www.postgresql.org/download/
```

### 2. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE cronicas_japao_feudal;

# Criar usuário (opcional)
CREATE USER cronicas_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE cronicas_japao_feudal TO cronicas_user;

# Sair
\q
```

### 3. Configurar DATABASE_URL

```bash
# .env.local
DATABASE_URL="postgresql://cronicas_user:sua_senha_segura@localhost:5432/cronicas_japao_feudal"
```

### 4. Executar Migração

```bash
npx prisma migrate dev --name init
```

---

## 🎯 Opção 3: Docker (Rápido para Desenvolvimento)

### 1. Criar docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: cronicas_postgres
    environment:
      POSTGRES_USER: cronicas
      POSTGRES_PASSWORD: cronicas123
      POSTGRES_DB: cronicas_japao_feudal
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Iniciar Container

```bash
docker-compose up -d
```

### 3. Configurar DATABASE_URL

```bash
# .env.local
DATABASE_URL="postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal"
```

### 4. Executar Migração

```bash
npx prisma migrate dev --name init
```

---

## 📊 Estrutura do Schema Criado

### ✅ **Tabelas NextAuth (Autenticação)**
- `Account` - Contas OAuth (Google, etc)
- `Session` - Sessões de usuário
- `User` - Usuários do sistema
- `VerificationToken` - Tokens de verificação

### ✅ **Tabelas de Jogo**
- `Character` - Personagens dos jogadores
- `Attributes` - Atributos dos personagens (separado para melhor organização)

### ✅ **Tabelas de Conquistas**
- `Achievement` - Conquistas disponíveis
- `UserAchievement` - Conquistas desbloqueadas pelos usuários

### ✅ **Tabelas Sociais**
- `FriendRequest` - Solicitações de amizade
- `Friend` - Amizades confirmadas

### ✅ **Tabelas de Chat**
- `ChatRoom` - Salas de chat
- `ChatParticipant` - Participantes das salas
- `ChatMessage` - Mensagens enviadas

---

## 🔧 Comandos Úteis

### Verificar Conexão

```bash
npx prisma db pull
```

### Ver Schema no Browser

```bash
npx prisma studio
```

### Resetar Banco (CUIDADO!)

```bash
npx prisma migrate reset
```

### Criar Nova Migração

```bash
npx prisma migrate dev --name nome_da_migracao
```

### Aplicar Migrações em Produção

```bash
npx prisma migrate deploy
```

---

## 🚨 Troubleshooting

### Erro: "User was denied access"
- Verifique se o usuário tem permissões no banco
- Confirme se a senha está correta
- Verifique se o banco existe

### Erro: "Connection refused"
- Verifique se PostgreSQL está rodando
- Confirme porta (padrão: 5432)
- Verifique firewall

### Erro: "Database does not exist"
- Crie o banco manualmente primeiro
- Use: `CREATE DATABASE nome_do_banco;`

### Erro: "SSL required"
- Adicione `?sslmode=require` na DATABASE_URL
- Ou `?sslmode=disable` para desenvolvimento local

---

## 📝 Exemplo de DATABASE_URL

### Railway (Produção)
```
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway?sslmode=require"
```

### Local (Desenvolvimento)
```
DATABASE_URL="postgresql://user:password@localhost:5432/cronicas_japao_feudal"
```

### Docker
```
DATABASE_URL="postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal"
```

---

## ✅ Checklist de Configuração

- [ ] PostgreSQL instalado/configurado
- [ ] Banco de dados criado
- [ ] DATABASE_URL configurada no `.env.local`
- [ ] Cliente Prisma gerado (`npx prisma generate`)
- [ ] Migração executada (`npx prisma migrate dev --name init`)
- [ ] Schema validado (`npx prisma studio`)

---

## 🎯 Próximos Passos

Após configurar o PostgreSQL:

1. ✅ **Executar migração**: `npx prisma migrate dev --name init`
2. ✅ **Verificar tabelas**: `npx prisma studio`
3. ✅ **Testar aplicação**: `npm run dev`
4. ✅ **Configurar no Vercel**: Adicionar DATABASE_URL nas variáveis de ambiente

---

## 📞 Suporte

**Problemas com Railway?**
- Verifique logs no dashboard
- Confirme variáveis de ambiente
- Teste conexão local primeiro

**Problemas Locais?**
- Verifique se PostgreSQL está rodando: `pg_isready`
- Teste conexão: `psql -U usuario -d banco`
- Verifique logs do PostgreSQL

---

**🎊 Após configurar, execute: `npx prisma migrate dev --name init`**