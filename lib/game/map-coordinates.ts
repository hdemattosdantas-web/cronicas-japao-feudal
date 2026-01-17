// Sistema de Coordenadas e Mapa para Crônicas do Japão Feudal

export interface MapLocation {
  id: string
  name: string
  description: string
  coordinates: {
    x: number
    y: number
  }
  region: string
  type: 'village' | 'town' | 'castle' | 'temple' | 'forest' | 'mountain' | 'river' | 'road' | 'mystical'
  connections: string[] // IDs de locais conectados
  danger: 'safe' | 'moderate' | 'dangerous' | 'extreme'
  population?: number
  facilities: string[] // tavern, shop, dojo, etc.
  supernaturalPresence: number // 0-100
}

export interface PlayerPosition {
  playerId: string
  characterId: string
  userName: string
  locationId: string
  coordinates: {
    x: number
    y: number
  }
  isOnline: boolean
  lastSeen: string
  groupId?: string // Para grupos/parties
  status: 'traveling' | 'resting' | 'exploring' | 'in_combat' | 'socializing'
}

// Mapa completo do Japão feudal - Estrutura geográfica
export const JAPAN_FEUDAL_MAP: Record<string, MapLocation> = {
  // === PROVÍNCIA DE OWARI ===
  owari_village: {
    id: 'owari_village',
    name: 'Aldeia de Owari',
    description: 'Uma pacífica aldeia agrícola nas planícies de Owari, lar de camponeses e guerreiros locais.',
    coordinates: { x: 400, y: 350 },
    region: 'Owari',
    type: 'village',
    connections: ['owari_castle', 'kiyosu_town', 'nagoya_road'],
    danger: 'safe',
    population: 1200,
    facilities: ['tavern', 'blacksmith', 'temple', 'market'],
    supernaturalPresence: 15
  },

  owari_castle: {
    id: 'owari_castle',
    name: 'Castelo de Owari',
    description: 'Fortaleza ancestral da família Oda, centro político e militar da província.',
    coordinates: { x: 420, y: 320 },
    region: 'Owari',
    type: 'castle',
    connections: ['owari_village', 'kiyosu_town'],
    danger: 'moderate',
    population: 800,
    facilities: ['dojo', 'armory', 'noble_quarters'],
    supernaturalPresence: 25
  },

  kiyosu_town: {
    id: 'kiyosu_town',
    name: 'Kiyosu',
    description: 'Cidade comercial movimentada, ponto de encontro entre mercadores e viajantes.',
    coordinates: { x: 380, y: 330 },
    region: 'Owari',
    type: 'town',
    connections: ['owari_village', 'owari_castle', 'nagoya_road', 'gifu_road'],
    danger: 'moderate',
    population: 2500,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple'],
    supernaturalPresence: 10
  },

  nagoya: {
    id: 'nagoya',
    name: 'Nagoya',
    description: 'Grande cidade central de Owari, centro comercial e político da região.',
    coordinates: { x: 360, y: 340 },
    region: 'Owari',
    type: 'town',
    connections: ['kiyosu_town', 'owari_village', 'gifu_road', 'nakasendo_road'],
    danger: 'moderate',
    population: 15000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle'],
    supernaturalPresence: 20
  },

  // Vilas e templos de Owari
  rice_village_owari: {
    id: 'rice_village_owari',
    name: 'Vila do Arroz de Owari',
    description: 'Vila agrícola próspera especializada no cultivo de arroz nas férteis planícies de Owari.',
    coordinates: { x: 430, y: 360 },
    region: 'Owari',
    type: 'village',
    connections: ['owari_village', 'kiyosu_town'],
    danger: 'safe',
    population: 600,
    facilities: ['tavern', 'market'],
    supernaturalPresence: 5
  },

  fisherman_village_owari: {
    id: 'fisherman_village_owari',
    name: 'Vila Pesqueira de Owari',
    description: 'Pequena vila à beira do rio, conhecida por seus pescadores habilidosos.',
    coordinates: { x: 390, y: 370 },
    region: 'Owari',
    type: 'village',
    connections: ['owari_village', 'nagoya'],
    danger: 'safe',
    population: 400,
    facilities: ['tavern'],
    supernaturalPresence: 8
  },

  mountain_temple_owari: {
    id: 'mountain_temple_owari',
    name: 'Templo da Montanha Sagrada',
    description: 'Templo antigo construído nas encostas de uma montanha, lar de monges contemplativos.',
    coordinates: { x: 410, y: 300 },
    region: 'Owari',
    type: 'temple',
    connections: ['owari_castle', 'kiyosu_town'],
    danger: 'moderate',
    population: 50,
    facilities: ['temple', 'meditation_hall'],
    supernaturalPresence: 60
  },

  // === PROVÍNCIA DE KAI ===
  kofu: {
    id: 'kofu',
    name: 'Kōfu',
    description: 'Cidade principal de Kai, centro administrativo e comercial da província montanhosa.',
    coordinates: { x: 450, y: 280 },
    region: 'Kai',
    type: 'town',
    connections: ['kai_castle', 'kai_village', 'fuji_mountain', 'nakasendo_road'],
    danger: 'moderate',
    population: 8000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle'],
    supernaturalPresence: 30
  },

  kai_castle: {
    id: 'kai_castle',
    name: 'Castelo de Kai',
    description: 'Fortaleza montanhosa, lar dos guerreiros Takeda, conhecida por sua defesa intransponível.',
    coordinates: { x: 460, y: 270 },
    region: 'Kai',
    type: 'castle',
    connections: ['kofu', 'kai_village', 'fuji_mountain'],
    danger: 'dangerous',
    population: 600,
    facilities: ['dojo', 'armory'],
    supernaturalPresence: 35
  },

  kai_village: {
    id: 'kai_village',
    name: 'Aldeia de Kai',
    description: 'Pequena aldeia nas montanhas, conhecida por seus guerreiros habilidosos.',
    coordinates: { x: 430, y: 300 },
    region: 'Kai',
    type: 'village',
    connections: ['kofu', 'kai_castle', 'kiyosu_town', 'fuji_forest'],
    danger: 'moderate',
    population: 800,
    facilities: ['tavern', 'blacksmith'],
    supernaturalPresence: 20
  },

  // Vilas de Kai
  mountain_village_kai: {
    id: 'mountain_village_kai',
    name: 'Vila da Montanha de Kai',
    description: 'Vila isolada nas montanhas, lar de caçadores e lenhadores resistentes.',
    coordinates: { x: 470, y: 260 },
    region: 'Kai',
    type: 'village',
    connections: ['kai_castle', 'fuji_mountain'],
    danger: 'moderate',
    population: 300,
    facilities: ['tavern'],
    supernaturalPresence: 45
  },

  fuji_mountain: {
    id: 'fuji_mountain',
    name: 'Monte Fuji',
    description: 'A sagrada montanha Fuji, lar de monges ascetas e espíritos antigos.',
    coordinates: { x: 470, y: 250 },
    region: 'Kai',
    type: 'mountain',
    connections: ['kai_castle', 'fuji_temple', 'yamanashi_forest'],
    danger: 'dangerous',
    facilities: ['temple'],
    supernaturalPresence: 80
  },

  fuji_temple: {
    id: 'fuji_temple',
    name: 'Templo do Fuji',
    description: 'Santuário sagrado aos pés da montanha, onde monges buscam iluminação espiritual.',
    coordinates: { x: 460, y: 270 },
    region: 'Kai',
    type: 'temple',
    connections: ['fuji_mountain', 'kai_castle'],
    danger: 'moderate',
    facilities: ['temple', 'meditation_hall'],
    supernaturalPresence: 65
  },

  // === PROVÍNCIA DE SHINANO ===
  matsumoto: {
    id: 'matsumoto',
    name: 'Matsumoto',
    description: 'Cidade fortificada de Shinano, conhecida por seu castelo imponente e guerreiros montanheses.',
    coordinates: { x: 480, y: 220 },
    region: 'Shinano',
    type: 'town',
    connections: ['nakasendo_road', 'fuji_mountain', 'shinano_castle'],
    danger: 'moderate',
    population: 6000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle'],
    supernaturalPresence: 40
  },

  shinano_castle: {
    id: 'shinano_castle',
    name: 'Castelo de Shinano',
    description: 'Fortaleza estratégica nas montanhas, defendendo as rotas comerciais do norte.',
    coordinates: { x: 490, y: 210 },
    region: 'Shinano',
    type: 'castle',
    connections: ['matsumoto', 'nakasendo_road'],
    danger: 'dangerous',
    population: 400,
    facilities: ['dojo', 'armory'],
    supernaturalPresence: 50
  },

  // === PROVÍNCIA DE MINO ===
  gifu: {
    id: 'gifu',
    name: 'Gifu',
    description: 'Cidade estratégica de Mino, controlando importantes rotas fluviais e comerciais.',
    coordinates: { x: 340, y: 320 },
    region: 'Mino',
    type: 'town',
    connections: ['gifu_road', 'nagoya', 'mino_castle'],
    danger: 'moderate',
    population: 10000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle'],
    supernaturalPresence: 25
  },

  mino_castle: {
    id: 'mino_castle',
    name: 'Castelo de Mino',
    description: 'Fortaleza fluvial, crucial para defesa contra invasões do leste.',
    coordinates: { x: 350, y: 310 },
    region: 'Mino',
    type: 'castle',
    connections: ['gifu', 'gifu_road'],
    danger: 'moderate',
    population: 500,
    facilities: ['dojo', 'armory'],
    supernaturalPresence: 30
  },

  // === PROVÍNCIA DE MUSASHI ===
  edo: {
    id: 'edo',
    name: 'Edo (Tóquio)',
    description: 'Grande cidade emergente, capital do shogunato Tokugawa, centro de poder político.',
    coordinates: { x: 200, y: 400 },
    region: 'Musashi',
    type: 'town',
    connections: ['musashi_castle', 'eastern_road', 'edo_temple'],
    danger: 'moderate',
    population: 50000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle', 'noble_quarters'],
    supernaturalPresence: 35
  },

  musashi_castle: {
    id: 'musashi_castle',
    name: 'Castelo de Musashi',
    description: 'Imponente fortaleza urbana, sede do poder shogunal.',
    coordinates: { x: 210, y: 390 },
    region: 'Musashi',
    type: 'castle',
    connections: ['edo', 'eastern_road'],
    danger: 'moderate',
    population: 2000,
    facilities: ['dojo', 'armory', 'noble_quarters'],
    supernaturalPresence: 45
  },

  // === PROVÍNCIA DE ECHIGO ===
  kanazawa: {
    id: 'kanazawa',
    name: 'Kanazawa',
    description: 'Cidade cultural refinada de Echigo, conhecida por suas artes e arquitetura elegante.',
    coordinates: { x: 550, y: 180 },
    region: 'Echigo',
    type: 'town',
    connections: ['echigo_castle', 'northern_road', 'kanazawa_temple'],
    danger: 'moderate',
    population: 25000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle', 'teahouse'],
    supernaturalPresence: 55
  },

  echigo_castle: {
    id: 'echigo_castle',
    name: 'Castelo de Echigo',
    description: 'Fortaleza elegante nas montanhas, simbolizando a cultura refinada da região.',
    coordinates: { x: 560, y: 170 },
    region: 'Echigo',
    type: 'castle',
    connections: ['kanazawa', 'northern_road'],
    danger: 'moderate',
    population: 800,
    facilities: ['dojo', 'armory', 'teahouse'],
    supernaturalPresence: 60
  },

  // Grandes cidades centrais
  kyoto: {
    id: 'kyoto',
    name: 'Kyoto',
    description: 'Antiga capital imperial, coração cultural e espiritual do Japão, lar de templos milenares.',
    coordinates: { x: 300, y: 380 },
    region: 'Yamashiro',
    type: 'town',
    connections: ['edo', 'osaka', 'gifu_road', 'kyoto_temple'],
    danger: 'moderate',
    population: 40000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'imperial_palace', 'teahouse'],
    supernaturalPresence: 70
  },

  osaka: {
    id: 'osaka',
    name: 'Osaka',
    description: 'Poderoso centro comercial, "a cozinha da nação", conhecida por seus mercadores ricos.',
    coordinates: { x: 280, y: 400 },
    region: 'Settsu',
    type: 'town',
    connections: ['kyoto', 'edo', 'eastern_road', 'osaka_castle'],
    danger: 'moderate',
    population: 35000,
    facilities: ['tavern', 'inn', 'market', 'blacksmith', 'temple', 'castle', 'merchant_quarters'],
    supernaturalPresence: 40
  },

  // Áreas misteriosas
  fuji_forest: {
    id: 'fuji_forest',
    name: 'Floresta Misteriosa',
    description: 'Bosques densos onde estranhos fenômenos ocorrem e criaturas antigas vagam.',
    coordinates: { x: 480, y: 290 },
    region: 'Kai',
    type: 'forest',
    connections: ['kai_village', 'fuji_mountain', 'hidden_clearing'],
    danger: 'dangerous',
    facilities: [],
    supernaturalPresence: 75
  },

  hidden_clearing: {
    id: 'hidden_clearing',
    name: 'Clareira Oculta',
    description: 'Uma clareira secreta na floresta, conhecida apenas pelos mais corajosos ou loucos.',
    coordinates: { x: 500, y: 310 },
    region: 'Kai',
    type: 'mystical',
    connections: ['fuji_forest'],
    danger: 'extreme',
    facilities: [],
    supernaturalPresence: 95
  },

  // Estradas e caminhos
  nagoya_road: {
    id: 'nagoya_road',
    name: 'Estrada de Nagoya',
    description: 'Rota comercial movimentada conectando várias províncias.',
    coordinates: { x: 350, y: 340 },
    region: 'Owari',
    type: 'road',
    connections: ['kiyosu_town', 'owari_village', 'gifu_road'],
    danger: 'moderate',
    facilities: [],
    supernaturalPresence: 5
  },

  gifu_road: {
    id: 'gifu_road',
    name: 'Caminho de Gifu',
    description: 'Estrada antiga através das montanhas, lar de bandidos e espíritos errantes.',
    coordinates: { x: 330, y: 320 },
    region: 'Owari',
    type: 'road',
    connections: ['nagoya_road', 'kiyosu_town', 'gifu_castle'],
    danger: 'dangerous',
    facilities: [],
    supernaturalPresence: 30
  }
}

