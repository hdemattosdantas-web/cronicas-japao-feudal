import { Item, ItemCategory, ItemRarity, ItemSize, InventoryCapacityByProfession } from '@/types/inventory'

// Itens essenciais iniciais para todos os personagens
export const ESSENTIAL_ITEMS: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Frasco de Água',
    description: 'Um frasco de barro contendo água potável. Essencial para viagens longas.',
    category: ItemCategory.CONSUMABLE,
    type: 'water',
    weight: 0.5,
    size: ItemSize.PEQUENO,
    value: 5,
    rarity: ItemRarity.COMUM,
    properties: {
      effect: 'hydration',
      uses: 3,
      currentUses: 3
    },
    isStackable: true,
    maxStack: 10,
    icon: '💧'
  },
  {
    name: 'Rações de Viagem',
    description: 'Pequeno pacote com arroz seco e peixe salgado. Suficiente para 2 refeições.',
    category: ItemCategory.CONSUMABLE,
    type: 'food',
    weight: 0.3,
    size: ItemSize.PEQUENO,
    value: 8,
    rarity: ItemRarity.COMUM,
    properties: {
      effect: 'nutrition',
      uses: 2,
      currentUses: 2,
      hungerReduction: 50
    },
    isStackable: true,
    maxStack: 20,
    icon: '🍱'
  },
  {
    name: 'Faca de Bolso',
    description: 'Uma pequena faca simples, útil para tarefas cotidianas e autodefesa básica.',
    category: ItemCategory.TOOL,
    type: 'knife',
    weight: 0.2,
    size: ItemSize.PEQUENO,
    value: 15,
    rarity: ItemRarity.COMUM,
    properties: {
      damage: {
        type: 'corte',
        value: 3
      },
      utility: ['cortar', 'esfolar', 'defesa_pessoal']
    },
    isStackable: false,
    maxStack: 1,
    icon: '🔪'
  },
  {
    name: 'Saco de Lona',
    description: 'Um saco resistente para carregar pertences pequenos.',
    category: ItemCategory.TOOL,
    type: 'bag',
    weight: 0.1,
    size: ItemSize.PEQUENO,
    value: 10,
    rarity: ItemRarity.COMUM,
    properties: {
      capacity: {
        weight: 5.0,
        slots: 5
      }
    },
    isStackable: false,
    maxStack: 1,
    icon: '🎒'
  },
  {
    name: 'Pederneira',
    description: 'Pedra de fogo com aço para fazer fogo. Essencial para acampar.',
    category: ItemCategory.TOOL,
    type: 'fire_starter',
    weight: 0.2,
    size: ItemSize.PEQUENO,
    value: 12,
    rarity: ItemRarity.COMUM,
    properties: {
      uses: 'unlimited',
      utility: ['fazer_fogo', 'iluminar']
    },
    isStackable: false,
    maxStack: 1,
    icon: '🔥'
  }
]

