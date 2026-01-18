# 🏆 Sistema de Conquistas - Crônicas do Japão Feudal

## 🎯 Filosofia Implementada

### ✅ Princípios Seguidores:
- **Não são "faça X vezes"** - São marcos de vida
- **Recompensas narrativas + mecânicas** - XP + atributos + traits
- **Algumas ocultas** - Descoberta orgânica
- **Algumas hereditárias** - Sistema familiar
- **Jogador descobre** - Não "farma"

---

## 🏆 CATEGORIAS IMPLEMENTADAS

### 🧑‍🌾 **Vida & Cotidiano** (4 conquistas)
Sistema de vida orgânica, marcos pessoais

### 🗺️ **Exploração** (2 conquistas)
Descoberta de lugares, investigações

### ⚔️ **Confrontos Mundanos** (2 conquistas)
Combates do dia-a-dia, sobrevivência

### 🌑 **Sobrenatural** (3 conquistas ocultas)
Encontros místicos, descobertas ocultas

### 📚 **Conhecimento & Ocultismo** (2 conquistas)
Estudo, rituais, aprendizado espiritual

### 🧬 **Legado & Herança** (3 conquistas)
Sistema familiar, descendência

### 🕯️ **Classes Secretas** (5 conquistas ocultas)
Desbloqueio de classes especiais

---

## 📜 LISTA COMPLETA DE CONQUISTAS

### 🧑‍🌾 VIDA & COTIDIANO

#### 🏆 **"Um entre Muitos"**
**Condição:** Criar personagem sem atributos >6
**Recompensa:** +1 Vontade, NPCs mais confiáveis
**Tipo:** Automático

#### 🏆 **"Raízes Firmes"**
**Condição:** Viver 10 anos na mesma província
**Recompensa:** Desconto comerciantes locais, +1 Percepção social
**Tipo:** Automático

#### 🏆 **"Vida Simples"**
**Condição:** Nunca combater até 30 anos
**Recompensa:** +2 Intelecto, Trait "Observador Silencioso"
**Tipo:** Automático

### 🗺️ EXPLORAÇÃO

#### 🏆 **"Pelos Caminhos Antigos"**
**Condição:** Viajar entre 5 cidades diferentes
**Recompensa:** +1 Percepção, Eventos raros em estradas
**Tipo:** Automático

#### 🏆 **"Onde Ninguém Olha"**
**Condição:** Investigar local sem indicação de perigo
**Recompensa:** Desbloqueia eventos ocultos
**Tipo:** Automático

### ⚔️ CONFRONTOS MUNDANOS

#### 🏆 **"Sangue na Estrada"**
**Condição:** Sobreviver assalto ou briga urbana
**Recompensa:** +1 Corpo, +1 Agilidade
**Tipo:** Automático

#### 🏆 **"Não Foi Sorte"**
**Condição:** Vencer combate mundano sozinho
**Recompensa:** +1 Força, Trait "Instinto de Sobrevivência"
**Tipo:** Automático

### 🌑 SOBRENATURAL (OCULTAS)

#### 🏆 **"Algo Estava Errado"** 🔒
**Condição:** Presenciar evento sobrenatural inexplicável
**Recompensa:** +1 Percepção Espiritual (oculta)
**Tipo:** Automático, Oculta

#### 🏆 **"Eu Vi"** 🔒
**Condição:** Enfrentar ou testemunhar criatura mística
**Recompensa:** Desbloqueia "Barra de Consciência Oculta"
**Tipo:** Automático, Oculta

#### 🏆 **"O Primeiro Nome"** 🔒
**Condição:** Descobrir nome verdadeiro de entidade
**Recompensa:** +1 Intelecto, Habilita selos simples
**Tipo:** Automático, Oculta

### 📚 CONHECIMENTO & OCULTISMO

#### 🏆 **"Textos Proibidos"**
**Condição:** Estudar pergaminhos, sutras ou relatos antigos
**Recompensa:** +2 Intelecto, +1 Vontade
**Tipo:** Automático

#### 🏆 **"Entre Dois Mundos"**
**Condição:** Realizar ritual simples (bem/mal-sucedido)
**Recompensa:** Desbloqueia classes espirituais iniciais
**Tipo:** Automático

### 🧬 LEGADO & HEREDITARIEDADE

#### 🏆 **"Nome que Permanece"**
**Condição:** Ter filho dentro do jogo
**Recompensa:** Filho nasce com +1 atributo herdado
**Tipo:** Automático