export class MapManager {
  private playerPositions: Map<string, PlayerPosition> = new Map()

  // Atualizar posição de um jogador
  updatePlayerPosition(playerId: string, position: Omit<PlayerPosition, 'playerId'>): void {
    const playerPosition: PlayerPosition = {
      playerId,
      ...position
    }

    this.playerPositions.set(playerId, playerPosition)
  }

  // Obter posição de um jogador
  getPlayerPosition(playerId: string): PlayerPosition | undefined {
    return this.playerPositions.get(playerId)
  }

  // Obter todos os jogadores online em uma área
  getPlayersInArea(locationId: string, radius: number = 50): PlayerPosition[] {
    const location = JAPAN_FEUDAL_MAP[locationId]
    if (!location) return []

    return Array.from(this.playerPositions.values())
      .filter(player =>
        player.isOnline &&
        this.getDistance(player.coordinates, location.coordinates) <= radius
      )
  }

  // Obter jogadores de um grupo
  getPlayersInGroup(groupId: string): PlayerPosition[] {
    return Array.from(this.playerPositions.values())
      .filter(player => player.groupId === groupId && player.isOnline)
  }

  // Calcular distância entre dois pontos
  private getDistance(pos1: { x: number, y: number }, pos2: { x: number, y: number }): number {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Encontrar caminho entre dois locais
  findPath(startLocationId: string, endLocationId: string): string[] {
    // Algoritmo simples de BFS para encontrar caminho
    const start = JAPAN_FEUDAL_MAP[startLocationId]
    const end = JAPAN_FEUDAL_MAP[endLocationId]

    if (!start || !end) return []

    const visited = new Set<string>()
    const queue: Array<{ locationId: string, path: string[] }> = [
      { locationId: startLocationId, path: [startLocationId] }
    ]

    while (queue.length > 0) {
      const current = queue.shift()!
      const currentLocation = JAPAN_FEUDAL_MAP[current.locationId]

      if (current.locationId === endLocationId) {
        return current.path
      }

      if (visited.has(current.locationId)) continue
      visited.add(current.locationId)

      for (const connectionId of currentLocation.connections) {
        if (!visited.has(connectionId)) {
          queue.push({
            locationId: connectionId,
            path: [...current.path, connectionId]
          })
        }
      }
    }

    return [] // Nenhum caminho encontrado
  }

  // Obter locais próximos a uma coordenada
  getNearbyLocations(coordinates: { x: number, y: number }, maxDistance: number = 100): MapLocation[] {
    return Object.values(JAPAN_FEUDAL_MAP)
      .filter(location => this.getDistance(coordinates, location.coordinates) <= maxDistance)
      .sort((a, b) => this.getDistance(coordinates, a.coordinates) - this.getDistance(coordinates, b.coordinates))
  }

  // Verificar se um local é acessível a partir de outro
  isLocationAccessible(fromLocationId: string, toLocationId: string): boolean {
    const path = this.findPath(fromLocationId, toLocationId)
    return path.length > 0
  }

  // Obter estatísticas da área
  getAreaStats(locationId: string, radius: number = 100): {
    totalPlayers: number
    onlinePlayers: number
    dangerLevel: 'safe' | 'moderate' | 'dangerous' | 'extreme'
    supernaturalPresence: number
    facilities: string[]
  } {
    const nearbyLocations = this.getNearbyLocations(
      JAPAN_FEUDAL_MAP[locationId]?.coordinates || { x: 0, y: 0 },
      radius
    )

    const playersInArea = this.getPlayersInArea(locationId, radius)

    // Calcular nível de perigo médio
    const dangerLevels = { safe: 0, moderate: 1, dangerous: 2, extreme: 3 }
    const avgDanger = nearbyLocations.reduce((sum, loc) =>
      sum + dangerLevels[loc.danger], 0
    ) / nearbyLocations.length

    let dangerLevel: 'safe' | 'moderate' | 'dangerous' | 'extreme'
    if (avgDanger < 0.5) dangerLevel = 'safe'
    else if (avgDanger < 1.5) dangerLevel = 'moderate'
    else if (avgDanger < 2.5) dangerLevel = 'dangerous'
    else dangerLevel = 'extreme'

    // Calcular presença sobrenatural média
    const avgSupernatural = nearbyLocations.reduce((sum, loc) =>
      sum + loc.supernaturalPresence, 0
    ) / nearbyLocations.length

    // Coletar todas as facilidades únicas
    const allFacilities = new Set<string>()
    nearbyLocations.forEach(loc => {
      loc.facilities.forEach(facility => allFacilities.add(facility))
    })

    return {
      totalPlayers: playersInArea.length,
      onlinePlayers: playersInArea.filter(p => p.isOnline).length,
      dangerLevel,
      supernaturalPresence: Math.round(avgSupernatural),
      facilities: Array.from(allFacilities)
    }
  }
}

export const mapManager = new MapManager()