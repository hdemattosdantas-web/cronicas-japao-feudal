# 🌩️ MIGRAÇÃO PARA CLOUDFLARE PAGES

## 📋 **CONFIGURAÇÃO COMPLETA**

### 🔧 **1. BUILD SETTINGS**
```yaml
# _headers
/*  
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### 📦 **2. DEPLOY CONFIG**
```yaml
# wrangler.toml
name = "cronicas-japao-feudal"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
vars = { ENVIRONMENT = "production" }

[env.preview]
vars = { ENVIRONMENT = "preview" }
```

### 🎯 **3. BUILD COMMAND**
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: `18.x`

## 🚀 **PASSOS PARA DEPLOY**

### **PASSO 1: PREPARAR PROJETO**
```bash
# Instalar dependências
npm install

# Build para teste
npm run build
```

### **PASSO 2: CONFIGURAR CLOUDFLARE**
1. Entrar: https://dash.cloudflare.com
2. Ir para: Pages → Create application
3. Conectar GitHub repository
4. Configurar build settings

### **PASSO 3: VARIÁVEIS DE AMBIENTE**
```
NEXTAUTH_SECRET=HvYgzhcCfrqtV8vVx+BDF6qHpMjqGayj7O3JxBIQRKE=
NEXTAUTH_URL=https://cronicas-japao-feudal.pages.dev
FIREBASE_API_KEY=AIzaSyDTRpVR7-sq-7eoEuWfhesn9usvXQVi8EA
FIREBASE_AUTH_DOMAIN=cronicas-do-japao-16aff.firebaseapp.com
FIREBASE_PROJECT_ID=cronicas-do-japao-16aff
FIREBASE_STORAGE_BUCKET=cronicas-do-japao-16aff.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=82326556292
FIREBASE_APP_ID=1:82326556292:web:fdbc83fbb7c6a11a437cd1
FIREBASE_MEASUREMENT_ID=G-X5W8Q3MDHE
OPENAI_API_KEY=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
```

## 🎨 **VANTAGENS CLOUDFLARE**
✅ Performance global com CDN
✅ Zero-cost para projetos pequenos
✅ Analytics integrado
✅ SSL automático
✅ Edge functions
✅ Build automático com GitHub

## 🔄 **MIGRAÇÃO AUTOMÁTICA**
O Cloudflare detectará automaticamente o Next.js e configurará tudo!
