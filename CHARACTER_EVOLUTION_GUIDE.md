# 🧬 Sistema de Evolução de Personagem - Crônicas do Japão Feudal

## Visão Geral

O sistema de evolução permite que personagens cresçam organicamente através de encontros com criaturas místicas, desbloqueando novas classes, atributos espirituais e criando laços familiares duradouros.

## 🏗️ Arquitetura do Sistema

### 1. **Atributos Expandidos** (`lib/game/character-evolution.ts`)
```typescript
interface ExpandedAttributes {
  // Atributos físicos
  corpo: number, forca: number, agilidade: number,
  percepcao: number, intelecto: number, vontade: number

  // Atributos espirituais (despertados)
  harmonia_espiritual: number      // Conexão com espíritos
  resistencia_sobrenatural: number // Resistência espiritual
  afinidade_elemental: number      // Controle elemental
  empatia_emocional: number        // Manipulação emocional
  memoria_ancestral: number        // Conhecimento antigo
  adaptabilidade_mistica: number   // Adaptação espiritual

  // Atributos especializados (por classe)
  furtividade_sombria?: number     // Guardião dos Impostores
  clarividencia?: number           // Viajante entre Mundos
  voracidade_controlada?: number   // Devorador de Almas
  // ... e mais
}
```

### 2. **Classes e Evolução**
- **11 Classes Iniciais**: Camponês, Ferreiro, Lenheiro, etc.
- **8 Classes Evoluídas**: Baseadas em tipos de criaturas
- **Sistema de Maestria**: Cada classe tem nível de proficiência

### 3. **Sistema Familiar** (`lib/game/family-system.ts`)
- **Casamento**: Propostas, dotes, condições especiais
- **Geração de Filhos**: Herança genética e espiritual
- **Linhagens**: Traços familiares transmitidos
- **Famílias**: Riqueza, influência, territórios

## 🎯 Como Funciona a Evolução

### **Encontros com Criaturas**

Cada tipo de criatura concede **atributos específicos**:

```
Substitutos → Furtividade Sombria, Adaptabilidade Mística
Entidades de Contato → Clarividência, Adaptabilidade Mística
Ghouls → Voracidade Controlada, Resistência Sobrenatural
Yōkai Tradicionais → Diplomacia Espiritual, Harmonia Espiritual
Yūrei → Empatia Pós-Vida, Memória Ancestral
Mononoke → Harmonização Emocional, Empatia Emocional
Kami Menores → Comunhão Natural, Afinidade Elemental
Tsukumogami → Preservação Temporal, Memória Ancestral
```

### **Desbloqueio de Classes**

Após **X encontros bem-sucedidos**, novas classes são desbloqueadas:

```typescript
const classUnlocks = {
  [CreatureType.SUBSTITUTOS]: {
    class: CharacterClass.GUARDIAO_DOS_IMPOSTORES,
    requiredEncounters: 3
  },
  [CreatureType.ENTIDADES_CONTATO]: {
    class: CharacterClass.VIAJANTE_ENTRE_MUNDOS,
    requiredEncounters: 5
  },
  // ... outros tipos
}
```

### **Pontos de Evolução**

- **Encontros Bem-Sucedidos**: +10 pontos
- **Encontros Fracassados**: +5 pontos
- **Usados para**: Melhorias especiais, evolução forçada

## 👨‍👩‍👧‍👦 Sistema Familiar

### **Casamento**
```typescript
// Proposta de casamento
const proposal = familySystem.proposeMarriage(
  proposerId, targetId, dowry, conditions
)

// Aceitar proposta
const family = familySystem.acceptMarriage(proposalId)
```

### **Geração de Filhos**
```typescript
const child = familySystem.generateChild(
  parent1, parent2, childName, birthLocation
)

// Calcular herança
const inheritance = familySystem.calculateChildInheritance(
  child, [parent1, parent2], family
)
```

### **Herança Genética**

**Física**: Média dos pais + variação genética
```
Força dos Pais: 12 + 8 = 20 ÷ 2 = 10 ± variação
Resultado: 8-12 (variação natural)
```

**Espiritual**: Herança de afinidades especiais
```
Pai: Harmonia Espiritual (Monge)
Mãe: Afinidade Elemental (Druida)
Filho: Pode herdar ambas ou uma variação
```

## 🎮 Interface do Jogador

