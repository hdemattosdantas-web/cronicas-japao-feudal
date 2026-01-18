# 🎯 Passo a Passo: Configurar PostgreSQL

## ❌ **PROBLEMA IDENTIFICADO:**
Seu `.env` ainda tem:
```
DATABASE_URL="file:./prisma/dev.db"  ← SQLite (precisa mudar para PostgreSQL)
```

---

## 🚀 **SOLUÇÃO: Escolha uma opção abaixo**

---

## **OPÇÃO 1: Railway (Mais Fácil - Cloud Gratuito)**

### **Passo 1: Criar conta no Railway**
1. Acesse: https://railway.app
2. Clique em **"Login"** → **"Login with GitHub"**
3. Autorize o Railway

### **Passo 2: Criar banco PostgreSQL**
1. Clique em **"New Project"**
2. Escolha **"Add Database"**
3. Selecione **"PostgreSQL"**
4. Aguarde ~30 segundos para criar

### **Passo 3: Copiar DATABASE_URL**
1. Clique no banco PostgreSQL criado
2. Vá na aba **"Variables"**
3. Copie o valor de **"DATABASE_URL"**
   - Formato: `postgresql://postgres:password@host:port/database`

### **Passo 4: Configurar no projeto**
1. Abra o arquivo `.env` (ou crie `.env.local`)
2. **SUBSTITUA** a linha:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```
   
   **POR:**
   ```env
   DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway?sslmode=require"
   ```
   (Use a URL que você copiou do Railway)

### **Passo 5: Executar migração**
```bash
npx prisma migrate dev --name init
```

**✅ PRONTO!** Todas as tabelas serão criadas no PostgreSQL.

---

## **OPÇÃO 2: PostgreSQL Local (Windows)**

### **Passo 1: Instalar PostgreSQL**
1. Baixe: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. **Lembre-se da senha** que você definir para o usuário `postgres`
4. Porta padrão: `5432`

### **Passo 2: Criar banco de dados**
1. Abra **"SQL Shell (psql)"** ou **"pgAdmin"**
2. Conecte com usuário `postgres` e sua senha
3. Execute:
```sql
CREATE DATABASE cronicas_japao_feudal;
```

### **Passo 3: Configurar DATABASE_URL**
1. Abra o arquivo `.env` (ou crie `.env.local`)
2. **SUBSTITUA:**
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```
   
   **POR:**
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/cronicas_japao_feudal"
   ```
   (Substitua `SUA_SENHA` pela senha que você definiu)

### **Passo 4: Executar migração**
```bash
npx prisma migrate dev --name init
```

---

## **OPÇÃO 3: Docker Desktop (Se tiver instalado)**

### **Passo 1: Instalar Docker Desktop**
1. Baixe: https://www.docker.com/products/docker-desktop
2. Instale e reinicie o computador
3. Abra Docker Desktop e aguarde iniciar

### **Passo 2: Iniciar PostgreSQL**
```bash
docker-compose up -d
```

### **Passo 3: Configurar DATABASE_URL**
1. Abra o arquivo `.env` (ou crie `.env.local`)
2. **SUBSTITUA:**
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```
   
   **POR:**
   ```env
   DATABASE_URL="postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal"
   ```

### **Passo 4: Executar migração**
```bash
npx prisma migrate dev --name init
```

---

## ✅ **VERIFICAR SE FUNCIONOU**

Após executar `npx prisma migrate dev --name init`, você deve ver:

```
✔ Applied migration `20240118_init` to database `cronicas_japao_feudal`
```

### **Ver tabelas criadas:**
```bash
npx prisma studio
```

Isso abrirá uma interface visual com todas as tabelas criadas!

---

## 🚨 **TROUBLESHOOTING**

### **Erro: "Connection refused"**
- PostgreSQL não está rodando
- Verifique se o serviço está ativo

### **Erro: "Database does not exist"**
- Crie o banco manualmente primeiro
- Use: `CREATE DATABASE cronicas_japao_feudal;`

### **Erro: "User denied access"**
- Verifique usuário e senha na DATABASE_URL
- Confirme que o usuário tem permissões

### **Erro: "SSL required"**
- Adicione `?sslmode=require` no final da URL (Railway)
- Ou `?sslmode=disable` para desenvolvimento local

---

## 📝 **FORMATO CORRETO DA DATABASE_URL**

```
postgresql://[usuario]:[senha]@[host]:[porta]/[banco]?sslmode=require
```

**Exemplos:**
- Railway: `postgresql://postgres:abc123@containers-us-west-1.railway.app:5432/railway?sslmode=require`
- Local: `postgresql://postgres:senha@localhost:5432/cronicas_japao_feudal`
- Docker: `postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal`

---

## 🎯 **RECOMENDAÇÃO**

**Para começar rápido:** Use **Railway** (Opção 1)
- Gratuito
- Sem instalação
- Funciona imediatamente
- Pronto para produção

---

**🎊 Após configurar, execute: `npx prisma migrate dev --name init`**