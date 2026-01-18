import { AchievementData, ACHIEVEMENTS } from './achievements';
import { Character } from '@prisma/client';

/**
 * Sistema de Detecção Automática de Conquistas
 * Baseado nos princípios de RPG de vida orgânica
 */

// Tipos de eventos que podem disparar conquistas
export interface GameEvent {
  type: 'character_created' | 'combat_victory' | 'location_visit' | 'supernatural_encounter' |
        'ritual_performed' | 'child_born' | 'text_studied' | 'years_passed' | 'investigation';
  characterId?: string;
  userId: string;
  data: Record<string, any>;
}

// Detecta conquistas baseadas em eventos do jogo
export function detectAchievementsFromEvent(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  switch (event.type) {
    case 'character_created':
      achievements.push(...detectCharacterCreationAchievements(event));
      break;

    case 'combat_victory':
      achievements.push(...detectCombatAchievements(event));
      break;

    case 'supernatural_encounter':
      achievements.push(...detectSupernaturalAchievements(event));
      break;

    case 'ritual_performed':
      achievements.push(...detectKnowledgeAchievements(event));
      break;

    case 'child_born':
      achievements.push(...detectLegacyAchievements(event));
      break;

    case 'investigation':
      achievements.push(...detectExplorationAchievements(event));
      break;

    case 'years_passed':
      achievements.push(...detectLifeAchievements(event));
      break;
  }

  return achievements;
}

// Detecção específica para criação de personagem
function detectCharacterCreationAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Um entre Muitos" - personagem sem atributos >6
  if (event.data.attributes) {
    const attributes = event.data.attributes;
    const hasHighAttribute = Object.values(attributes).some((value: any) =>
      typeof value === 'number' && value > 6
    );

    if (!hasHighAttribute) {
      achievements.push(ACHIEVEMENTS.find(a => a.name === "Um entre Muitos")!);
    }
  }

  // "O Que Meu Pai Sabia" - personagem filho
  if (event.data.parentCharacterId) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "O Que Meu Pai Sabia")!);
  }

  return achievements;
}

// Detecção de conquistas de combate
function detectCombatAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Sangue na Estrada" - sobreviver a assalto
  if (event.data.combatType === 'assault' && event.data.survived) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Sangue na Estrada")!);
  }

  // "Não Foi Sorte" - vitória mundana sozinho
  if (event.data.combatType === 'mundane' && event.data.solo && event.data.victory) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Não Foi Sorte")!);
  }

  return achievements;
}

// Detecção de conquistas sobrenaturais (ocultas)
function detectSupernaturalAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Algo Estava Errado" - evento inexplicável
  if (event.data.supernatural && !event.data.explanation) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Algo Estava Errado")!);
  }

  // "Eu Vi" - criatura mística
  if (event.data.creature && event.data.mystic) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Eu Vi")!);
  }

  // "O Primeiro Nome" - nome verdadeiro
  if (event.data.trueName && event.data.entity) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "O Primeiro Nome")!);
  }

  // Classes secretas baseadas em encontros específicos
  if (event.data.yokai && event.data.firstEncounter) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Primeiro Yokai")!);
  }

  if (event.data.spiritVoices) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Eco do Além")!);
  }

  if (event.data.seeIllusion) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Olhos que Veem")!);
  }

  if (event.data.profaneMark) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Marca Profana")!);
  }

  if (event.data.bloodyPrayer) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Oração Que Sangra")!);
  }

  return achievements;
}

// Detecção de conquistas de conhecimento
function detectKnowledgeAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Textos Proibidos" - estudo de textos antigos
  if (event.data.textType === 'ancient' && event.data.studied) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Textos Proibidos")!);
  }

  // "Entre Dois Mundos" - ritual simples
  if (event.data.ritual && event.data.simple) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Entre Dois Mundos")!);
  }

  return achievements;
}

// Detecção de conquistas de legado
function detectLegacyAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Nome que Permanece" - ter filho
  achievements.push(ACHIEVEMENTS.find(a => a.name === "Nome que Permanece")!);

  // "Sangue Marcado" - herança sobrenatural
  if (event.data.supernaturalInheritance) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Sangue Marcado")!);
  }

  return achievements;
}

// Detecção de conquistas de exploração
function detectExplorationAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Pelos Caminhos Antigos" - visitar cidades
  if (event.data.locationType === 'city' && event.data.visited) {
    // Esta seria verificada por estatísticas gerais
  }

  // "Onde Ninguém Olha" - investigação oculta
  if (event.data.investigation && event.data.hidden && !event.data.dangerExpected) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Onde Ninguém Olha")!);
  }

  return achievements;
}

// Detecção de conquistas de vida cotidiana
function detectLifeAchievements(event: GameEvent): AchievementData[] {
  const achievements: AchievementData[] = [];

  // "Raízes Firmes" - anos na mesma província
  if (event.data.yearsInProvince >= 10) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Raízes Firmes")!);
  }

  // "Vida Simples" - sem combate até 30 anos
  if (event.data.age >= 30 && !event.data.hasCombat) {
    achievements.push(ACHIEVEMENTS.find(a => a.name === "Vida Simples")!);
  }

  return achievements;
}

/**
 * Exemplos de como usar no código do jogo:
 *
 * // Quando um personagem é criado
 * const event: GameEvent = {
 *   type: 'character_created',
 *   userId: user.id,
 *   characterId: character.id,
 *   data: { attributes: character.attributes }
 * };
 * const newAchievements = detectAchievementsFromEvent(event);
 *
 * // Quando há um encontro sobrenatural
 * const supernaturalEvent: GameEvent = {
 *   type: 'supernatural_encounter',
 *   userId: user.id,
 *   characterId: character.id,
 *   data: { yokai: true, firstEncounter: true }
 * };
 * const achievements = detectAchievementsFromEvent(supernaturalEvent);
 */