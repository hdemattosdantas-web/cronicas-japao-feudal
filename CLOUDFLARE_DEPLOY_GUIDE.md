# 🌩️ GUIA DEPLOY - CLOUDFLARE PAGES

## 🚀 **PASSO A PASSO COMPLETO**

### **1. PREPARAR REPOSITÓRIO**
```bash
# Commit das mudanças
git add .
git commit -m "Configurado para Cloudflare Pages - Firebase + Next.js"
git push origin main
```

### **2. CONFIGURAR CLOUDFLARE PAGES**

#### **A) ACESSAR PAINEL**
1. Entrar: https://dash.cloudflare.com
2. Clicar em: **Pages** (menu lateral)
3. Clicar em: **Create application**

#### **B) CONECTAR GITHUB**
1. Selecionar: **Connect to Git**
2. Procurar: `cronicas-japao-feudal`
3. Clicar: **Connect repo**

#### **C) CONFIGURAR BUILD**
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (deixar em branco)
Node.js version: 18.x
```

#### **D) VARIÁVEIS DE AMBIENTE**
Copiar e colar todas as variáveis do arquivo `CLOUDFLARE_ENV_VARS.md`

### **3. DEPLOY AUTOMÁTICO**
1. Clicar em: **Save and Deploy**
2. Aguardar build (2-3 minutos)
3. Acessar: `https://cronicas-japao-feudal.pages.dev`

### **4. CONFIGURAR DOMÍNIO (OPCIONAL)**
1. Em **Custom domains**
2. Adicionar seu domínio
3. Configurar DNS

## ✅ **VANTAGENS CLOUDFLARE**
- 🚀 Performance global CDN
- 💰 Zero-cost para projetos pequenos
- 🔒 SSL automático
- 📊 Analytics integrado
- ⚡ Edge Functions
- 🔄 Deploy automático

## 🎯 **URL FINAL**
Seu site ficará em: `https://cronicas-japao-feudal.pages.dev`

**Deploy Cloudflare pronto!** 🌩️