// Itens específicos por profissão
export const PROFESSION_ITEMS: Record<string, Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[]> = {
  'Guerreiro': [
    {
      name: 'Espada Curta de Ferro',
      description: 'Uma espada curta robusta, bem balanceada para combate rápido.',
      category: ItemCategory.WEAPON,
      type: 'short_sword',
      weight: 1.2,
      size: ItemSize.MEDIO,
      value: 120,
      rarity: ItemRarity.COMUM,
      properties: {
        damage: {
          type: 'corte',
          value: 8
        },
        requirements: {
          strength: 4,
          level: 1
        },
        durability: 100,
        currentDurability: 100
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Guerreiro',
      icon: '⚔️'
    },
    {
      name: 'Armadura de Couro Reforçado',
      description: 'Armadura de couro reforçado com placas de metal nos pontos vitais.',
      category: ItemCategory.ARMOR,
      type: 'light_armor',
      weight: 8.0,
      size: ItemSize.GRANDE,
      value: 200,
      rarity: ItemRarity.COMUM,
      properties: {
        defense: 5,
        requirements: {
          strength: 5,
          level: 1
        },
        durability: 150,
        currentDurability: 150
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Guerreiro',
      icon: '🛡️'
    }
  ],
  
  'Monge': [
    {
      name: 'Bastão de Bambu',
      description: 'Um bastão longo e flexível de bambu tratado, excelente para defesa.',
      category: ItemCategory.WEAPON,
      type: 'staff',
      weight: 0.8,
      size: ItemSize.MEDIO,
      value: 80,
      rarity: ItemRarity.COMUM,
      properties: {
        damage: {
          type: 'contusao',
          value: 6
        },
        requirements: {
          agility: 4,
          level: 1
        },
        durability: 80,
        currentDurability: 80
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Monge',
      icon: '🏑'
    },
    {
      name: 'Roupas de Monge',
      description: 'Túnica simples e confortável que permite grande mobilidade.',
      category: ItemCategory.ARMOR,
      type: 'robes',
      weight: 1.5,
      size: ItemSize.MEDIO,
      value: 60,
      rarity: ItemRarity.COMUM,
      properties: {
        defense: 2,
        bonuses: {
          agility: 1,
          meditation: 2
        },
        durability: 100,
        currentDurability: 100
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Monge',
      icon: '🥋'
    }
  ],

  'Ninja': [
    {
      name: 'Kunai',
      description: 'Pequena adaga em forma de folha, ferramenta versátil para ninja.',
      category: ItemCategory.WEAPON,
      type: 'throwing_knife',
      weight: 0.1,
      size: ItemSize.PEQUENO,
      value: 25,
      rarity: ItemRarity.COMUM,
      properties: {
        damage: {
          type: 'perfuracao',
          value: 4
        },
        requirements: {
          agility: 5,
          level: 1
        },
        throwable: true,
        range: 15,
        durability: 20,
        currentDurability: 20
      },
      isStackable: true,
      maxStack: 10,
      professionSpecific: 'Ninja',
      icon: '🥷'
    },
    {
      name: 'Roupa de Infiltração',
      description: 'Roupa escura e silenciosa, perfeita para se mover nas sombras.',
      category: ItemCategory.ARMOR,
      type: 'stealth_clothing',
      weight: 1.0,
      size: ItemSize.MEDIO,
      value: 150,
      rarity: ItemRarity.COMUM,
      properties: {
        defense: 1,
        bonuses: {
          stealth: 3,
          agility: 1
        },
        durability: 80,
        currentDurability: 80
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Ninja',
      icon: '🌑'
    }
  ],

  'Samurai': [
    {
      name: 'Wakizashi',
      description: 'Espada curta tradicional, símbolo de status e arma de backup.',
      category: ItemCategory.WEAPON,
      type: 'wakizashi',
      weight: 0.9,
      size: ItemSize.MEDIO,
      value: 300,
      rarity: ItemRarity.INCOMUM,
      properties: {
        damage: {
          type: 'corte',
          value: 9
        },
        requirements: {
          strength: 5,
          agility: 4,
          level: 1
        },
        durability: 120,
        currentDurability: 120,
        honor: 2
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Samurai',
      icon: '🗡️'
    },
    {
      name: 'Kimono de Samurai',
      description: 'Kimono tradicional com o brasão de seu clã.',
      category: ItemCategory.ARMOR,
      type: 'formal_armor',
      weight: 2.0,
      size: ItemSize.MEDIO,
      value: 180,
      rarity: ItemRarity.COMUM,
      properties: {
        defense: 3,
        bonuses: {
          socialPerception: 1,
          willpower: 1
        },
        durability: 100,
        currentDurability: 100
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Samurai',
      icon: '👘'
    }
  ],

  'Xamã': [
    {
      name: 'Cajado Ritual',
      description: 'Cajado de madeira sagrada adornado com penas e contas espirituais.',
      category: ItemCategory.WEAPON,
      type: 'ritual_staff',
      weight: 1.0,
      size: ItemSize.MEDIO,
      value: 140,
      rarity: ItemRarity.COMUM,
      properties: {
        damage: {
          type: 'contusao',
          value: 5
        },
        bonuses: {
          spiritualPerception: 2,
          willpower: 1
        },
        requirements: {
          spiritualPerception: 1,
          level: 1
        },
        durability: 90,
        currentDurability: 90
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Xamã',
      icon: '🪄'
    },
    {
      name: 'Amuleto de Proteção',
      description: 'Amuleto de osso e madeira que protege contra espíritos malignos.',
      category: ItemCategory.SPECIAL,
      type: 'amulet',
      weight: 0.1,
      size: ItemSize.PEQUENO,
      value: 100,
      rarity: ItemRarity.INCOMUM,
      properties: {
        bonuses: {
          spiritualPerception: 1,
          willpower: 2
        },
        protection: {
          type: 'spiritual',
          value: 3
        },
        durability: 50,
        currentDurability: 50
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Xamã',
      icon: '🧿'
    }
  ],

  'Artesão': [
    {
      name: 'Conjunto de Ferramentas',
      description: 'Kit completo com martelo, formão, serra e outras ferramentas essenciais.',
      category: ItemCategory.TOOL,
      type: 'toolkit',
      weight: 3.0,
      size: ItemSize.GRANDE,
      value: 250,
      rarity: ItemRarity.COMUM,
      properties: {
        utility: ['construção', 'reparo', 'criação'],
        bonuses: {
          crafting: 2
        },
        durability: 200,
        currentDurability: 200
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Artesão',
      icon: '🔨'
    },
    {
      name: 'Madeira de Qualidade',
      description: 'Seleção de madeiras nobres para projetos especiais.',
      category: ItemCategory.MATERIAL,
      type: 'wood',
      weight: 2.0,
      size: ItemSize.MEDIO,
      value: 80,
      rarity: ItemRarity.COMUM,
      properties: {
        quality: 'superior',
        uses: ['construção', 'escultura', 'armas'],
        quantity: 10
      },
      isStackable: true,
      maxStack: 50,
      professionSpecific: 'Artesão',
      icon: '🪵'
    }
  ],

  'Mercador': [
    {
      name: 'Balança de Precisão',
      description: 'Balança de bronze para pesar mercadorias com exatidão.',
      category: ItemCategory.TOOL,
      type: 'scale',
      weight: 1.5,
      size: ItemSize.PEQUENO,
      value: 200,
      rarity: ItemRarity.COMUM,
      properties: {
        utility: ['pesagem', 'negociação'],
        bonuses: {
          socialPerception: 1
        },
        precision: 'high'
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Mercador',
      icon: '⚖️'
    },
    {
      name: 'Saco de Moedas',
      description: 'Saco contendo 50 moedas de cobre para começar seus negócios.',
      category: ItemCategory.TREASURE,
      type: 'money',
      weight: 0.5,
      size: ItemSize.PEQUENO,
      value: 50,
      rarity: ItemRarity.COMUM,
      properties: {
        currency: 'copper',
        amount: 50
      },
      isStackable: true,
      maxStack: 100,
      professionSpecific: 'Mercador',
      icon: '💰'
    }
  ],

  'Peregrino': [
    {
      name: 'Bordão de Peregrino',
      description: 'Bordão de madeira resistente que serviu a muitos viajantes.',
      category: ItemCategory.WEAPON,
      type: 'walking_staff',
      weight: 0.8,
      size: ItemSize.MEDIO,
      value: 40,
      rarity: ItemRarity.COMUM,
      properties: {
        damage: {
          type: 'contusao',
          value: 4
        },
        utility: ['apoio', 'defesa'],
        bonuses: {
          endurance: 1
        },
        durability: 100,
        currentDurability: 100
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Peregrino',
      icon: '🚶'
    },
    {
      name: 'Mapa de Peregrinação',
      description: 'Mapa antigo mostrando templos e locais sagrados.',
      category: ItemCategory.SPECIAL,
      type: 'map',
      weight: 0.1,
      size: ItemSize.PEQUENO,
      value: 120,
      rarity: ItemRarity.INCOMUM,
      properties: {
        utility: ['navegação', 'conhecimento'],
        bonuses: {
          perception: 1
        },
        locations: ['templo_budista', 'santuário_shinto', 'monastério_escondido']
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Peregrino',
      icon: '🗺️'
    }
  ],

  'Padre': [
    {
      name: 'Rosário de Contas',
      description: 'Rosário de madeira sagrada para orações e meditação.',
      category: ItemCategory.SPECIAL,
      type: 'prayer_beads',
      weight: 0.2,
      size: ItemSize.PEQUENO,
      value: 90,
      rarity: ItemRarity.COMUM,
      properties: {
        bonuses: {
          willpower: 2,
          socialPerception: 1
        },
        utility: ['oração', 'meditação', 'bênção'],
        durability: 60,
        currentDurability: 60
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Padre',
      icon: '📿'
    },
    {
      name: 'Texto Sagrado',
      description: 'Livro contendo ensinamentos sagrados e rituais.',
      category: ItemCategory.SPECIAL,
      type: 'holy_book',
      weight: 1.0,
      size: ItemSize.PEQUENO,
      value: 150,
      rarity: ItemRarity.INCOMUM,
      properties: {
        bonuses: {
          intellect: 1,
          willpower: 1
        },
        utility: ['estudo', 'rituais', 'orientação'],
        durability: 80,
        currentDurability: 80
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Padre',
      icon: '📖'
    }
  ],

  'Yamabushi': [
    {
      name: 'Foice de Batalha',
      description: 'Foice tradicional usada tanto na agricultura quanto no combate.',
      category: ItemCategory.WEAPON,
      type: 'war_scythe',
      weight: 2.5,
      size: ItemSize.MEDIO,
      value: 160,
      rarity: ItemRarity.COMUM,
      properties: {
        damage: {
          type: 'corte',
          value: 10
        },
        requirements: {
          strength: 4,
          agility: 3,
          level: 1
        },
        utility: ['agricultura', 'combate'],
        durability: 110,
        currentDurability: 110
      },
      isStackable: false,
      maxStack: 1,
      professionSpecific: 'Yamabushi',
      icon: '🔱'
    },
    {
      name: 'Ervas Medicinais',
      description: 'Conjunto de ervas da montanha para tratamentos básicos.',
      category: ItemCategory.CONSUMABLE,
      type: 'herbs',
      weight: 0.2,
      size: ItemSize.PEQUENO,
      value: 60,
      rarity: ItemRarity.COMUM,
      properties: {
        effect: 'healing',
        healing: 15,
        uses: 5,
        currentUses: 5
      },
      isStackable: true,
      maxStack: 20,
      professionSpecific: 'Yamabushi',
      icon: '🌿'
    }
  ]
}

// Função para obter itens iniciais baseado na profissão
export function getInitialItems(profession: string): Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[] {
  const essential = [...ESSENTIAL_ITEMS]
  const professionItems = PROFESSION_ITEMS[profession] || []
  
  return [...essential, ...professionItems]
}

// Função para obter capacidade do inventário por profissão
export function getInventoryCapacity(profession: string) {
  return (InventoryCapacityByProfession as any)[profession] || {
    maxWeight: 30.0,
    maxSlots: 20,
    description: 'Capacidade padrão'
  }
}
