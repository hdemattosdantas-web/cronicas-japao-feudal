# 🏯 Múltiplos Personagens & Sistema de Viagem - Crônicas do Japão Feudal

## Visão Geral

Implementado sistema completo de múltiplos personagens por usuário e viagem narrativa entre os diversos locais do Japão feudal.

## 🎭 Sistema de Múltiplos Personagens

### **Funcionalidades Implementadas**
- ✅ **Múltiplos Personagens**: Usuários podem criar e gerenciar vários personagens
- ✅ **Seleção Ativa**: Escolher qual personagem jogar
- ✅ **Progresso Independente**: Cada personagem tem sua própria evolução
- ✅ **Interface Atualizada**: Página de personagens mostra lista completa

### **Interface Atualizada** (`app/characters/page.tsx`)
```typescript
// Mostra todos os personagens do usuário
interface Character {
  id: string
  name: string
  age: number
  origin: string
  profession: string
  lore: string
  attributes: any
  createdAt: string
  currentLocation?: string  // Novo: localização atual
  evolutionLevel?: number   // Novo: nível de evolução
  familyName?: string       // Novo: família do personagem
}
```

### **Funcionalidades Visuais**
- **Cards Expandidos**: Mostra atributos, localização, nível de evolução
- **Status Familiar**: Família à qual pertence
- **Emojis por Classe**: Identificação visual rápida
- **Informações Detalhadas**: Lore, criação, estatísticas

## 🗺️ Estrutura Geográfica Expandida

### **Níveis de Localização**

#### **🌏 Nível 1 - PROVÍNCIAS**
```
Owari     - Centro inicial, fértil e estratégico
Kai       - Montanhosa, lar dos guerreiros Takeda
Shinano   - Alta montanha, rotas comerciais do norte
Mino      - Estratégica, controle de rios importantes
Musashi   - Densamente povoada, lar de Edo (Tóquio)
Echigo    - Cultural, artes e arquitetura refinada
```

#### **🏯 Nível 2 - CIDADES IMPORTANTES**
```
Região Central/Inicial:
├── Nagoya (Owari) - Centro comercial movimentado
├── Kōfu (Kai) - Cidade fortificada nas montanhas
├── Matsumoto (Shinano) - Centro administrativo montanhês
├── Gifu (Mino) - Cidade estratégica fluvial
├── Kyoto - Capital imperial antiga
└── Osaka - Centro comercial poderoso

Grandes Polos:
├── Edo (Tóquio) - Capital shogunal emergente
└── Kanazawa (Echigo) - Centro cultural refinado
```

#### **🌾 Nível 3 - VILAS, TEMPLOS E POSTOS**
```
Vilas Agrícolas:
├── Vila do Arroz de Owari - Especializada em arroz
├── Vila Pesqueira de Owari - Lar de pescadores
└── Vila da Montanha de Kai - Caçadores e lenhadores

Templos e Santuários:
├── Templo da Montanha Sagrada (Owari)
├── Templo do Fuji (Kai) - Presença espiritual alta
└── Templos isolados nas montanhas

Postos de Estrada:
├── Postos da Nakasendō - Rota central histórica
└── Postos de descanso nas montanhas
```

### **Características por Província**
```typescript
// Cultura, clima, trabalho, ameaças sobrenaturais
const provinceTraits = {
  owari: {
    culture: 'Guerreira e comercial',
    climate: 'Temperado, chuvas frequentes',
    work: 'Agricultura, comércio, artesanato',
    supernatural: 'Kami locais, espíritos fluviais'
  },
  kai: {
    culture: 'Montanhesa e guerreira',
    climate: 'Frio, nevado no inverno',
    work: 'Caça, mineração, guerra',
    supernatural: 'Yōkai das montanhas, tengu'
  }
  // ... outras províncias
}
```

## 🧳 Sistema de Viagem Narrativa

### **Funcionalidades Core**
- ✅ **Viagem Narrativa**: Não mapa interativo, mas narração descritiva
- ✅ **Eventos Durante Jornada**: Bandidos, clima, descobertas
- ✅ **Múltiplos Métodos**: A pé, cavalo, carruagem, barco
- ✅ **Sistema de Suprimentos**: Comida, água, medicina
- ✅ **Fadiga e Saúde**: Consequências da viagem

### **Arquitetura do Sistema** (`lib/game/travel-system.ts`)
```typescript
interface TravelRoute {
  from: string
  to: string
  distance: number
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
  terrain: 'road' | 'mountain' | 'forest' | 'river' | 'coastal'
  typicalDuration: {
    walking: number
    horse: number
    cart: number
    boat?: number
  }
  waypoints: string[]
  dangers: string[]
  landmarks: string[]
}

interface ActiveTravel {
  characterId: string
  fromLocation: string
  toLocation: string
  currentPosition: number // 0-100%
  method: TravelMethod
  condition: TravelCondition
  daysElapsed: number
  totalDays: number
  fatigue: number
  supplies: { food: number, water: number, medicine: number }
}
```

