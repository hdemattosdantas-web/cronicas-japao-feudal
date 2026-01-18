# 🔧 Corrigir Google OAuth - Erro redirect_uri_mismatch

## 🚨 **ERRO ATUAL:**
```
Erro 400: redirect_uri_mismatch
Acesso bloqueado: a solicitação desse app é inválida
```

---

## 🎯 **SOLUÇÃO: Configurar URI de Redirecionamento Correta**

### **Passo 1: Identificar sua URL de Produção**

Sua aplicação está em:
- **Vercel:** `https://cronicas-japao-feudal-teste.vercel.app`
- **Ou outra URL:** Verifique no dashboard do Vercel

### **Passo 2: Acessar Google Cloud Console**

1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto
3. Vá em **"APIs & Services"** → **"Credentials"**
4. Encontre seu **OAuth 2.0 Client ID**
5. Clique para editar

### **Passo 3: Configurar Authorized Redirect URIs**

Na seção **"Authorized redirect URIs"**, adicione EXATAMENTE:

```
https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google
```

**⚠️ IMPORTANTE:**
- Use **HTTPS** (não HTTP)
- Use o domínio **exato** do Vercel
- Caminho deve ser: `/api/auth/callback/google`
- **Sem barra no final**

### **Passo 4: Configurar Authorized JavaScript Origins**

Na seção **"Authorized JavaScript origins"**, adicione:

```
https://cronicas-japao-feudal-teste.vercel.app
```

**⚠️ IMPORTANTE:**
- Use **HTTPS**
- **Sem barra no final**
- **Sem** `/api/auth/callback/google`

### **Passo 5: Salvar e Aguardar**

1. Clique em **"Save"**
2. Aguarde **2-5 minutos** para propagação
3. Tente fazer login novamente

---

## 🔍 **VERIFICAR URL ATUAL DO VERCEL**

### **Opção 1: Dashboard Vercel**
1. Acesse: https://vercel.com
2. Vá no seu projeto
3. Veja a URL em **"Domains"** ou no topo da página

### **Opção 2: Verificar Deploy**
1. Vá em **"Deployments"**
2. Clique no deploy mais recente
3. Veja a URL no topo

---

## 📝 **EXEMPLO COMPLETO DE CONFIGURAÇÃO**

### **Authorized Redirect URIs:**
```
https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google
```

### **Authorized JavaScript Origins:**
```
https://cronicas-japao-feudal-teste.vercel.app
```

### **Se tiver domínio customizado:**
```
https://seudominio.com/api/auth/callback/google
https://seudominio.com
```

---

## 🚨 **TROUBLESHOOTING**

### **Erro persiste após configurar:**
1. **Limpe cache do navegador** (Ctrl+Shift+Delete)
2. **Aguarde 5 minutos** para propagação
3. **Verifique** se a URL está EXATAMENTE correta (sem espaços, sem barras extras)
4. **Teste em aba anônima** do navegador

### **Múltiplas URLs:**
Se você tem múltiplos ambientes, adicione TODAS:

```
# Produção
https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google

# Preview (se necessário)
https://cronicas-japao-feudal-teste-git-main.vercel.app/api/auth/callback/google

# Local (opcional, para desenvolvimento)
http://localhost:3000/api/auth/callback/google
```

### **Verificar NEXTAUTH_URL no Vercel:**
1. Vá em **Settings** → **Environment Variables**
2. Verifique se `NEXTAUTH_URL` está configurado:
   ```
   NEXTAUTH_URL=https://cronicas-japao-feudal-teste.vercel.app
   ```
3. Se não estiver, adicione e faça novo deploy

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] URL de produção identificada corretamente
- [ ] Redirect URI adicionado no Google Console
- [ ] JavaScript Origin adicionado no Google Console
- [ ] NEXTAUTH_URL configurado no Vercel
- [ ] Aguardou 2-5 minutos para propagação
- [ ] Limpou cache do navegador
- [ ] Testou em aba anônima

---

## 🎯 **FORMATO CORRETO**

### **Redirect URI:**
```
https://[SEU-DOMINIO]/api/auth/callback/google
```

### **JavaScript Origin:**
```
https://[SEU-DOMINIO]
```

**Exemplo real:**
```
Redirect URI: https://cronicas-japao-feudal-teste.vercel.app/api/auth/callback/google
JavaScript Origin: https://cronicas-japao-feudal-teste.vercel.app
```

---

## 🚀 **APÓS CONFIGURAR**

1. **Salve** as configurações no Google Console
2. **Aguarde** 2-5 minutos
3. **Teste** o login com Google
4. **Deve funcionar** sem erros!

---

**🎊 Siga os passos acima e o Google OAuth funcionará perfeitamente!**