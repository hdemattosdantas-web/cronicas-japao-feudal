# 🚀 CONFIGURAÇÕES FINAIS - CRÔNICAS DO JAPÃO FEUDAL

## ✅ **VARIÁVEIS DE AMBIENTE PARA VERCEL**

Copie e cole estas variáveis no **Vercel Dashboard** → **Environment Variables**:

```
# Autenticação
NEXTAUTH_URL=https://cronicas-japao-feudal-teste.vercel.app
NEXTAUTH_SECRET=HvYgzhcCfrqtV8vVx+BDF6qHpMjqGayj7O3JxBIQRKE=

# Banco de Dados (Supabase)
DATABASE_URL=postgresql://postgres:[SUA_SENHA_SUPABASE]@db.PROJECT_REF.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mTWj6XywRsTooH6MpGf3eQ_IiLiy5Pa

# Email (Gmail)
EMAIL_FROM=Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=cronicasdojapaofeudal@gmail.com
EMAIL_SERVER_PASSWORD=SUA_SENHA_APP_GMAIL
```

## 📋 **O QUE PRECISA PREENCHER:**

### 🔐 **SENHAS**
- `SUA_SENHA_SUPABASE`: Senha do banco Supabase
- `SUA_SENHA_APP_GMAIL`: Senha de App do Gmail

### 🏷️ **PROJECT_REF**
- Substitua `PROJECT_REF` pelo seu Project Reference do Supabase
- Exemplo: `abcdefgh1234` (sem `sbp_` no início)

## 🎯 **URL FINAL DO PROJETO**
Seu projeto ficará em: 
```
https://cronicas-japao-feudal-teste.vercel.app
```

## 🚀 **PASSOS FINAIS**

### 1. Configurar Vercel
1. Acesse: https://vercel.com/dashboard
2. Vá em: **Settings** → **Environment Variables**
3. Adicione TODAS as variáveis acima
4. Clique em **Save**

### 2. Fazer Deploy
1. Vá em: **Deployments**
2. Clique em: **Redeploy** (se já tiver deploy anterior)
3. Aguarde finalizar

### 3. Aplicar Schema (se necessário)
Se o banco estiver vazio, execute:
```bash
npx supabase db push
```

## ✅ **TESTE FINAL**

Após o deploy, teste:
1. ✅ Criar conta no site
2. ✅ Fazer login com email/senha
3. ✅ Definir username
4. ✅ Criar personagem
5. ✅ Verificar inventário
6. ✅ Testar sistema de amigos

**Seu sistema estará 100% funcional!** 🎉
