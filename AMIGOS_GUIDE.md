# 👥 Sistema de Amigos - Guia Completo

## 🎯 Visão Geral

O sistema de amigos permite que jogadores se conectem, vejam quem está online e convidem amigos para jogar juntos no Japão feudal.

## 📱 Funcionalidades Principais

### ✅ **Adicionar Amigos**
- Busca por email
- Envio de pedidos de amizade
- Aceitação/rejeição de pedidos

### ✅ **Status Online**
- Indicador visual (🟢 Online / ⚫ Offline)
- Atualização automática a cada 30 segundos
- Lista de amigos online

### ✅ **Convites para Salas**
- Convidar amigos para salas multiplayer
- Sistema de notificações
- Link direto para salas

## 🚀 Como Usar

### 1. **Acessar Sistema de Amigos**
```
http://localhost:4000/friends
```
*Ou clique em "👥 Amigos" no cabeçalho*

### 2. **Encontrar Novos Amigos**
- Clique na aba **"Encontrar Amigos"**
- Digite o email do amigo
- Clique em **"🔍 Buscar"**
- Clique em **"➕ Adicionar Amigo"**

### 3. **Gerenciar Pedidos**
- Vá para a aba **"Pedidos"**
- **✅ Aceitar** ou **❌ Recusar** pedidos pendentes
- Notificações automáticas

### 4. **Ver Lista de Amigos**
- Aba **"Meus Amigos"** (padrão)
- Status online/offline em tempo real
- Botão **"🔄 Atualizar Status"**

### 5. **Convidar para Jogar**
- Clique em **"🏰 Convidar p/ Sala"** (só para amigos online)
- Ou use o botão **"👥 Convidar"** nas salas
- Sistema redireciona para página de amigos com convite pendente

## 🎮 Fluxo Completo de Multiplayer

```
Usuário A                    Usuário B
   │                            │
   ├── Cria sala ──────────────┐│
   │                           ││
   ├── Convida amigo ─────────┼┼─ Recebe convite
   │                           ││
   ├── Entra na sala ─────────┼┼─ Aceita convite
   │                           ││
   └── Jogam juntos ──────────┼┼─ Jogam juntos
                              ││
```

## 🔧 APIs Disponíveis

### **GET /api/friends**
Lista todos os amigos do usuário autenticado

### **POST /api/friends**
Envia pedido de amizade
```json
{
  "friendEmail": "amigo@email.com"
}
```

### **GET /api/friends/requests**
Lista pedidos de amizade pendentes

### **PUT /api/friends/requests**
Aceita ou recusa pedido
```json
{
  "requestId": "id-do-pedido",
  "action": "accept" | "decline"
}
```

### **GET /api/users?friends=true**
Lista amigos online

### **GET /api/users?search=email**
Busca usuários por email

## 💾 Estrutura de Dados

### **Amizades** (`data/friends.json`)
```json
[
  {
    "id": "friend_123",
    "userId": "user_a",
    "friendId": "user_b",
    "friendEmail": "amigo@email.com",
    "friendName": "Nome do Amigo",
    "addedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### **Pedidos** (`data/friend-requests.json`)
```json
[
  {
    "id": "request_123",
    "fromUserId": "user_a",
    "fromUserEmail": "meu@email.com",
    "fromUserName": "Meu Nome",
    "toUserId": "user_b",
    "toUserEmail": "amigo@email.com",
    "toUserName": "Nome do Amigo",
    "status": "pending|accepted|declined",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### **Status Online** (`data/users-status.json`)
```json
[
  {
    "userId": "user_123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00.000Z",
    "currentRoom": "vila-misteriosa"
  }
]
```

## 🎨 Interface do Usuário

### **Abas Principais**
- **👥 Meus Amigos**: Lista completa com status
- **📨 Pedidos**: Gerenciar convites pendentes
- **🔍 Encontrar Amigos**: Buscar e adicionar

### **Indicadores Visuais**
- 🟢 **Verde**: Amigo online
- ⚫ **Cinza**: Amigo offline
- 🔄 **Botão refresh**: Atualizar status
- 🏰 **Convidar**: Só disponível para online

### **Notificações**
- Convites pendentes destacados
- Mensagens de confirmação
- Alertas de erro

## 🔒 Segurança

- Apenas usuários autenticados podem usar
- Validação de emails
- Proteção contra self-add
- Verificação de amizades existentes

## 🚀 Próximas Melhorias

### **Funcionalidades Planejadas**
- [ ] Mensagens privadas entre amigos
- [ ] Grupos de amigos
- [ ] Sistema de reputação
- [ ] Notificações push
- [ ] Bloqueio de usuários

### **Melhorias Técnicas**
- [ ] Cache de status online (Redis)
- [ ] WebSockets para notificações em tempo real
- [ ] Sistema de presença avançado
- [ ] API de matchmaking

## 🐛 Troubleshooting

### **Problema: Não consegue adicionar amigo**
- ✅ Verificar se email existe
- ✅ Verificar se já são amigos
- ✅ Verificar se já existe pedido pendente

### **Problema: Status online não atualiza**
- ✅ Aguardar 30 segundos (atualização automática)
- ✅ Clicar em "🔄 Atualizar Status"
- ✅ Verificar conexão WebSocket

### **Problema: Convite não funciona**
- ✅ Verificar se amigo está online
- ✅ Verificar se sala existe
- ✅ Tentar novamente

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar console do navegador (F12)
2. Verificar logs do servidor
3. Testar com outro navegador
4. Limpar cache e cookies

---

**🎮 Sistema totalmente funcional! Teste adicionando amigos e jogando multiplayer!** 🚀