### **Painel de Evolução** (`📈 Evolução`)
- **Status Atual**: Classe, despertar espiritual, pontos
- **Classes Disponíveis**: Lista com maestria
- **Histórico**: Eventos de evolução
- **Encontros**: Estatísticas por tipo de criatura
- **Atributos Totais**: Incluindo bônus

### **Sistema Familiar** (`👨‍👩‍👧‍👦 Família`)
- **Membros**: Lista da família
- **Relações**: Pais, filhos, cônjuges
- **Casamento**: Propostas e negociações
- **Filhos**: Geração e herança

## 🔄 Processo de Evolução

### **1. Encontro Inicial**
```
Jogador encontra criatura → Resolve conflito
Sucesso: +10 pontos, aprendizado, possível poder
Fracasso: +5 pontos, aprendizado menor
```

### **2. Acúmulo de Experiência**
```
3 encontros com Substitutos → Desbloqueia "Guardião dos Impostores"
5 encontros com Entidades → Desbloqueia "Viajante entre Mundos"
```

### **3. Mudança de Classe**
```
Selecionar nova classe → Bônus de atributos específicos
Exemplo: Guardião dos Impostores
→ +3 Furtividade Sombria, +2 Adaptabilidade Mística
```

### **4. Crescimento Contínuo**
```
Cada encontro adiciona atributos específicos
Classes evoluídas têm bônus maiores
Herança familiar passa poderes para filhos
```

## 🎨 Classes Disponíveis

### **Classes Iniciais** (Bônus menores, amplo acesso)
- **Camponês**: +1 Corpo, +1 Força
- **Ferreiro**: +2 Força, +1 Percepção
- **Monge Budista**: +2 Vontade, +1 Harmonia Espiritual

### **Classes Evoluídas** (Bônus espirituais especializados)
- **Guardião dos Impostores**: Especialista em detecção de falsidades
- **Viajante entre Mundos**: Mestre da clarividência e adaptação
- **Devorador de Almas**: Controla a fome espiritual
- **Mediador Espiritual**: Diplomata entre reinos
- **Guia dos Perdidos**: Conecta vivos e mortos
- **Harmonizador de Emoções**: Mestre do equilíbrio emocional
- **Protetor da Natureza**: Guardião dos espíritos naturais
- **Guardião dos Antigos**: Preserva conhecimento temporal

## 👶 Sistema de Reprodução

### **Casamento**
- **Propostas**: Com dote e condições
- **Negociação**: Família pode aceitar/recusar
- **Consequências**: Alianças, fusões familiares

### **Filhos**
- **Herança Física**: Média parental + genética
- **Herança Espiritual**: Afinidades e poderes
- **Traços Únicos**: Possibilidade de mutações especiais
- **Aptidões**: Classes que o filho pode aprender facilmente

### **Linhagens Familiares**
- **Poderes Sanguíneos**: Habilidades especiais herdadas
- **Riqueza**: Acúmulo de recursos familiares
- **Influência**: Poder político e social
- **Territórios**: Terras controladas pela família

## 📊 Estatísticas e Balanceamento

### **Dificuldade de Desbloqueio**
```
Fácil (3 encontros): Substitutos, Yūrei
Médio (4 encontros): Ghouls, Mononoke, Tsukumogami
Difícil (5 encontros): Entidades, Kami Menores
Muito Difícil (6 encontros): Yōkai Tradicionais
```

### **Poderes por Classe**
```
Guardião dos Impostores: Melhor contra ilusões e falsidades
Viajante entre Mundos: Melhor contra anomalias espaciais
Devorador de Almas: Melhor contra entidades carnais
etc.
```

## 🚀 Expansões Futuras

### **Recursos Planejados**
- **Casamentos Arranged**: Contratos familiares complexos
- **Heranças Especiais**: Poderes únicos por combinação parental
- **Eventos Familiares**: Casamentos, funerais, celebrações
- **Rivalidades**: Conflitos entre famílias
- **Legados**: Itens e conhecimentos passados por gerações

### **Balanceamento**
- **Apenas Encontros Significativos**: Não todo encontro conta
- **Custo de Mudança**: Penalidade ao trocar classe frequentemente
- **Limitações Familiares**: Restrições em casamento por status

---

**O sistema cria personagens verdadeiramente únicos, moldados pelas experiências espirituais e conexões familiares, tornando cada jornada profundamente pessoal e significativa!** 🌟🧬👪