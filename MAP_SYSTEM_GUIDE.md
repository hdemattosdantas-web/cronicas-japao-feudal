# 🗺️ Sistema de Mapa - Crônicas do Japão Feudal

## Visão Geral

O sistema de mapa implementado permite aos jogadores visualizar e interagir com um mapa interativo do Japão feudal, mostrando posições de jogadores em tempo real, locais importantes e conexões entre regiões.

## 🏗️ Arquitetura

### 1. **Sistema de Coordenadas** (`lib/game/map-coordinates.ts`)
- **MapLocation**: Define locais no mapa com coordenadas, tipo, conexões
- **PlayerPosition**: Rastreia posição, status e localização de jogadores
- **MapManager**: Gerencia posições, caminhos e estatísticas da área

### 2. **Componente Visual** (`app/components/GameMap.tsx`)
- **SVG Interativo**: Renderiza mapa usando SVG para escalabilidade
- **Controles de Zoom/Pan**: Navegação fluida pelo mapa
- **Marcadores de Jogadores**: Mostra posição e status de todos os jogadores
- **Tooltips Informativos**: Detalhes sobre locais e jogadores

### 3. **Broadcasting em Tempo Real** (`lib/websockets/socket-server.ts`)
- **Atualizações Live**: Posições atualizadas instantaneamente
- **Eventos de Movimento**: Jogadores podem atualizar sua posição
- **Status Online**: Indicadores visuais de conectividade

## 🎯 Funcionalidades Implementadas

### Mapa Interativo
- **Zoom**: 0.5x a 3x com controles deslizantes
- **Pan**: Arrastar para navegar pelo mapa
- **Seleção de Locais**: Clique para ver informações detalhadas
- **Visualização de Jogadores**: Marcadores coloridos com status

### Posicionamento em Tempo Real
- **Rastreamento Automático**: Sistema registra posição dos jogadores
- **Atualizações Live**: Mudanças de posição broadcastadas instantaneamente
- **Status Visuais**: Cores diferentes para diferentes estados (explorando, combatendo, etc.)
- **Grupos**: Suporte para mostrar membros de grupos/parties

### Locais do Japão Feudal
```
Províncias Iniciais:
├── Owari (Centro)
│   ├── Aldeia de Owari (Ponto de início)
│   ├── Castelo de Owari (Fortaleza principal)
│   └── Kiyosu (Cidade comercial)
├── Kai (Montanhosa)
│   ├── Aldeia de Kai (Região rural)
│   ├── Castelo de Kai (Fortaleza montanhosa)
│   ├── Fuji (Montanha sagrada)
│   └── Floresta Misteriosa (Área perigosa)
```

## 🎮 Como Usar no Jogo

### Para Jogadores
1. **Abrir Mapa**: Clique no botão "🗺️ Mostrar Mapa"
2. **Navegar**: Use zoom e pan para explorar
3. **Ver Jogadores**: Marcadores coloridos mostram outros jogadores
4. **Interagir**: Clique em jogadores para ver informações
5. **Selecionar Locais**: Clique em locais para ver detalhes

### Controles do Mapa
```
Zoom: Botões + e - ou scroll do mouse
Pan: Arraste com mouse ou botões direcionais
Seleção: Clique esquerdo em locais/jogadores
Fechar: Botão X ou ESC
```

## 🔧 Sistema Técnico

### Eventos Socket.IO
```typescript
// Entrada na sala
'join-room' → Inicializa posição do jogador

// Atualização de posição
'update-position' → Move jogador no mapa

// Solicitação de posições
'request-positions' → Atualiza lista de jogadores

// Broadcasts automáticos
'players-positions-update' → Lista completa de posições
'player-position-update' → Atualização individual
```

### Estrutura de Dados
```typescript
interface PlayerPosition {
  playerId: string
  characterId: string
  userName: string
  locationId: string
  coordinates: { x: number, y: number }
  isOnline: boolean
  lastSeen: string
  status: 'traveling' | 'resting' | 'exploring' | 'in_combat' | 'socializing'
}
```

## 🎨 Interface Visual

### Cores e Marcadores
- **Você**: Verde brilhante (🟢)
- **Outros Jogadores**: Azul (🔵)
- **Em Combate**: Vermelho com borda branca (🔴)
- **Locais**: Cores baseadas no tipo
  - Vilarejos: Marrom
  - Cidades: Dourado
  - Castelos: Roxo
  - Templos: Vermelho
  - Florestas: Verde
  - Montanhas: Cinza

### Legenda Integrada
- Controles sempre visíveis no canto superior esquerdo
- Legenda de cores no canto superior direito
- Informações de local selecionado na parte inferior esquerda
- Tooltips de jogadores ao passar o mouse

## 🚀 Expansões Futuras

### Funcionalidades Planejadas
- **Viagem Automática**: Clicar em local para viajar
- **Grupos/Parties**: Formar grupos e ver membros no mapa
- **Eventos no Mapa**: Mostrar ocorrências sobrenaturais
- **Mini-Mapa**: Versão reduzida sempre visível
- **Filtros**: Mostrar/ocultar diferentes tipos de marcadores

### Melhorias Técnicas
- **Clusters**: Agrupar jogadores próximos em um marcador
- **Roteamento**: Calcular caminhos entre locais
- **Áreas Dinâmicas**: Regiões que mudam com eventos da história
- **Fog of War**: Áreas não exploradas ficam ocultas

## 📊 Performance

### Otimizações Implementadas
- **Lazy Loading**: Apenas elementos visíveis são renderizados
- **WebSocket Efficiente**: Atualizações delta ao invés de full refresh
- **SVG Scalable**: Performance consistente independente do zoom
- **Memory Management**: Limpeza automática de posições antigas

### Limites Atuais
- Máximo 1000 posições em memória
- 20 jogadores visíveis por área (50 unidades de raio)
- Update rate: 100ms para posições, 1s para status

---

*O sistema de mapa cria uma experiência imersiva onde jogadores podem ver e interagir com o mundo compartilhado em tempo real, fortalecendo o senso de comunidade e aventura coletiva.* 🌏⚔️