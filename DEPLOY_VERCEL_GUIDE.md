# 🚀 Guia de Deploy - Vercel

## Pré-requisitos

1. **Conta no GitHub** com o repositório criado
2. **Conta no Vercel** conectada ao GitHub
3. **Token do Vercel** para CI/CD

---

## 📋 Configuração Inicial no Vercel

### 1. Importar Projeto

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New..."** → **"Project"**
3. Conecte sua conta do GitHub
4. Selecione o repositório `cronicas-japao-feudal`

### 2. Configurar Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `./` (padrão)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automático)

### 3. Configurar Environment Variables

Adicione estas variáveis no Vercel:

```bash
# Autenticação (OBRIGATÓRIAS)
NEXTAUTH_URL=https://cronicas-japao-feudal-teste.vercel.app
NEXTAUTH_SECRET=k8FJ3s7A9KxQmPp3L2D1E9zQnYtV0+0xRkA7mE2cQ=

# Google OAuth (OBRIGATÓRIAS)
GOOGLE_CLIENT_ID=809396998033-c7fqmtrd2pf5jrjcjlaq2d094lr9so83.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Banco de Dados (SQLite na Vercel)
DATABASE_URL=file:./prisma/dev.db
```

### 🚨 ERRO ATUAL - APPLICATION ERROR:

**Se você está vendo esta mensagem:**
```
Application error: a server-side exception has occurred while loading cronicas-japao-feudal-teste.vercel.app
```

**É porque as variáveis de ambiente não estão configuradas!**

#### Como Resolver Agora:

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione:** `cronicas-japao-feudal-teste`
3. **Settings → Environment Variables**
4. **Adicione cada variável acima** exatamente como mostrado
5. **Environment:** `Production`
6. **Após adicionar:** Clique em **"Redeploy"** no topo da página

#### Status Atual:
- ❌ **API retorna 500** (variáveis faltando)
- ✅ **Build funciona** localmente
- 🔄 **Deploy pendente** de configuração

### 4. Configurar Domain (Opcional)

- Vá para **Settings** → **Domains**
- Adicione seu domínio customizado
- Configure DNS conforme instruções

---

## 🔧 Configuração do GitHub Actions (Deploy Automático)

### 1. Gerar Token do Vercel

1. Acesse [Vercel Account Settings](https://vercel.com/account/tokens)
2. Crie um novo token com nome `VERCEL_TOKEN`
3. Copie o token gerado

### 2. Obter IDs do Projeto

```bash
# Instale Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Link do projeto (na pasta do projeto)
vercel link

# Obtenha os IDs
vercel env ls
```

### 3. Configurar Secrets no GitHub

1. Acesse seu repositório no GitHub
2. Vá para **Settings** → **Secrets and variables** → **Actions**
3. Adicione estes secrets:

```
VERCEL_TOKEN=seu_token_aqui
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

### 4. Push para GitHub

```bash
git add .
git commit -m "Add Vercel configuration and GitHub Actions"
git push origin main
```

---

## 📊 Monitoramento do Deploy

### Status do Deploy

- **Vercel Dashboard**: Acompanhe builds em tempo real
- **GitHub Actions**: Veja logs detalhados dos deploys

### Logs de Erro

- **Vercel Functions**: Verifique logs das serverless functions
- **Console do Browser**: Verifique erros de client-side

---

## 🔄 Atualizações Automáticas

### Como Funciona

1. **Push para `main`**: Deploy automático para produção
2. **Pull Request**: Deploy para preview environment
3. **Falha no build**: Notificação por email

### Rollback

Se algo der errado:

1. Acesse Vercel Dashboard
2. Vá para **Deployments**
3. Clique nos três pontos do deploy anterior
4. Selecione **"Rollback"**

---

## 🗄️ Configuração do Banco de Dados

### Vercel + SQLite

Como o projeto usa SQLite, considere:

1. **Vercel Postgres**: Para produção real
2. **Railway/PlanetScale**: Alternativas gratuitas
3. **Local SQLite**: Para desenvolvimento

### Migração para Postgres

```bash
# Instalar dependências
npm install @vercel/postgres

# Atualizar schema.prisma
datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL")
}

# Migrar dados
npx prisma migrate deploy
```

---

## 🌐 Otimizações para Produção

### Performance

- ✅ **Static Generation**: Páginas otimizadas
- ✅ **Image Optimization**: Next.js automático
- ✅ **Code Splitting**: Automático

### Segurança

- ✅ **Headers de Segurança**: Configurados
- ✅ **HTTPS**: Automático no Vercel
- ✅ **Environment Variables**: Protegidas

---

## 🚨 Troubleshooting

### Build Falhando

```bash
# Verificar localmente
npm run build

# Verificar tipos
npx tsc --noEmit
```

### Database Connection

```bash
# Resetar banco local
npx prisma migrate reset --force

# Push schema
npx prisma db push
```

### Environment Variables

```bash
# Verificar se estão definidas
vercel env ls
```

---

## 🎯 Próximos Passos

1. ✅ **Deploy inicial** funcionando
2. 🔄 **Configurar domínio** customizado
3. 🔄 **Migrar para Postgres** (se necessário)
4. 🔄 **Configurar monitoramento** (Sentry, etc.)
5. 🔄 **Setup CDN** para assets estáticos

---

**🎉 Seu RPG está pronto para o mundo!**