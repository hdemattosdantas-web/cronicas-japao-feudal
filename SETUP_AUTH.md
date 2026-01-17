# 🔐 Configuração da Autenticação - Crônicas do Japão Feudal

## 📋 Pré-requisitos

O sistema de autenticação foi implementado usando NextAuth.js com suporte para:
- ✅ **Google OAuth** (recomendado)
- ✅ **Login por Email** (link mágico)

## 🔧 Configuração das Variáveis de Ambiente

### 1. Arquivo `.env.local` (já criado)

```bash
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-super-segura-aqui"

# Google OAuth (Obrigatório para Google login)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Email (Opcional - para login por email)
RESEND_API_KEY="sua-chave-resend-api"
EMAIL_FROM="noreply@cronicas-japao-feudal.com"
```

### 2. Como obter as credenciais

#### Google OAuth:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a "Google+ API"
4. Vá para "Credenciais" → "Criar Credenciais" → "ID do cliente OAuth"
5. Configure:
   - Tipo: Aplicação Web
   - URIs autorizadas: `http://localhost:3000`
   - URIs de redirecionamento: `http://localhost:3000/api/auth/callback/google`
6. Copie o Client ID e Client Secret

#### Resend (para emails):
1. Acesse [Resend](https://resend.com/)
2. Crie uma conta gratuita
3. Vá para API Keys e gere uma chave
4. Configure o domínio se necessário

## 🚀 Como testar

### 1. Iniciar o servidor
```bash
npm run dev
```

### 2. Acessar a aplicação
- **Página inicial**: http://localhost:3000
- **Login**: http://localhost:3000/auth/signin

### 3. Fluxo de teste
1. Clique em "Entrar" no cabeçalho
2. Escolha "Continuar com Google" ou "Enviar Link Mágico"
3. Após login, acesse "Criar Personagem"
4. Crie um personagem (agora protegido por autenticação)

## 🔧 Funcionalidades Implementadas

### ✅ Sistema Básico Funcionando
- [x] Página de login personalizada
- [x] Autenticação com Google OAuth
- [x] Autenticação por email (link mágico)
- [x] Middleware de proteção de rotas
- [x] Navegação condicional (logado/não logado)
- [x] Integração com sistema de personagens

### ⚠️ Funcionalidades Temporariamente Desabilitadas
- [ ] Persistência de dados (Prisma) - será reabilitada após configuração completa
- [ ] Salvamento de personagens no banco

## 🐛 Problemas Conhecidos

### Prisma Database
O sistema de banco de dados foi temporariamente desabilitado devido a conflitos de configuração. Para reabilitar:

1. Configure corretamente o `DATABASE_URL` no `.env.local`
2. Execute:
```bash
npx prisma generate
npx prisma migrate dev
```
3. Reative o `PrismaAdapter` em `lib/auth/config.ts`

### Middleware Deprecation Warning
O Next.js mostra um warning sobre middleware deprecated. Isso é normal - estamos usando a versão correta para App Router.

## 🎯 Status Atual

**Sistema de Autenticação**: ✅ **FUNCIONANDO**
- Login/logout funcionam
- Rotas protegidas
- UI responsiva
- Integração com personagens

**Banco de Dados**: ⏳ **PENDENTE**
- Prisma configurado mas temporariamente desabilitado
- Precisa de configuração adicional para produção

## 📞 Suporte

Se tiver problemas:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que as portas 3000 não estão em uso
3. Teste primeiro com Google OAuth (mais simples)

---

**🎮 Pronto para testar? Execute `npm run dev` e acesse http://localhost:3000/auth/signin**