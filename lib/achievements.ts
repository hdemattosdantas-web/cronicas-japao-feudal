import { Achievement } from '@prisma/client';

export interface AchievementData {
  name: string;
  description: string;
  icon: string;
  category: 'life_daily' | 'exploration' | 'mundane_conflicts' | 'supernatural' | 'knowledge_occultism' | 'legacy_heritage' | 'secret_classes';
  type: 'automatic' | 'manual';
  hidden?: boolean;
  rare?: boolean;
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
  reward?: {
    experience?: number;
    title?: string;
    trait?: string;
    attributeBonus?: {
      body?: number;
      strength?: number;
      agility?: number;
      intellect?: number;
      willpower?: number;
      perception?: number;
      socialPerception?: number;
      spiritualPerception?: number;
    };
    classUnlock?: string;
    special?: string;
  };
}

export const ACHIEVEMENTS: AchievementData[] = [
  // 🧑‍🌾 VIDA & COTIDIANO
  {
    name: "Um entre Muitos",
    description: "Criar um personagem sem nenhum atributo acima de 6",
    icon: "👤",
    category: "life_daily",
    type: "automatic",
    requirements: [
      { type: "character_created_no_high_attributes", value: 1, description: "Criar personagem com atributos ≤6" }
    ],
    reward: { experience: 200, attributeBonus: { willpower: 1 }, special: "NPCs mais confiáveis" }
  },
  {
    name: "Raízes Firmes",
    description: "Viver 10 anos na mesma província",
    icon: "🏠",
    category: "life_daily",
    type: "automatic",
    requirements: [
      { type: "years_in_same_province", value: 10, description: "Viver 10 anos na mesma província" }
    ],
    reward: { experience: 500, attributeBonus: { socialPerception: 1 }, special: "Desconto com comerciantes locais" }
  },
  {
    name: "Vida Simples",
    description: "Nunca entrar em combate até os 30 anos",
    icon: "🧘",
    category: "life_daily",
    type: "automatic",
    requirements: [
      { type: "age_without_combat", value: 30, description: "Chegar aos 30 anos sem combate" }
    ],
    reward: { experience: 800, attributeBonus: { intellect: 2 }, trait: "Observador Silencioso" }
  },

  // 🗺️ EXPLORAÇÃO
  {
    name: "Pelos Caminhos Antigos",
    description: "Viajar entre 5 cidades diferentes",
    icon: "🗺️",
    category: "exploration",
    type: "automatic",
    requirements: [
      { type: "cities_visited", value: 5, description: "Visitar 5 cidades diferentes" }
    ],
    reward: { experience: 300, attributeBonus: { perception: 1 }, special: "Eventos raros em estradas" }
  },
  {
    name: "Onde Ninguém Olha",
    description: "Investigar um local sem indicação direta de perigo",
    icon: "🔍",
    category: "exploration",
    type: "automatic",
    requirements: [
      { type: "investigate_hidden_location", value: 1, description: "Investigar local oculto" }
    ],
    reward: { experience: 400, special: "Desbloqueia eventos ocultos" }
  },

  // ⚔️ CONFRONTOS MUNDANOS
  {
    name: "Sangue na Estrada",
    description: "Sobreviver a um assalto ou briga urbana",
    icon: "🩸",
    category: "mundane_conflicts",
    type: "automatic",
    requirements: [
      { type: "survive_assault", value: 1, description: "Sobreviver a assalto ou briga urbana" }
    ],
    reward: { experience: 250, attributeBonus: { body: 1, agility: 1 } }
  },
  {
    name: "Não Foi Sorte",
    description: "Vencer um combate mundano sozinho",
    icon: "🥊",
    category: "mundane_conflicts",
    type: "automatic",
    requirements: [
      { type: "solo_mundane_victory", value: 1, description: "Vencer combate mundano sozinho" }
    ],
    reward: { experience: 350, attributeBonus: { strength: 1 }, trait: "Instinto de Sobrevivência" }
  },

  // 🌑 SOBRENATURAL (OCULTOS)
  {
    name: "Algo Estava Errado",
    description: "Presenciar um evento sobrenatural sem explicação clara",
    icon: "👁️",
    category: "supernatural",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "witness_supernatural", value: 1, description: "Presenciar evento sobrenatural inexplicável" }
    ],
    reward: { experience: 600, attributeBonus: { spiritualPerception: 1 } }
  },
  {
    name: "Eu Vi",
    description: "Enfrentar ou testemunhar uma criatura mística",
    icon: "👹",
    category: "supernatural",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "encounter_mystic_creature", value: 1, description: "Enfrentar criatura mística" }
    ],
    reward: { experience: 1000, special: "Desbloqueia barra de Consciência Oculta" }
  },
  {
    name: "O Primeiro Nome",
    description: "Descobrir o nome verdadeiro de uma entidade",
    icon: "📜",
    category: "supernatural",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "learn_entity_true_name", value: 1, description: "Descobrir nome verdadeiro de entidade" }
    ],
    reward: { experience: 1200, attributeBonus: { intellect: 1 }, special: "Habilita selos simples" }
  },

  // 📚 CONHECIMENTO & OCULTISMO
  {
    name: "Textos Proibidos",
    description: "Estudar pergaminhos, sutras ou relatos antigos",
    icon: "📚",
    category: "knowledge_occultism",
    type: "automatic",
    requirements: [
      { type: "study_ancient_texts", value: 1, description: "Estudar textos antigos" }
    ],
    reward: { experience: 400, attributeBonus: { intellect: 2, willpower: 1 } }
  },
  {
    name: "Entre Dois Mundos",
    description: "Realizar um ritual simples (bem ou mal-sucedido)",
    icon: "🔮",
    category: "knowledge_occultism",
    type: "automatic",
    requirements: [
      { type: "perform_simple_ritual", value: 1, description: "Realizar ritual simples" }
    ],
    reward: { experience: 700, special: "Desbloqueia classes espirituais iniciais" }
  },

  // 🧬 LEGADO & HEREDITARIEDADE
  {
    name: "Nome que Permanece",
    description: "Ter um filho dentro do jogo",
    icon: "👶",
    category: "legacy_heritage",
    type: "automatic",
    requirements: [
      { type: "have_child", value: 1, description: "Ter um filho no jogo" }
    ],
    reward: { experience: 800, special: "Filho nasce com +1 atributo herdado" }
  },
  {
    name: "O Que Meu Pai Sabia",
    description: "Personagem filho criado a partir de outro personagem",
    icon: "👨‍👩‍👧",
    category: "legacy_heritage",
    type: "automatic",
    requirements: [
      { type: "character_from_legacy", value: 1, description: "Criar personagem filho" }
    ],
    reward: { experience: 600, special: "Desbloqueia conhecimento oculto inicial" }
  },
  {
    name: "Sangue Marcado",
    description: "Herdar contato direto com o sobrenatural",
    icon: "🧬",
    category: "legacy_heritage",
    type: "automatic",
    rare: true,
    requirements: [
      { type: "inherit_supernatural_contact", value: 1, description: "Herdar contato sobrenatural" }
    ],
    reward: { experience: 2000, special: "Classe secreta parcial desbloqueada" }
  },

  // 🕯️ CLASSES SECRETAS (EXEMPLOS)
  {
    name: "Primeiro Yokai",
    description: "Encontrar evidências de yokai pela primeira vez",
    icon: "👺",
    category: "secret_classes",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "first_yokai_encounter", value: 1, description: "Primeiro encontro com yokai" }
    ],
    reward: { experience: 1500, classUnlock: "Caçador de Yokai" }
  },
  {
    name: "Eco do Além",
    description: "Ouvir vozes do mundo espiritual",
    icon: "👻",
    category: "secret_classes",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "hear_spirit_voices", value: 1, description: "Ouvir vozes espirituais" }
    ],
    reward: { experience: 1400, classUnlock: "Mediador Espiritual" }
  },
  {
    name: "Olhos que Veem",
    description: "Ver através da ilusão mundana",
    icon: "👁️‍🗨️",
    category: "secret_classes",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "see_through_illusion", value: 1, description: "Ver através de ilusão" }
    ],
    reward: { experience: 1600, classUnlock: "Onmyōji" }
  },
  {
    name: "Marca Profana",
    description: "Receber uma marca de entidade profana",
    icon: "🖤",
    category: "secret_classes",
    type: "automatic",
    hidden: true,
    rare: true,
    requirements: [
      { type: "receive_profane_mark", value: 1, description: "Receber marca profana" }
    ],
    reward: { experience: 1800, classUnlock: "Amaldiçoado" }
  },
  {
    name: "Oração Que Sangra",
    description: "Rezarduas que causam ferimentos físicos",
    icon: "🩸",
    category: "secret_classes",
    type: "automatic",
    hidden: true,
    requirements: [
      { type: "bloody_prayer", value: 1, description: "Oração que sangra" }
    ],
    reward: { experience: 1700, classUnlock: "Exorcista" }
  }
];

