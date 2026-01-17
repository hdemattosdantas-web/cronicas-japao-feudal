// Tipos principais do sistema de jogo

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requirements?: {
    attribute?: string;
    minValue?: number;
    profession?: string[];
    items?: string[];
  };
  consequences?: {
    attributeChanges?: Record<string, number>;
    items?: string[];
    experience?: number;
    health?: number;
  };
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  narration?: string;
  choices: Choice[];
  image?: string;
  backgroundMusic?: string;
  location?: string;
  timeOfDay?: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: 'clear' | 'rain' | 'snow' | 'fog' | 'storm';
  npcs?: NPC[];
  items?: Item[];
  events?: GameEvent[];
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue?: string[];
  attitude?: 'friendly' | 'neutral' | 'hostile' | 'mysterious';
  profession?: string;
  canTrade?: boolean;
  quests?: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'misc';
  value?: number;
  effects?: Record<string, number>;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface GameEvent {
  id: string;
  type: 'encounter' | 'discovery' | 'crisis' | 'opportunity';
  title: string;
  description: string;
  choices: Choice[];
  probability?: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startingSceneId: string;
  scenes: Scene[];
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  estimatedHours: number;
  tags: string[];
  requirements?: {
    minLevel?: number;
    professions?: string[];
    completedCampaigns?: string[];
  };
  rewards?: {
    experience?: number;
    items?: string[];
    unlocks?: string[];
  };
}

export interface GameState {
  campaignId: string;
  characterId: string;
  currentSceneId: string;
  visitedScenes: string[];
  choicesMade: string[];
  inventory: Item[];
  attributes: Record<string, number>;
  experience: number;
  level: number;
  health: number;
  maxHealth: number;
  completedCampaigns: string[];
  activeQuests: string[];
  discoveredLocations: string[];
  reputation: Record<string, number>; // Relacionamento com facções/NPCs
  flags: Record<string, boolean>; // Flags para condições especiais
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  rewards: {
    experience?: number;
    items?: string[];
    reputation?: Record<string, number>;
  };
  status: 'active' | 'completed' | 'failed';
  progress: Record<string, any>;
}

// Tipos para IA e narração
export interface NarrationContext {
  scene: Scene;
  character: any; // Character type
  gameState: GameState;
  recentChoices: Choice[];
  timeOfDay: string;
  weather: string;
  location: string;
}

export interface AINarrationResponse {
  narration: string;
  mood: 'peaceful' | 'tense' | 'mysterious' | 'dramatic' | 'hopeful';
  suggestions?: string[];
  foreshadowing?: string;
}