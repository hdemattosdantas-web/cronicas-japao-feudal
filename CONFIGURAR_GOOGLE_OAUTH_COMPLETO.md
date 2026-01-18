# 🔧 Configurar Google OAuth - Passo a Passo Completo

## ✅ **SUAS CREDENCIAIS:**
- **Client ID:** `809396998033-9q6bi973g26h1smv0524vd87934aaomk.apps.googleusercontent.com`
- **Client Secret:** `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`
- **Status:** ✅ Ativadas

---

## 🎯 **PASSO 1: Configurar URIs de Redirecionamento**

### **1.1. No Google Cloud Console:**

1. **Clique no seu Client ID** para editar
2. Role até a seção **"Authorized redirect URIs"**
3. Clique em **"+ ADD URI"**
4. Adicione EXATAMENTE esta URL:

```
https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google
```

**⚠️ IMPORTANTE:**
- ✅ Use **HTTPS** (não HTTP)
- ✅ Use o domínio **completo** do Vercel
- ✅ Caminho: `/api/auth/callback/google`
- ❌ **SEM** barra no final
- ❌ **SEM** espaços

### **1.2. Adicionar JavaScript Origins:**

1. Na seção **"Authorized JavaScript origins"**
2. Clique em **"+ ADD URI"**
3. Adicione EXATAMENTE:

```
https://cronicas-japao-feudal-teste.vercel.app
```

**⚠️ IMPORTANTE:**
- ✅ Use **HTTPS**
- ✅ Domínio completo
- ❌ **SEM** barra no final
- ❌ **SEM** `/api/auth/callback/google`

### **1.3. Se quiser testar localmente também:**

Adicione estas URLs também (opcional):

**Redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google
```

**JavaScript Origins:**
```
http://localhost:3000
https://cronicas-japao-feudal-teste.vercel.app
```

### **1.4. Salvar:**

1. Clique em **"SAVE"** no final da página
2. Aguarde a confirmação

---

## 🔑 **PASSO 2: Atualizar Variáveis de Ambiente**

### **2.1. No Vercel (Produção):**

1. Acesse: https://vercel.com
2. Vá no seu projeto
3. **Settings** → **Environment Variables**
4. Atualize ou adicione:

```env
GOOGLE_CLIENT_ID=809396998033-9q6bi973g26h1smv0524vd87934aaomk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=https://cronicas-japao-feudal-teste.vercel.app
NEXTAUTH_SECRET=sua_chave_secreta_aqui
```

5. Clique em **"Save"**
6. **Faça novo deploy** (ou aguarde deploy automático)

### **2.2. Localmente (.env.local):**

Crie/edite o arquivo `.env.local`:

```env
GOOGLE_CLIENT_ID=809396998033-9q6bi973g26h1smv0524vd87934aaomk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aqui
DATABASE_URL=postgresql://postgres:A26B01h88%RPG@db.govhlrciabbjrrmeqfuw.supabase.co:5432/postgres?sslmode=require
```

---

## 🚨 **PASSO 3: Verificar Tela de Consentimento OAuth**

### **3.1. Configurar Tela de Consentimento:**

1. No Google Cloud Console
2. Vá em **"OAuth consent screen"**
3. Verifique se está configurado:

**Informações do App:**
- **Nome do app:** Crônicas do Japão Feudal
- **Email de suporte:** cronicasdojapaofeudal@gmail.com
- **Logo:** (opcional)

**Domínios Autorizados:**
- Adicione: `vercel.app`
- Adicione: `cronicas-japao-feudal-teste.vercel.app`

**Escopos:**
- `email`
- `profile`
- `openid`

**Usuários de Teste (se em modo de teste):**
- Adicione seu email: `h.demattos.dantas@gmail.com`
- Adicione outros emails que vão testar

**Status da Publicação:**
- Se estiver em **"Testing"**, adicione usuários de teste
- Se quiser público, publique o app (pode levar alguns dias para aprovação)

---

## ✅ **PASSO 4: Verificar Configuração**

### **Checklist Final:**

- [ ] Redirect URI adicionado no Google Console
- [ ] JavaScript Origin adicionado no Google Console
- [ ] GOOGLE_CLIENT_ID atualizado no Vercel
- [ ] GOOGLE_CLIENT_SECRET atualizado no Vercel
- [ ] NEXTAUTH_URL configurado no Vercel
- [ ] Tela de consentimento configurada
- [ ] Usuários de teste adicionados (se em modo teste)
- [ ] Aguardou 2-5 minutos após salvar
- [ ] Fez novo deploy no Vercel (se necessário)

---

## 🧪 **PASSO 5: Testar**

### **5.1. Após Configurar:**

1. **Aguarde 2-5 minutos** para propagação
2. **Limpe cache** do navegador (`Ctrl + Shift + Delete`)
3. Acesse: `https://cronicas-japao-feudal-teste.vercel.app/auth/signin`
4. Clique em **"Continuar com Google"**
5. Deve funcionar sem erros!

### **5.2. Se ainda der erro:**

- Verifique se a URL está **EXATAMENTE** como configurada
- Verifique se salvou no Google Console
- Verifique se fez deploy no Vercel
- Aguarde mais tempo (até 10 minutos)
- Teste em aba anônima

---

## 📋 **RESUMO DAS URLs PARA CONFIGURAR**

### **No Google Console → OAuth Client:**

**Authorized redirect URIs:**
```
https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google
```

**Authorized JavaScript origins:**
```
https://cronicas-japao-feudal-teste.vercel.app
```

### **No Vercel → Environment Variables:**

```
GOOGLE_CLIENT_ID=809396998033-9q6bi973g26h1smv0524vd87934aaomk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=https://cronicas-japao-feudal-teste.vercel.app
```

---

## 🎊 **APÓS CONFIGURAR TUDO:**

1. ✅ Salve no Google Console
2. ✅ Atualize no Vercel
3. ✅ Faça deploy (se necessário)
4. ✅ Aguarde 2-5 minutos
5. ✅ Teste o login

**🎯 O Google OAuth funcionará perfeitamente!**