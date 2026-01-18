export interface Item {
  id: string
  name: string
  description: string
  category: 'weapon' | 'armor' | 'tool' | 'consumable' | 'material' | 'treasure' | 'special'
  type: string
  weight: number // em kg
  size: 'pequeno' | 'medio' | 'grande' | 'enorme'
  value: number // valor em moedas
  rarity: 'comum' | 'incomum' | 'raro' | 'epico' | 'legendario'
  properties?: any // propriedades especiais (dano, defesa, efeitos, etc)
  requirements?: any // requisitos para usar (nivel, atributos, profissão, etc)
  isStackable: boolean
  maxStack: number
  icon?: string | null
  professionSpecific?: string | null // profissão específica para este item
  createdAt: Date
  updatedAt: Date
}

export interface Inventory {
  id: string
  characterId: string
  maxWeight: number // capacidade máxima em kg
  maxSlots: number // número máximo de slots
  currentWeight: number // peso atual
  usedSlots: number // slots utilizados
  createdAt: Date
  updatedAt: Date
  slots?: InventorySlot[]
}

export interface InventorySlot {
  id: string
  inventoryId: string
  itemId: string
  item?: Item
  quantity: number
  slotPosition: number // posição no inventário (1-20)
  isEquipped: boolean
  equippedSlot?: string // slot de equipamento (main_hand, off_hand, armor, etc)
  createdAt: Date
  updatedAt: Date
}

// Tipos para tamanho de item
export const ItemSize = {
  PEQUENO: 'pequeno' as const,
  MEDIO: 'medio' as const,
  GRANDE: 'grande' as const,
  ENORME: 'enorme' as const,
} as const

// Tipos para categoria de item
export const ItemCategory = {
  WEAPON: 'weapon' as const,
  ARMOR: 'armor' as const,
  TOOL: 'tool' as const,
  CONSUMABLE: 'consumable' as const,
  MATERIAL: 'material' as const,
  TREASURE: 'treasure' as const,
  SPECIAL: 'special' as const,
} as const

// Tipos para raridade de item
export const ItemRarity = {
  COMUM: 'comum' as const,
  INCOMUM: 'incomum' as const,
  RARO: 'raro' as const,
  EPICO: 'epico' as const,
  LEGENDARIO: 'legendario' as const,
} as const

// Configurações de tamanho e peso
export const ItemSizeConfig = {
  [ItemSize.PEQUENO]: {
    weight: 0.1,
    slots: 1,
    name: 'Pequeno'
  },
  [ItemSize.MEDIO]: {
    weight: 1.0,
    slots: 1,
    name: 'Médio'
  },
  [ItemSize.GRANDE]: {
    weight: 5.0,
    slots: 2,
    name: 'Grande'
  },
  [ItemSize.ENORME]: {
    weight: 10.0,
    slots: 4,
    name: 'Enorme'
  }
} as const

// Configurações de capacidade do inventário por profissão
export const InventoryCapacityByProfession = {
  'Guerreiro': {
    maxWeight: 40.0,
    maxSlots: 18,
    description: 'Capacidade aumentada para transportar armaduras pesadas'
  },
  'Monge': {
    maxWeight: 25.0,
    maxSlots: 22,
    description: 'Mais slots para itens pequenos e ferramentas'
  },
  'Ninja': {
    maxWeight: 30.0,
    maxSlots: 25,
    description: 'Muitos slots para ferramentas e equipamentos leves'
  },
  'Samurai': {
    maxWeight: 35.0,
    maxSlots: 20,
    description: 'Bom equilíbrio entre peso e número de itens'
  },
  'Xamã': {
    maxWeight: 28.0,
    maxSlots: 24,
    description: 'Espaço para componentes rituais e amuletos'
  },
  'Artesão': {
    maxWeight: 32.0,
    maxSlots: 30,
    description: 'Grande capacidade para transportar materiais e ferramentas'
  },
  'Mercador': {
    maxWeight: 45.0,
    maxSlots: 35,
    description: 'Maior capacidade para transporte de mercadorias'
  },
  'Peregrino': {
    maxWeight: 26.0,
    maxSlots: 20,
    description: 'Capacidade moderada para longas jornadas'
  },
  'Padre': {
    maxWeight: 27.0,
    maxSlots: 22,
    description: 'Espaço para textos sagrados e itens rituais'
  },
  'Yamabushi': {
    maxWeight: 29.0,
    maxSlots: 23,
    description: 'Capacidade para equipamentos de montanha e itens espirituais'
  }
} as const

// Tipos para slots de equipamento
export const EquipmentSlots = {
  MAIN_HAND: 'main_hand',
  OFF_HAND: 'off_hand',
  HEAD: 'head',
  CHEST: 'chest',
  HANDS: 'hands',
  FEET: 'feet',
  ACCESSORY1: 'accessory1',
  ACCESSORY2: 'accessory2',
} as const

export type EquipmentSlotType = typeof EquipmentSlots[keyof typeof EquipmentSlots]