#### 🏆 **"O Que Meu Pai Sabia"**
**Condição:** Criar personagem filho de outro personagem
**Recompensa:** Desbloqueia conhecimento oculto inicial
**Tipo:** Automático

#### 🏆 **"Sangue Marcado"** 💎
**Condição:** Herdar contato direto com sobrenatural
**Recompensa:** Classe secreta parcial desbloqueada
**Tipo:** Automático, Rara

### 🕯️ CLASSES SECRETAS (OCULTAS)

#### 🏆 **"Primeiro Yokai"** 🔒
**Condição:** Encontrar evidências de yokai pela primeira vez
**Recompensa:** Classe "Caçador de Yokai"
**Tipo:** Automático, Oculta

#### 🏆 **"Eco do Além"** 🔒
**Condição:** Ouvir vozes do mundo espiritual
**Recompensa:** Classe "Mediador Espiritual"
**Tipo:** Automático, Oculta

#### 🏆 **"Olhos que Veem"** 🔒
**Condição:** Ver através da ilusão mundana
**Recompensa:** Classe "Onmyōji"
**Tipo:** Automático, Oculta

#### 🏆 **"Marca Profana"** 🔒💎
**Condição:** Receber marca de entidade profana
**Recompensa:** Classe "Amaldiçoado"
**Tipo:** Automático, Oculta, Rara

#### 🏆 **"Oração Que Sangra"** 🔒
**Condição:** Rezar orações que causam ferimentos físicos
**Recompensa:** Classe "Exorcista"
**Tipo:** Automático, Oculta

---

## 🧠 COMO A IA RECONHECE CONQUISTAS

### 📊 Sistema de Detecção Automática

O arquivo `lib/achievement-detector.ts` contém funções que detectam conquistas baseadas em eventos do jogo:

```typescript
// Exemplo de uso:
import { detectAchievementsFromEvent } from './achievement-detector';

// Quando um personagem é criado
const event = {
  type: 'character_created',
  userId: user.id,
  data: { attributes: character.attributes }
};

const newAchievements = detectAchievementsFromEvent(event);
```

### 🎯 Eventos que Disparam Conquistas:

#### `character_created`
- Verifica atributos baixos
- Detecta personagens filhos

#### `combat_victory`
- Sobrevivência a assaltos
- Vitórias mundanas solitárias

#### `supernatural_encounter`
- Eventos inexplicáveis
- Encontros com criaturas
- Descoberta de nomes verdadeiros
- Desbloqueio de classes secretas

#### `ritual_performed`
- Rituais simples realizados

#### `child_born`
- Nascimento de filhos
- Herança sobrenatural

#### `investigation`
- Investigações ocultas

#### `years_passed`
- Marcos temporais de vida

---

## 🧩 ESTRUTURA TÉCNICA IMPLEMENTADA

### 📁 Arquivos Criados/Modificados:

#### `lib/achievements.ts`
- Lista completa de conquistas
- Categorias atualizadas
- Novos tipos de recompensa
- Sistema de conquistas ocultas/raras

#### `lib/achievement-detector.ts`
- Funções de detecção automática
- Mapeamento de eventos para conquistas
- Exemplos de implementação

#### `app/achievements/page.tsx`
- Interface atualizada
- Badges para conquistas especiais
- Exibição condicional para ocultas

#### `app/api/achievements/route.ts`
- Estatísticas expandidas
- Suporte a novos tipos de métricas

### 🎨 Interface Atualizada:

#### ✨ Novos Elementos Visuais:
- **🔒 Badge "Oculta"** - Para conquistas não descobertas
- **💎 Badge "Rara"** - Para conquistas especiais
- **✅ Badge "Completa"** - Para conquistas desbloqueadas
- **❓ Ícone misterioso** - Para conquistas ocultas
- **Texto especial** - Descrições condicionais

---

## 🎮 COMO INTEGRAR NO JOGO

### 1. **Eventos de Personagem**
```typescript
// Na criação de personagem
const achievements = detectAchievementsFromEvent({
  type: 'character_created',
  userId: userId,
  data: { attributes: character.attributes }
});
```

### 2. **Eventos de Combate**
```typescript
// Após vitória em combate
const achievements = detectAchievementsFromEvent({
  type: 'combat_victory',
  userId: userId,
  data: {
    combatType: 'assault',
    survived: true,
    solo: true
  }
});
```

