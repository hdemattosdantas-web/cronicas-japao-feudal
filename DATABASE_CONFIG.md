# 🗄️ BANCO DE DADOS - CONFIGURAÇÃO

## 📊 **TIPOS DE BANCO:**

### 🏠 **DESENVOLVIMENTO LOCAL:**
```bash
DATABASE_URL="file:./prisma/dev.db"
```
- ✅ SQLite local
- ✅ Arquivo único
- ✅ Rápido e simples
- ❌ Não serve para produção

### 🚀 **PRODUÇÃO (VERCEL):**
```bash
# Opção 1: Supabase (Recomendado)
DATABASE_URL="postgresql://postgres.suaSenha:@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# Opção 2: Railway
DATABASE_URL="postgresql://postgres:senha@containers-us-west-1.railway.app:7657/railway"

# Opção 3: Neon
DATABASE_URL="postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

## 🎯 **PARA O VERCEL:**

### 1. **SUPABASE (GRATUITO):**
```bash
# 1. Crie conta em supabase.com
# 2. Crie novo projeto
# 3. Vá em Settings → Database
# 4. Copie a Connection String
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[PROJETO].supabase.co:5432/postgres"
```

### 2. **RAILWAY (GRATUITO):**
```bash
# 1. Crie conta em railway.app
# 2. Crie novo projeto PostgreSQL
# 3. Copie a URL de conexão
```

## ⚠️ **IMPORTANTE:**
- ✅ **Local**: SQLite funciona
- ❌ **Produção**: PostgreSQL OBRIGATÓRIO
- ✅ **Vercel**: Precisa de banco externo

## 🚀 **PASSOS:**
1. **Criar banco PostgreSQL** (Supabase recomendado)
2. **Configurar no Vercel** como Environment Variable
3. **Migrar dados** se necessário

**O SQLite local está ok, mas produção precisa PostgreSQL!** 🎯