export const ACHIEVEMENT_CATEGORIES = {
  life_daily: { name: "Vida & Cotidiano", icon: "🧑‍🌾", color: "text-amber-600" },
  exploration: { name: "Exploração", icon: "🗺️", color: "text-green-400" },
  mundane_conflicts: { name: "Confrontos Mundanos", icon: "⚔️", color: "text-red-400" },
  supernatural: { name: "Sobrenatural", icon: "🌑", color: "text-purple-600" },
  knowledge_occultism: { name: "Conhecimento & Ocultismo", icon: "📚", color: "text-blue-500" },
  legacy_heritage: { name: "Legado & Herança", icon: "🧬", color: "text-indigo-500" },
  secret_classes: { name: "Classes Secretas", icon: "🕯️", color: "text-gray-400" }
};

export function checkAchievementUnlock(
  achievement: AchievementData,
  userStats: Record<string, number>
): { unlocked: boolean; progress: number; maxProgress: number } {
  let totalProgress = 0;
  let totalMaxProgress = 0;

  for (const requirement of achievement.requirements) {
    const userValue = userStats[requirement.type] || 0;
    totalProgress += Math.min(userValue, requirement.value);
    totalMaxProgress += requirement.value;
  }

  const unlocked = totalProgress >= totalMaxProgress;

  return {
    unlocked,
    progress: totalProgress,
    maxProgress: totalMaxProgress
  };
}