### **Métodos de Viagem**
```typescript
enum TravelMethod {
  WALKING = 'walking',  // 🚶 Lento, stealth
  HORSE = 'horse',      // 🐎 Rápido, caro
  CART = 'cart',        // 🚜 Confortável, lento
  BOAT = 'boat'         // 🚢 Rápido na água
}
```

### **Condições que Afetam Viagem**
```typescript
enum TravelCondition {
  CLEAR = 'clear',  // Tempo bom
  RAIN = 'rain',    // -30% velocidade
  SNOW = 'snow',    // -50% velocidade
  STORM = 'storm',  // -70% velocidade
  FOG = 'fog'       // -20% velocidade
}
```

## 🎮 Interface de Viagem

### **Botão de Viagem**
```
🧳 Viajar  → Abre modal de seleção de destino
🧳 Viajando... → Mostra progresso quando em viagem
📅 Avançar Dia → Botão para progredir jornada
```

### **Modal de Destinos**
```typescript
// Mostra local atual
📍 Vila de Owari - Província de Owari

// Seleção de método
🚶 A Pé | 🐎 A Cavalo | 🚜 Carruagem | 🚢 Barco

// Lista de destinos
├── Nagoya (2 dias a pé) - Cidade comercial
├── Gifu (3 dias a pé) - Cidade estratégica
└── Kyoto (8 dias a pé) - Capital antiga
```

### **Durante a Viagem**
```
Chat mostra progresso narrativo:
"🧳 Iniciando viagem de Owari até Nagoya (2 dias)"
"🧳 Dia 1: A estrada está tranquila hoje..."
"🧳 Evento: Encontram um viajante ferido na estrada"
"✅ Chegada a Nagoya!"
```

## 📊 Eventos de Viagem

### **Tipos de Eventos**
```typescript
enum EventType {
  WEATHER = 'weather',    // Clima afeta jornada
  ENCOUNTER = 'encounter', // Bandidos, NPCs, criaturas
  FATIGUE = 'fatigue',    // Cansaço do grupo
  DISCOVERY = 'discovery', // Descobertas especiais
  REST = 'rest'           // Oportunidades de descanso
}
```

### **Exemplos de Eventos**
```
Clima: "Chuva forte torna o caminho lamacento"
Encontro: "Grupo de bandidos bloqueia a estrada"
Descoberta: "Clareira escondida com flores luminosas"
Fadiga: "O grupo está exausto e precisa descansar"
```

### **Escolhas nos Eventos**
```typescript
interface TravelEvent {
  title: string
  description: string
  choices: Array<{
    text: string
    consequences: {
      timeCost: number        // Dias extras
      healthCost?: number     // Dano à saúde
      resourceCost?: object   // Consumo de recursos
      rewards?: object        // Recompensas
    }
  }>
}
```

## 🏛️ Sistema Familiar Integrado

### **Integração com Viagem**
- ✅ **Herança Geográfica**: Personagens podem herdar conexões familiares
- ✅ **Territórios Familiares**: Famílias controlam regiões específicas
- ✅ **Viagens Familiares**: Visitar parentes em outras províncias

### **Família e Localização**
```typescript
interface Family {
  territories: string[]     // IDs de locais controlados
  influence: number         // Poder político na região
  reputation: number        // Reputação local
  // ... outros campos
}
```

## 🎯 Experiência do Jogador

### **Fluxo Completo**
1. **Criar Múltiplos Personagens**: Diferentes classes e origens
2. **Escolher Personagem Ativo**: Selecionar qual jogar
3. **Explorar Local Atual**: Interagir com cidade/vila atual
4. **Planejar Viagem**: Escolher destino e método
5. **Viajar Narrativamente**: Eventos durante jornada
6. **Chegar ao Destino**: Novas oportunidades e aventuras

### **Exemplo de Sessão**
```
1. Jogador tem 3 personagens: Samurái (Kyoto), Mercador (Osaka), Monge (montanhas)
2. Escolhe jogar com o Mercador em Osaka
3. Decide viajar para Edo (Tóquio) de barco
4. Durante viagem: tempestade no mar, contrabandistas, descoberta de ilha misteriosa
5. Chega a Edo após 3 dias com novas histórias
6. Troca para personagem Samurái e viaja para Kyoto a cavalo
```

## 🚀 Expansões Futuras

### **Possíveis Melhorias**
- **Viagens Grupais**: Múltiplos personagens viajam juntos
- **Rotas Dinâmicas**: Descobrir novas rotas através de exploração
- **Estações do Ano**: Viagens afetadas pelas estações
- **Eventos Mundiais**: Guerras ou desastres afetam viagens
- **Personagens de Suporte**: NPCs que acompanham em viagens

---

**O sistema agora oferece uma experiência verdadeiramente épica: múltiplos personagens explorando um Japão feudal vasto e perigoso através de jornadas narrativas cheias de eventos e descobertas!** 🌟🗺️⚔️