# 📜 Manifesto do Mundo & Onboarding - Mesa Feudal

## 🎭 Visão Geral

Implementado o **Manifesto do Mundo** como base conceitual do jogo e **Onboarding** como primeira experiência do jogador.

## 📖 Manifesto do Mundo

### **Princípios Core**

#### **O Mundo Não Gira em Torno do Jogador**
```
As estradas existiam antes dele.
As vilas sobreviverão depois.
As criaturas não surgem porque alguém está pronto.

O sobrenatural não é um espetáculo — é uma consequência.
```

#### **A Condição Humana**
```
Pessoas vivem, envelhecem, adoecem, se casam, têm filhos e morrem.
Algumas vivem tempo suficiente para perceber padrões.
Poucas entendem o que realmente está por trás deles.
```

#### **Verdades Fundamentais**
```
Conhecimento é perigoso.
Sobrevivência é mérito.
Despertar tem um preço.

Em Mesa Feudal, ninguém escolhe ser especial.
Alguns apenas sobrevivem tempo suficiente para se tornar.
```

## 🎯 Integração na IA

### **Prompt Base para Game Master**
```typescript
const manifestoPrompt = `
${WORLD_MANIFESTO.corePhilosophy}

${WORLD_MANIFESTO.humanCondition}

${WORLD_MANIFESTO.coreTruths}

${WORLD_MANIFESTO.gameMasterGuidelines}
`
```

### **Regras de Narrativa**
```
COMO GAME MASTER, VOCÊ DEVE SEGUIDAMENTE:

1. O MUNDO EXISTE INDEPENDENTEMENTE
2. O SOBRENATURAL É CONSEQUÊNCIA
3. A VIDA É REALISTA E CRUEL
4. O DESPERTAR TEM PREÇO
5. O JOGADOR NÃO É ESPECIAL
```

### **Estilo Narrativo**
- ✅ **Show, Don't Tell**: Mostre consequências através de detalhes mundanos
- ✅ **Crie Dúvida**: Nunca confirme - deixe espaço para interpretação
- ✅ **Mantenha Indiferença**: O mundo não se importa com intenções
- ✅ **Revelação Gradual**: Mistérios se revelam organicamente

## 🚪 Sistema de Onboarding

### **Experiência do Primeiro Contato**

#### **Sequência de 4 Passos**
```
1. "Você não começa como um herói."
   → Estabelece humildade e realismo

2. "Sua jornada começa comum."
   → Ênfase em origem e limitações

3. "O mundo reagirá a você."
   → Introduz indiferença do mundo

4. "Escreva sua história com cuidado."
   → Prepara para criação de personagem
```

#### **Interface Modal**
- **Design Sombrio**: Fundo escuro, texto vermelho para ênfase
- **Progresso Visual**: Indicadores de passo com cores
- **Navegação Clara**: Botões anterior/próximo intuitivos
- **Citação Final**: Reforça manifesto na base

### **Fluxo de Experiência**
```
Página Inicial → "Começar Jornada"
    ↓
Onboarding Modal (4 passos)
    ↓
"Criar Personagem" → Página de criação
```

## 🎨 Impacto na Experiência

### **Antes do Onboarding**
- Jogador chega diretamente na criação de personagem
- Pode não entender a profundidade filosófica
- Foca em mecânicas sem contexto

### **Depois do Onboarding**
- ✅ **Imersão Imediata**: Sente o tom misterioso desde o início
- ✅ **Expectativas Claras**: Sabe que não é um herói escolhido
- ✅ **Preparação Emocional**: Pronto para jornada de descoberta gradual
- ✅ **Contexto Filosófico**: Entende que sobrevivência > heroísmo

## 🏗️ Arquitetura Técnica

### **World Manifesto** (`lib/game/world-manifesto.ts`)
```typescript
export const WORLD_MANIFESTO = {
  corePhilosophy: "...",
  humanCondition: "...",
  coreTruths: "...",
  gameMasterGuidelines: "...",
  worldBuilding: { ... },
  characterProgression: { ... },
  aiBehaviorRules: { ... }
}
```

### **Onboarding Modal** (`app/components/OnboardingModal.tsx`)
```typescript
interface OnboardingModalProps {
  onClose: () => void
  onContinue: () => void
}

const steps = [
  { title: "...", content: "..." },
  // 4 passos sequenciais
]
```

### **Integração na IA**
```typescript
// Prompt da IA inclui manifesto
content: `
Você é o Game Master em Mesa Feudal...

${getWorldManifestoPrompt()}

${context.personalityPrompt}
...
`
```

## 📊 Estatísticas de Design

### **Duração do Onboarding**
- **4 Passos**: ~30-45 segundos para completar
- **Opcional**: Jogador pode pular se quiser
- **Revisitável**: Pode ser acessado novamente se necessário

### **Princípios Aplicados**
```
Realismo: 85% - Vida cotidiana é central
Mistério: 90% - Sobrenatural é ambíguo
Consequências: 95% - Toda ação tem impacto
Indiferença: 80% - Mundo não se importa
```

## 🎯 Resultado Final

### **Experiência Coesa**
O onboarding e manifesto criam uma **experiência filosófica coesa** onde:

- ✅ **Primeiro Contato**: Estabelece tom misterioso e realista
- ✅ **IA Consistente**: Game Master segue princípios do mundo
- ✅ **Progressão Orgânica**: Jogador entende evolução gradual
- ✅ **Imersão Profunda**: Mundo sente vivo e indiferente

### **Diferenças do Original**
- **Antes**: Jogo começa como típico RPG de heróis
- **Depois**: Jogo começa como jornada de sobrevivência e descoberta

### **Impacto na Narrativa**
- **Jogadores entendem**: Não são especiais por nascimento
- **Aceitam**: Que conhecimento tem preço
- **Valorizam**: Sobrevivência e observação
- **Esperam**: Revelações graduais e consequências reais

---

**O manifesto e onboarding transformam "Mesa Feudal" de um simples jogo em uma experiência filosófica profunda sobre sobrevivência, conhecimento perigoso e a indiferença do universo!** 🌑📜⚔️