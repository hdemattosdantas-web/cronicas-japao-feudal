# 🗄️ DEPLOY COM SUPABASE - GUIA RÁPIDO

## ✅ **PRÉ-REQUISITOS**

### 1. Instalar Supabase CLI
```bash
npm install -g supabase
```

### 2. Fazer Login no Supabase
```bash
supabase login
```

## 🚀 **PASSO A PASSO**

### Passo 1: Conectar ao Projeto
```bash
# No diretório do projeto
supabase link --project-ref SEU_PROJECT_REF
```

### Passo 2: Aplicar Migrações
```bash
# Aplicar schema completo
supabase db push
```

### Passo 3: Verificar Status
```bash
# Verificar se tudo foi aplicado
supabase db status
```

## 🔗 **CONFIGURAÇÃO NO VERCEL**

### Environment Variables necessárias:
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
NEXTAUTH_URL=https://sua-url.vercel.app
NEXTAUTH_SECRET=HvYgzhcCfrqtV8vVx+BDF6qHpMjqGayj7O3JxBIQRKE=
EMAIL_SERVER_PASSWORD=sua_senha_app_gmail
```

## 📋 **ONDE ENCONTRAR AS INFORMAÇÕES**

### No Supabase Dashboard:
1. **Project Settings** → **API**
   - `Project URL` e `anon key`
   
2. **Project Settings** → **Database**
   - **Connection string** (para DATABASE_URL)
   - **Project Reference** (para supabase link)

### Exemplo de DATABASE_URL:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

## ⚡ **DEPLOY AUTOMÁTICO**

### Opção 1: Vercel Integration
1. No Vercel: **Settings** → **Integrations**
2. Adicione **Supabase**
3. Configure as variáveis automaticamente

### Opção 2: Manual
1. Configure as variáveis manualmente
2. Faça deploy
3. Execute `supabase db push` se necessário

## 🎯 **TESTE FINAL**

Após deploy:
1. Acesse sua URL do Vercel
2. Teste criação de usuário
3. Teste login com email/senha
4. Verifique se username funciona
5. Teste sistema de amigos

**Seu sistema estará 100% funcional!** 🎉