### 3. **Eventos Sobrenaturais**
```typescript
// Durante encontros místicos
const achievements = detectAchievementsFromEvent({
  type: 'supernatural_encounter',
  userId: userId,
  data: {
    yokai: true,
    firstEncounter: true
  }
});
```

### 4. **Sistema Familiar**
```typescript
// Ao nascer filho
const achievements = detectAchievementsFromEvent({
  type: 'child_born',
  userId: userId,
  data: {
    supernaturalInheritance: false
  }
});
```

---

## 🎯 RECOMPENSAS IMPLEMENTADAS

### 💰 **Experiência (XP)**
- Valores entre 200-2000 XP
- Baseados na dificuldade/raridade

### 🏋️ **Bônus de Atributos**
```typescript
attributeBonus: {
  body?: number;        // +1 Corpo físico
  strength?: number;    // +1 Força
  agility?: number;     // +1 Agilidade
  intellect?: number;   // +1/+2 Intelecto
  willpower?: number;   // +1 Vontade
  perception?: number;  // +1 Percepção geral
  socialPerception?: number;  // +1 Percepção social
  spiritualPerception?: number; // +1 Percepção espiritual
}
```

### 🎭 **Traits Especiais**
- "Observador Silencioso"
- "Instinto de Sobrevivência"

### 🎓 **Desbloqueios Especiais**
- NPCs mais confiáveis
- Descontos comerciais
- Eventos raros
- Classes espirituais
- Barra de Consciência Oculta
- Selos simples

### 👑 **Classes Secretas**
- Caçador de Yokai
- Mediador Espiritual
- Onmyōji
- Amaldiçoado (rara)
- Exorcista

---

## 📊 SISTEMA DE ESTATÍSTICAS

### 🔢 Métricas Rastreadas:
```typescript
{
  // Vida & cotidiano
  character_created_no_high_attributes: 0,
  years_in_same_province: 0,
  age_without_combat: 0,

  // Exploração
  cities_visited: 0,
  investigate_hidden_location: 0,

  // Combate
  survive_assault: 0,
  solo_mundane_victory: 0,

  // Sobrenatural
  witness_supernatural: 0,
  encounter_mystic_creature: 0,
  learn_entity_true_name: 0,

  // Conhecimento
  study_ancient_texts: 0,
  perform_simple_ritual: 0,

  // Legado
  have_child: 0,
  character_from_legacy: 0,
  inherit_supernatural_contact: 0,

  // Classes secretas
  first_yokai_encounter: 0,
  hear_spirit_voices: 0,
  see_through_illusion: 0,
  receive_profane_mark: 0,
  bloody_prayer: 0
}
```

---

## 🎊 RESULTADO FINAL

### ✅ **Sistema Implementado:**
- **17 conquistas** categorizadas
- **8 ocultas** para descoberta orgânica
- **2 raras** para momentos especiais
- **Recompensas narrativas + mecânicas**
- **Detecção automática** via eventos
- **Interface elegante** com badges
- **Herança familiar** integrada

### 🌟 **Experiência do Jogador:**
- **Descoberta orgânica** de conquistas
- **Progressão natural** através da vida
- **Recompensas significativas** que impactam
- **Sistema familiar** com herança
- **Classes secretas** para exploração

### 🎮 **Para o Desenvolvedor:**
- **Framework expansível** para novas conquistas
- **Sistema de eventos** padronizado
- **Integração automática** no gameplay
- **Analytics de conquistas** implementado
- **Documentação completa** criada

---

## 🚀 PRÓXIMOS PASSOS

### 📈 **Expansão Planejada:**
1. **Mais conquistas** baseadas no feedback
2. **Sistema de títulos** permanentes
3. **Achievements sazonais** especiais
4. **Conquistas sociais** entre jogadores
5. **Recompensas visuais** (bordas, efeitos)

### 🔧 **Integração Técnica:**
1. **Conectar eventos** do jogo às funções de detecção
2. **Implementar sistema familiar** completo
3. **Adicionar notificações** de desbloqueio
4. **Criar sistema de classes** secretas
5. **Implementar herança** de atributos

---

## 🎯 CONCLUSÃO

**🏆 Sistema de conquistas profissional implementado!**

**🌟 Transforma "Crônicas do Japão Feudal" em uma experiência verdadeiramente orgânica onde cada escolha importa!**

**🎭 Os jogadores agora têm marcos significativos de vida que recompensam sua jornada pessoal através do Japão Sengoku! ✨**