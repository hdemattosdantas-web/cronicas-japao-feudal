# 📧 Guia: Configuração de Email para Crônicas do Japão Feudal

## 🎯 Email Principal: `cronicasdojapaofeudal@gmail.com`

## 🔧 Configurações Necessárias

### **Opção 1: Usar Gmail (Recomendado)**

#### **1. Configurar Gmail App Password:**
```bash
# No Gmail:
1. Ir em "Gerenciar sua Conta Google"
2. Segurança → Verificação em 2 etapas → Ativar
3. Senhas de app → Gerar senha para "Crônicas Japão Feudal"
4. Usar a senha gerada (16 caracteres)
```

#### **2. Variáveis de Ambiente (.env.local):**
```env
# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=cronicasdojapaofeudal@gmail.com
EMAIL_SERVER_PASSWORD=SUA_SENHA_DE_APP_GMAIL
EMAIL_FROM=Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>

# Ou usando Resend (mais profissional)
RESEND_API_KEY=sua_chave_api_resend
```

#### **3. Configurar no Vercel (Produção):**
```env
# Dashboard Vercel → Project Settings → Environment Variables
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=cronicasdojapaofeudal@gmail.com
EMAIL_SERVER_PASSWORD=SUA_SENHA_DE_APP_GMAIL
EMAIL_FROM=Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>
```

### **Opção 2: Usar Resend (Mais Profissional)**

#### **1. Criar conta no Resend:**
- Acesse: https://resend.com
- Cadastre-se e verifique seu domínio

#### **2. Configurar domínio:**
```bash
# Adicionar domínio: cronicas-japao-feudal.com (opcional)
# Ou usar domínio gratuito do Resend
```

#### **3. Obter API Key:**
```bash
# Dashboard Resend → API Keys → Create API Key
# Nome: "Crônicas Japão Feudal"
```

#### **4. Variáveis de Ambiente:**
```env
# Resend Configuration
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXX
EMAIL_FROM=Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>
```

## 📧 Templates de Email Configurados

### **1. Email de Verificação de Registro:**
```html
🏯 Bem-vindo às Crônicas do Japão Feudal!
📧 Confirme seu email para começar sua jornada
🔗 Link de verificação válido por 24h
```

### **2. Email de Link Mágico:**
```html
🏯 Crônicas do Japão Feudal
📧 Link mágico para entrar no jogo
🔗 Clique para entrar automaticamente
```

### **3. Email de Recuperação (Futuro):**
```html
🏯 Recuperação de Conta
🔒 Link seguro para redefinir senha
⏰ Válido por 1 hora
```

## 🧪 Teste de Configuração

### **1. Teste Local:**
```bash
# Iniciar aplicação
npm run dev

# Testar registro
# Acesse: http://localhost:3000/auth/register
# Criar conta → Verificar email
```

### **2. Verificar Logs:**
```bash
# Verificar console para erros de email
# Gmail: Verificar "Enviados" e "Spam"
# Resend: Dashboard → Emails → Ver estatísticas
```

## 🚨 Possíveis Problemas

### **Gmail Issues:**
- **Erro 535**: Senha incorreta → Usar App Password
- **Erro 534**: Verificação 2FA obrigatória
- **Spam**: Adicionar à lista de contatos

### **Resend Issues:**
- **Erro 401**: API Key inválida
- **Erro 429**: Limite excedido (100 emails/dia free)
- **Domínio**: Configurar SPF/DKIM para melhor entrega

## 📊 Monitoramento

### **Métricas Importantes:**
- **Taxa de Entrega**: 95%+ esperado
- **Taxa de Abertura**: 60%+ esperado
- **Taxa de Cliques**: 30%+ esperado
- **Reclamações de Spam**: < 0.1%

### **Ferramentas:**
- **Gmail**: Verificar "Todos os emails" e "Spam"
- **Resend Dashboard**: Métricas em tempo real
- **Vercel Logs**: Verificar erros de envio

## 🔄 Próximos Passos

### **Após Configuração:**
1. ✅ **Testar registro** - Criar conta de teste
2. ✅ **Verificar email** - Confirmar recebimento
3. ✅ **Testar login** - Ambos os métodos
4. ✅ **Deploy produção** - Configurar variáveis no Vercel
5. ✅ **Monitorar** - Acompanhar métricas

### **Melhorias Futuras:**
- 📊 **Analytics de email** - Taxas de conversão
- 🎨 **Templates customizados** - Mais bonitos
- 📱 **Email responsivo** - Mobile-friendly
- 🔄 **Reenvio automático** - Para emails não entregues

---

## 🎯 Checklist Final

- [ ] Conta Gmail configurada com App Password
- [ ] Variáveis de ambiente configuradas localmente
- [ ] Teste de registro realizado com sucesso
- [ ] Email de verificação recebido
- [ ] Link de verificação funcional
- [ ] Variáveis configuradas no Vercel
- [ ] Teste em produção realizado

---

## 📞 Suporte

**Email configurado:** `cronicasdojapaofeudal@gmail.com`

**Para problemas:**
1. Verificar logs do Vercel
2. Testar com conta Gmail alternativa
3. Considerar migração para Resend
4. Verificar limites de envio

---

**🎊 Email profissional configurado e pronto para uso!**

**🏯 Os aventureiros podem se registrar e receber emails temáticos do Japão feudal! ✨**