# ⚡ Configuração Rápida PostgreSQL

## 🚨 Erro Atual
```
Error: P1010: User `` was denied access on the database `postgres.public`
```

**Causa:** DATABASE_URL não configurada ou PostgreSQL não acessível.

---

## 🚀 Solução Rápida (3 Opções)

### **Opção 1: Railway (Mais Fácil - 2 minutos)**

1. **Acesse:** https://railway.app
2. **Login** com GitHub
3. **New Project** → **Add Database** → **PostgreSQL**
4. **Copie DATABASE_URL** (clique no banco → Variables)
5. **Cole no `.env.local`:**

```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway?sslmode=require"
```

6. **Execute:**
```bash
npx prisma migrate dev --name init
```

---

### **Opção 2: Docker (Local - 1 minuto)**

1. **Criar `docker-compose.yml`:**

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

2. **Iniciar:**
```bash
docker-compose up -d
```

3. **Configurar `.env.local`:**
```env
DATABASE_URL="postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal"
```

4. **Executar migração:**
```bash
npx prisma migrate dev --name init
```

---

### **Opção 3: PostgreSQL Local (Manual)**

1. **Instalar PostgreSQL:**
   - Windows: https://www.postgresql.org/download/windows/
   - Ou: `choco install postgresql`

2. **Criar banco:**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco
CREATE DATABASE cronicas_japao_feudal;

# Criar usuário (opcional)
CREATE USER cronicas_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE cronicas_japao_feudal TO cronicas_user;

# Sair
\q
```

3. **Configurar `.env.local`:**
```env
DATABASE_URL="postgresql://cronicas_user:sua_senha@localhost:5432/cronicas_japao_feudal"
```

4. **Executar migração:**
```bash
npx prisma migrate dev --name init
```

---

## ✅ Verificar Configuração

### **Testar Conexão:**
```bash
npx prisma db pull
```

### **Ver Schema Visual:**
```bash
npx prisma studio
```

---

## 🎯 Após Configurar

Execute novamente:
```bash
npx prisma migrate dev --name init
```

**Isso criará todas as tabelas no PostgreSQL!**

---

## 📝 Formato DATABASE_URL

```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

**Exemplo Railway:**
```
postgresql://postgres:abc123@containers-us-west-1.railway.app:5432/railway?sslmode=require
```

**Exemplo Local:**
```
postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal
```

---

## 🚨 Troubleshooting

### **Erro: "Connection refused"**
- PostgreSQL não está rodando
- Verifique: `docker ps` ou serviço do Windows

### **Erro: "Database does not exist"**
- Crie o banco manualmente primeiro
- Use: `CREATE DATABASE nome_do_banco;`

### **Erro: "User denied access"**
- Verifique usuário e senha
- Confirme permissões do usuário no banco

---

**🎊 Escolha uma opção acima e configure o DATABASE_URL!**