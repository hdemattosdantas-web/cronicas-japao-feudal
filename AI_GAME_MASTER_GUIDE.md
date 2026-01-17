# 🎭 Guia do Mestre IA - Crônicas do Japão Feudal

## Visão Geral

O sistema de IA do Game Master é uma implementação avançada que cria uma experiência de RPG verdadeiramente dinâmica e imersiva. O mestre não é apenas um narrador, mas uma entidade viva com personalidade própria, memória e capacidade de adaptação.

## 🏗️ Arquitetura do Sistema

### 1. **GameMasterEngine** (`lib/game-master/engine.ts`)
Motor principal que coordena todos os aspectos da IA:
- Processa ações dos jogadores
- Gera narrativas inteligentes
- Gerencia encontros com criaturas
- Mantém consistência narrativa

### 2. **Sistema de Personalidades** (`lib/ai/game-master-personality.ts`)
O mestre possui **6 personalidades distintas** que mudam dinamicamente:

#### **Sábio das Montanhas** (Serene)
- Foca em crescimento espiritual
- Usa metáforas da natureza
- Prefere testes de sabedoria

#### **Espírito Trapaceiro** (Playful)
- Adora ironia e reviravoltas
- Recompensa criatividade
- Cria situações inesperadas

#### **Senhor da Guerra Austero** (Harsh)
- Valoriza honra e coragem
- Severo com fraqueza
- Enfatiza caráter moral

#### **Tecelão do Véu** (Mysterious)
- Comunica-se através de enigmas
- Revela verdades gradualmente
- Mantém aura de mistério

#### **Girador do Destino** (Fateful)
- Vê conexões invisíveis
- Oferece escolhas significativas
- Influencia o futuro

#### **Arauto do Caos** (Chaotic)
- Adora perturbar a ordem
- Recompensa adaptabilidade
- Cria eventos imprevisíveis

### 3. **Sistema de Memória** (`lib/ai/game-master-memory.ts`)
Mantém consistência através de:
- **Memória Geral**: Eventos, ações do jogador, consequências
- **Memória de NPCs**: Personalidades, atitudes, relacionamentos
- **Memória de Locais**: Atmosfera, eventos passados, presença sobrenatural

### 4. **Generator de Criaturas** (`lib/ai/creature-generator.ts`)
Cria encontros misteriosos seguindo filosofia específica:
- ❌ Nunca explica diretamente
- ✅ Usa rumores e dúvidas
- ✅ Cria ambiguidade
- ✅ Deixa espaço para interpretação

## 🎯 Como Funciona na Prática

### Processamento de Ações

```typescript
// Quando jogador toma uma decisão
const result = await gameMaster.processPlayerAction(gameState, scene, action, choiceId)

// Sistema executa:
// 1. Adapta personalidade baseada no histórico do jogador
// 2. Consulta memória para contexto narrativo
// 3. Gera narração usando personalidade atual
// 4. Decide se cria encontro com criatura
// 5. Registra evento na memória
```

### Geração de Narrativa Inteligente

O mestre considera:
- **Personalidade atual**: Tom narrativo, biases
- **Memória do mundo**: Eventos passados, contexto
- **Estado do jogador**: Atributos, escolhas recentes
- **Contexto da cena**: Local, hora, clima

### Interações com NPCs

```typescript
const response = await gameMaster.generateNPCResponse(npc, playerAction, context)
// Sistema:
// 1. Consulta memória do NPC
// 2. Atualiza atitude baseada na ação
// 3. Gera resposta consistente com personalidade
// 4. Registra interação na memória
```

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```env
OPENAI_API_KEY=your-openai-api-key-here
```

### Inicialização

```typescript
import { gameMaster } from '@/lib/game-master/engine'

// Sistema inicializa automaticamente com:
// - Personalidade aleatória inicial
// - Memória básica do mundo
// - NPCs e locais importantes
```

## 🎨 Personalização

### Adicionando Novas Personalidades

```typescript
GAME_MASTER_PERSONALITIES['nova_personalidade'] = {
  id: 'nova_personalidade',
  name: 'Nome da Personalidade',
  description: 'Descrição detalhada',
  mood: GameMasterMood.CHAOTIC,
  traits: ['trait1', 'trait2'],
  preferredElements: ['elemento1', 'elemento2'],
  forbiddenElements: ['elemento_proibido'],
  narrativeStyle: 'Descrição do estilo narrativo',
  encounterBias: {
    peaceful: 0.3,
    hostile: 0.2,
    mysterious: 0.4,
    beneficial: 0.1
  }
}
```

### Modificando Bias de Encontros

Cada personalidade tem bias para diferentes tipos de encontros:
- **Peaceful**: Encontros pacíficos, negociações
- **Hostile**: Conflitos, desafios
- **Mysterious**: Criaturas, enigmas
- **Beneficial**: Oportunidades, aliados

## 📊 Monitoramento e Debugging

### Verificando Personalidade Atual

```typescript
const currentPersonality = gameMaster['personalityManager'].getCurrentPersonality()
console.log('Personalidade atual:', currentPersonality.name)
```

### Consultando Memória

```typescript
const memories = gameMaster['memory'].getRelevantMemories(['jogador', playerId])
console.log('Memórias relevantes:', memories)
```

### Logs de Debug

O sistema registra automaticamente:
- Mudanças de personalidade
- Eventos importantes
- Interações com NPCs
- Encontros com criaturas

## 🚀 Recursos Avançados

### Adaptação Dinâmica
O mestre muda de personalidade baseado em:
- Progressão do jogador
- Estilo de jogo (agressivo vs. pacífico)
- Eventos sobrenaturais frequentes

### Consistência Narrativa
- NPCs lembram interações passadas
- Locais acumulam "presença sobrenatural"
- Eventos têm consequências duradouras

### Escalabilidade
- Memória limitada (1000 entradas) para performance
- Cleanup automático de memórias antigas
- Persistência opcional do estado

## 🎭 Filosofia de Design

### Mundo Vivo
O mestre cria a ilusão de que o mundo existe independentemente do jogador, com:
- NPCs com agendas próprias
- Eventos que acontecem mesmo sem intervenção
- Consequências que ecoam através do tempo

### Mistério Sustentado
- Revelações graduais
- Ambiguidade mantida
- Espaço para interpretação do jogador

### Adaptação Orgânica
- Personalidade muda baseada no jogador
- Narrativa evolui com as escolhas
- Mundo responde aos padrões de comportamento

## 🔮 Expansões Futuras

- **Memória Compartilhada**: NPCs compartilham informações
- **Eventos Mundiais**: Eventos que afetam múltiplos jogadores
- **Personalidades Compostas**: Múltiplas personalidades ativas
- **Aprendizado**: Mestre aprende com jogadores experientes

---

*Este sistema cria uma experiência de RPG verdadeiramente única, onde cada sessão é moldada pela interação entre jogador e mestre inteligente.* 🎌✨