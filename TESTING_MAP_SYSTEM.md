# 🧪 Testando o Sistema de Mapa e Broadcasting

## Pré-requisitos

1. **Servidor Rodando**:
   ```bash
   npm run dev
   # ou
   node server.js
   ```

2. **Múltiplas Janelas/Abas**:
   - Abra várias abas do navegador
   - Ou use janelas do navegador diferentes
   - Cada uma representará um jogador diferente

## 🧪 Cenários de Teste

### 1. **Teste Básico de Conexão**
```
✅ Abrir mapa em uma aba
✅ Ver marcador verde (você mesmo)
✅ Ver informações do local atual
```

### 2. **Teste de Múltiplos Jogadores**
```
✅ Abrir segunda aba e entrar no mesmo jogo
✅ Ver dois marcadores no mapa (verde + azul)
✅ Ver nomes dos jogadores
✅ Status online funcionando
```

### 3. **Teste de Interação**
```
✅ Clicar em outro jogador → tooltip com informações
✅ Clicar em local → painel de informações detalhadas
✅ Usar controles de zoom e pan
✅ Mensagens aparecem no chat quando jogadores entram/saem
```

### 4. **Teste de Atualização em Tempo Real**
```
✅ Mover entre abas
✅ Ver marcadores atualizarem posições
✅ Status mudarem dinamicamente
✅ Chat sincronizado entre jogadores
```

## 🔧 Troubleshooting

### Problemas Comuns

**1. Mapa não aparece:**
```
❌ Verificar se clicou "Mostrar Mapa"
❌ Verificar console do navegador por erros
❌ Verificar se Socket.IO está conectado
```

**2. Jogadores não aparecem:**
```
❌ Verificar se estão na mesma sala
❌ Verificar conexão WebSocket
❌ Verificar se roomId é o mesmo
```

**3. Atualizações não funcionam:**
```
❌ Verificar se servidor está rodando na porta correta
❌ Verificar NEXTAUTH_URL no .env
❌ Verificar logs do servidor
```

### Logs Úteis

**Cliente (Browser Console):**
```javascript
// Verificar conexão Socket.IO
console.log('Socket connected:', socket.connected)

// Verificar posições recebidas
console.log('Players positions:', playersPositions)
```

**Servidor (Terminal):**
```bash
# Logs aparecerão automaticamente:
🟢 Jogador conectado: [socketId]
🎮 Jogador [id] entrou na sala [roomId]
📍 Jogador [id] moveu para [location]
```

## 🎯 Funcionalidades para Testar

### Mapa Interativo
- [ ] Zoom in/out funcionando
- [ ] Pan (arrastar) funcionando
- [ ] Seleção de locais
- [ ] Informações de locais aparecem
- [ ] Controles visíveis e funcionais

### Jogadores em Tempo Real
- [ ] Múltiplos jogadores aparecem
- [ ] Cores corretas (verde para você, azul para outros)
- [ ] Status atualizam (online/offline)
- [ ] Tooltips ao passar mouse
- [ ] Cliques funcionam

### Broadcasting
- [ ] Entrada/saída de jogadores notificadas
- [ ] Posições sincronizadas
- [ ] Chat funcionando entre jogadores
- [ ] Ações do jogo aparecem para todos

## 🚀 Teste Avançado

### Cenário: Sessão Completa
1. **Jogador A** entra primeiro
2. **Jogador B** entra na mesma sala
3. Ambos abrem o mapa
4. Verificam marcadores mutuamente
5. Um jogador executa uma ação no jogo
6. Verificam se a narração aparece para ambos
7. Um jogador sai
8. Verificam se o marcador desaparece

### Performance
- Testar com 5+ jogadores simultâneos
- Verificar latência de atualizações
- Testar zoom em diferentes níveis
- Verificar consumo de memória

## 📊 Métricas de Sucesso

```
✅ Todos os jogadores aparecem no mapa
✅ Atualizações em tempo real < 500ms
✅ Interface responsiva e fluida
✅ Sem erros no console
✅ Funciona em diferentes navegadores
✅ Chat sincronizado perfeitamente
```

---

**Se tudo funcionar corretamente, você terá um sistema de mapa multiplayer totalmente funcional com broadcasting em tempo real!** 🎉🗺️