# ⚡ Configurar DATABASE_URL - Guia Rápido

## 🚨 **ERRO ATUAL:**
```
Error: P1010: User `` was denied access on the database `postgres.public`
```

**Solução:** Configure o DATABASE_URL antes de executar a migração.

---

## 🚀 **OPÇÃO MAIS RÁPIDA: Docker (2 minutos)**

### **1. Iniciar PostgreSQL:**
```bash
docker-compose up -d
```

### **2. Criar arquivo `.env.local`:**
```env
DATABASE_URL="postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
```

### **3. Executar migração:**
```bash
npx prisma migrate dev --name init
```

---

## 🎯 **OPÇÃO ALTERNATIVA: Railway (Cloud)**

### **1. Criar banco no Railway:**
- Acesse: https://railway.app
- New Project → Add Database → PostgreSQL
- Copie a DATABASE_URL

### **2. Configurar `.env.local`:**
```env
DATABASE_URL="postgresql://postgres:password@host:port/database?sslmode=require"
```

### **3. Executar migração:**
```bash
npx prisma migrate dev --name init
```

---

## ✅ **VERIFICAR SE FUNCIONOU:**

```bash
# Ver tabelas criadas
npx prisma studio

# Ou verificar no banco
docker exec -it cronicas_japao_feudal_postgres psql -U cronicas -d cronicas_japao_feudal -c "\dt"
```

---

## 📝 **FORMATO DATABASE_URL:**

```
postgresql://[usuario]:[senha]@[host]:[porta]/[banco]
```

**Exemplos:**
- Docker: `postgresql://cronicas:cronicas123@localhost:5432/cronicas_japao_feudal`
- Railway: `postgresql://postgres:abc@containers-us-west-1.railway.app:5432/railway?sslmode=require`
- Local: `postgresql://postgres:senha@localhost:5432/cronicas_japao_feudal`

---

**🎊 Após configurar, execute: `npx prisma migrate dev --name init`**