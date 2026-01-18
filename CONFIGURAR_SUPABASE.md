# 🚀 Configurar Supabase - Passo a Passo

## ✅ **Você já tem a Connection String do Supabase!**

```
postgresql://postgres:[YOUR-PASSWORD]@db.govhlrciabbjrrmeqfuw.supabase.co:5432/postgres
```

---

## 📝 **PASSO 1: Obter sua senha do Supabase**

1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Vá no seu projeto
4. Clique em **"Settings"** → **"Database"**
5. Role até **"Connection string"**
6. Clique em **"Show connection string"**
7. Copie a senha que aparece (ou use a senha que você definiu ao criar o projeto)

---

## 📝 **PASSO 2: Atualizar arquivo .env**

1. Abra o arquivo `.env` na raiz do projeto
2. **SUBSTITUA** a linha `DATABASE_URL` atual por:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.govhlrciabbjrrmeqfuw.supabase.co:5432/postgres?sslmode=require"
```

**⚠️ IMPORTANTE:** 
- Substitua `SUA_SENHA_AQUI` pela senha real do seu banco Supabase
- Adicione `?sslmode=require` no final (obrigatório para Supabase)

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:MinhaSenha123@db.govhlrciabbjrrmeqfuw.supabase.co:5432/postgres?sslmode=require"
```

---

## 📝 **PASSO 3: Executar Migração**

Após atualizar o `.env`, execute:

```bash
npx prisma migrate dev --name init
```

Isso criará todas as tabelas no seu banco Supabase!

---

## ✅ **VERIFICAR SE FUNCIONOU**

### **Opção 1: Ver no Supabase Dashboard**
1. Acesse seu projeto no Supabase
2. Vá em **"Table Editor"**
3. Você deve ver todas as tabelas criadas:
   - `User`
   - `Character`
   - `Attributes`
   - `Achievement`
   - `UserAchievement`
   - E outras...

### **Opção 2: Usar Prisma Studio**
```bash
npx prisma studio
```

Isso abrirá uma interface visual com todas as tabelas.

---

## 🔒 **SEGURANÇA**

### **⚠️ NUNCA commite o arquivo .env no Git!**

Certifique-se de que `.env` está no `.gitignore`:

```gitignore
.env
.env.local
.env*.local
```

---

## 🚨 **TROUBLESHOOTING**

### **Erro: "SSL required"**
- Adicione `?sslmode=require` no final da URL
- Formato correto: `...postgres?sslmode=require`

### **Erro: "Password authentication failed"**
- Verifique se a senha está correta
- Copie a senha diretamente do Supabase Dashboard

### **Erro: "Connection timeout"**
- Verifique sua conexão com internet
- Confirme que o projeto Supabase está ativo

### **Erro: "Database does not exist"**
- Use `postgres` como nome do banco (padrão do Supabase)
- Não precisa criar banco manualmente no Supabase

---

## 📋 **FORMATO FINAL DA CONNECTION STRING**

```env
DATABASE_URL="postgresql://postgres:SENHA@db.govhlrciabbjrrmeqfuw.supabase.co:5432/postgres?sslmode=require"
```

**Componentes:**
- `postgres` = usuário (padrão Supabase)
- `SENHA` = sua senha do banco
- `db.govhlrciabbjrrmeqfuw.supabase.co` = host do Supabase
- `5432` = porta PostgreSQL
- `postgres` = nome do banco (padrão)
- `?sslmode=require` = SSL obrigatório

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ Atualizar `.env` com sua senha real
2. ✅ Executar: `npx prisma migrate dev --name init`
3. ✅ Verificar tabelas no Supabase Dashboard
4. ✅ Começar a usar o banco!

---

**🎊 Após configurar, execute: `npx prisma migrate dev --name init`**