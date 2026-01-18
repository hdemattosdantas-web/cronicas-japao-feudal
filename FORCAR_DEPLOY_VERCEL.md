# 🚨 FORÇAR NOVO DEPLOY - VERCEL

## 📋 **PASSOS PARA LIMPAR CACHE:**

### 1. **Redeploy Manual:**
```bash
# No painel do Vercel:
# 1. Vá para o projeto
# 2. Clique em "View Deployments"
# 3. Clique nos "..." do deploy mais recente
# 4. Selecione "Redeploy"
```

### 2. **Limpar Cache via Vercel CLI:**
```bash
vercel --prod
```

### 3. **Variáveis de Ambiente Necessárias:**
```
NEXTAUTH_SECRET=HvYgzhcCfrqtV8vVx+BDF6qHpMjqGayj7O3JxBIQRKE=
DATABASE_URL=postgresql://...
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu-email@gmail.com
EMAIL_SERVER_PASSWORD=sua-senha
EMAIL_FROM=Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>
```

## ✅ **BUILD LOCAL FUNCIONANDO:**
- ✓ Prisma generate: OK
- ✓ TypeScript compilation: OK  
- ✓ Next.js build: OK
- ✓ 39 páginas geradas: OK

## 🎯 **PRÓXIMA AÇÃO:**
Forçar redeploy no Vercel para limpar cache antigo!
