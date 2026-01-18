# 🚄 Guia: Migração para PostgreSQL com Railway

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Projeto já criado no Railway

## 🚀 Passos para Migração

### 1. Criar Banco PostgreSQL no Railway

```bash
# No painel do Railway:
1. Vá para seu projeto
2. Clique em "Add Service"
3. Escolha "Database"
4. Selecione "PostgreSQL"
5. Clique em "Create"
```

### 2. Obter a DATABASE_URL

```bash
# No painel do Railway:
1. Vá para a aba "Variables" do seu banco PostgreSQL
2. Copie a DATABASE_URL gerada
# Ela terá o formato: postgresql://user:password@host:port/database
```

### 3. Atualizar Variáveis de Ambiente

#### Local (.env.local):
```env
DATABASE_URL="postgresql://user:password@containers-us-west-1.railway.app:port/railway"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="seu_google_client_id"
GOOGLE_CLIENT_SECRET="seu_google_client_secret"
NEXTAUTH_SECRET="sua_nextauth_secret"
```

#### Vercel (Dashboard):
```env
DATABASE_URL=postgresql://user:password@containers-us-west-1.railway.app:port/railway
NEXTAUTH_URL=https://cronicas-japao-feudal-teste.vercel.app
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
NEXTAUTH_SECRET=sua_nextauth_secret
```

### 4. Executar Migração

```bash
# 1. Instalar dependências do PostgreSQL (se necessário)
npm install

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Criar migração
npx prisma migrate dev --name init_postgresql

# 4. Aplicar migração no banco
npx prisma db push

# 5. Verificar se está funcionando
npx prisma studio
```

### 5. Testar a Aplicação

```bash
# Rodar aplicação local
npm run dev

# Verificar se conecta ao banco
# Testar login e criação de personagem
```

### 6. Deploy no Vercel

```bash
# Após testar localmente:
1. Commit das mudanças
git add .
git commit -m "feat: migrate to PostgreSQL"

# 2. Push para GitHub
git push origin main

# 3. Vercel fará deploy automático
# 4. Verificar se aplicação está funcionando
```

## 🔧 Comandos Úteis

```bash
# Ver status do banco
npx prisma db push --preview-feature

# Resetar banco (cuidado!)
npx prisma migrate reset

# Ver dados no banco
npx prisma studio

# Gerar tipos
npx prisma generate
```

## 🐛 Troubleshooting

### Erro: "P1001: Can't reach database server"
- Verifique se a DATABASE_URL está correta
- Confirme se o banco Railway está ativo
- Verifique se as credenciais estão corretas

### Erro: "Migration failed"
- Execute `npx prisma db push` para forçar sincronização
- Verifique se o schema está compatível

### Erro no Vercel: "Build failed"
- Verifique logs do build no Vercel
- Confirme se DATABASE_URL está nas variáveis de ambiente

## 📊 Benefícios da Migração

- ✅ **Escalabilidade**: Suporte a múltiplos usuários simultâneos
- ✅ **Performance**: Consultas mais rápidas
- ✅ **Confiabilidade**: Backup automático do Railway
- ✅ **Monitoramento**: Métricas em tempo real
- ✅ **Segurança**: Conexão criptografada

## 🎯 Próximos Passos

Após migração bem-sucedida:
1. ✅ Implementar chat em tempo real
2. ✅ Sistema de conquistas
3. ✅ Analytics e monitoramento
4. ✅ Melhorias visuais

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do Railway
2. Confirme variáveis de ambiente
3. Teste conexão local primeiro
4. Abra issue no repositório se necessário