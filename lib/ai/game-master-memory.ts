// Sistema de Memória do Game Master

export interface MemoryEntry {
  id: string
  type: 'event' | 'npc' | 'location' | 'quest' | 'player_action' | 'creature'
  timestamp: Date
  importance: 'trivial' | 'minor' | 'significant' | 'major' | 'legendary'
  content: any
  tags: string[]
  connections: string[] // IDs de outras memórias relacionadas
  emotionalContext?: string
  consequences?: string[]
}

export interface NPCMemory {
  id: string
  name: string
  personality: {
    traits: string[]
    attitudes: Record<string, number> // playerId -> attitude (-100 to 100)
    motivations: string[]
    secrets: string[]
  }
  relationships: {
    allies: string[]
    enemies: string[]
    family: string[]
    organizations: string[]
  }
  history: {
    firstEncounter: Date
    significantEvents: string[]
    lastInteraction: Date
  }
  currentStatus: {
    location: string
    health: 'excellent' | 'good' | 'wounded' | 'critical' | 'dead'
    mood: 'friendly' | 'neutral' | 'hostile' | 'mysterious'
    currentActivity: string
  }
}

export interface LocationMemory {
  id: string
  name: string
  description: string
  supernaturalPresence: number // 0-100, quanto o local é "carregado" espiritualmente
  significantEvents: string[]
  residentNPCs: string[]
  hiddenSecrets: string[]
  atmosphere: 'peaceful' | 'tense' | 'mysterious' | 'dangerous' | 'sacred'
  lastVisited: Date
  visitCount: number
}

export class GameMasterMemory {
  private memories: Map<string, MemoryEntry> = new Map()
  private npcMemories: Map<string, NPCMemory> = new Map()
  private locationMemories: Map<string, LocationMemory> = new Map()
  private maxMemories = 1000 // Limite de memórias para evitar vazamento de memória

  // === MEMÓRIA GERAL ===

  addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const memoryEntry: MemoryEntry = {
      ...entry,
      id,
      timestamp: new Date()
    }

    this.memories.set(id, memoryEntry)

    // Limpar memórias antigas se necessário
    if (this.memories.size > this.maxMemories) {
      this.cleanupOldMemories()
    }

    return id
  }

  getRelevantMemories(tags: string[], limit = 10): MemoryEntry[] {
    const relevant = Array.from(this.memories.values())
      .filter(memory =>
        tags.some(tag => memory.tags.includes(tag)) ||
        memory.importance === 'legendary' ||
        memory.importance === 'major'
      )
      .sort((a, b) => {
        // Ordenar por importância e recência
        const importanceWeight = { legendary: 4, major: 3, significant: 2, minor: 1, trivial: 0 }
        const aScore = importanceWeight[a.importance] + (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60 * 24) // dias desde o evento
        const bScore = importanceWeight[b.importance] + (Date.now() - b.timestamp.getTime()) / (1000 * 60 * 60 * 24)
        return bScore - aScore
      })
      .slice(0, limit)

    return relevant
  }

  private cleanupOldMemories(): void {
    // Remove memórias triviais antigas primeiro
    const trivialMemories = Array.from(this.memories.values())
      .filter(m => m.importance === 'trivial')
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // Remove as 10% mais antigas
    const toRemove = Math.floor(this.memories.size * 0.1)
    for (let i = 0; i < toRemove && i < trivialMemories.length; i++) {
      this.memories.delete(trivialMemories[i].id)
    }
  }

  // === MEMÓRIA DE NPCs ===

  createOrUpdateNPC(npcData: Partial<NPCMemory> & { id: string }): void {
    const existing = this.npcMemories.get(npcData.id)

    if (existing) {
      // Atualizar NPC existente
      this.npcMemories.set(npcData.id, {
        ...existing,
        ...npcData,
        personality: { ...existing.personality, ...npcData.personality },
        relationships: { ...existing.relationships, ...npcData.relationships },
        history: { ...existing.history, ...npcData.history },
        currentStatus: { ...existing.currentStatus, ...npcData.currentStatus }
      })
    } else {
      // Criar novo NPC
      const defaultNPC: NPCMemory = {
        id: npcData.id,
        name: npcData.name || 'Desconhecido',
        personality: {
          traits: npcData.personality?.traits || [],
          attitudes: npcData.personality?.attitudes || {},
          motivations: npcData.personality?.motivations || [],
          secrets: npcData.personality?.secrets || []
        },
        relationships: {
          allies: npcData.relationships?.allies || [],
          enemies: npcData.relationships?.enemies || [],
          family: npcData.relationships?.family || [],
          organizations: npcData.relationships?.organizations || []
        },
        history: {
          firstEncounter: new Date(),
          significantEvents: [],
          lastInteraction: new Date()
        },
        currentStatus: {
          location: npcData.currentStatus?.location || 'desconhecido',
          health: npcData.currentStatus?.health || 'good',
          mood: npcData.currentStatus?.mood || 'neutral',
          currentActivity: npcData.currentStatus?.currentActivity || 'ocioso'
        }
      }
      this.npcMemories.set(npcData.id, defaultNPC)
    }
  }

  getNPCMemory(npcId: string): NPCMemory | undefined {
    return this.npcMemories.get(npcId)
  }

  updateNPCAttitude(npcId: string, playerId: string, attitudeChange: number): void {
    const npc = this.npcMemories.get(npcId)
    if (npc) {
      const currentAttitude = npc.personality.attitudes[playerId] || 0
      npc.personality.attitudes[playerId] = Math.max(-100, Math.min(100, currentAttitude + attitudeChange))
    }
  }

  // === MEMÓRIA DE LOCAIS ===

  createOrUpdateLocation(locationData: Partial<LocationMemory> & { id: string }): void {
    const existing = this.locationMemories.get(locationData.id)

    if (existing) {
      this.locationMemories.set(locationData.id, {
        ...existing,
        ...locationData,
        significantEvents: [...existing.significantEvents, ...(locationData.significantEvents || [])],
        residentNPCs: [...new Set([...existing.residentNPCs, ...(locationData.residentNPCs || [])])]
      })
    } else {
      const defaultLocation: LocationMemory = {
        id: locationData.id,
        name: locationData.name || locationData.id,
        description: locationData.description || '',
        supernaturalPresence: locationData.supernaturalPresence || 0,
        significantEvents: locationData.significantEvents || [],
        residentNPCs: locationData.residentNPCs || [],
        hiddenSecrets: locationData.hiddenSecrets || [],
        atmosphere: locationData.atmosphere || 'peaceful',
        lastVisited: new Date(),
        visitCount: 1
      }
      this.locationMemories.set(locationData.id, defaultLocation)
    }
  }

  getLocationMemory(locationId: string): LocationMemory | undefined {
    const location = this.locationMemories.get(locationId)
    if (location) {
      // Atualizar última visita
      location.lastVisited = new Date()
      location.visitCount++
    }
    return location
  }

  increaseLocationSupernaturalPresence(locationId: string, amount: number): void {
    const location = this.locationMemories.get(locationId)
    if (location) {
      location.supernaturalPresence = Math.min(100, location.supernaturalPresence + amount)
    }
  }

  // === MÉTODOS DE CONSULTA ===

  getMemoriesByType(type: MemoryEntry['type'], limit = 20): MemoryEntry[] {
    return Array.from(this.memories.values())
      .filter(m => m.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  getConnectedMemories(memoryId: string): MemoryEntry[] {
    const memory = this.memories.get(memoryId)
    if (!memory) return []

    return memory.connections
      .map(id => this.memories.get(id))
      .filter(m => m !== undefined) as MemoryEntry[]
  }

  // Gera contexto narrativo baseado na memória
  generateNarrativeContext(currentLocation: string, playerId: string): string {
    const locationMemory = this.getLocationMemory(currentLocation)
    const relevantMemories = this.getRelevantMemories(['jogador', playerId, currentLocation], 5)
    const recentEvents = this.getMemoriesByType('event', 3)

    let context = `Contexto atual do mundo:\n`

    if (locationMemory) {
      context += `- Local: ${locationMemory.name} (${locationMemory.atmosphere}, presença sobrenatural: ${locationMemory.supernaturalPresence}%)\n`
      if (locationMemory.significantEvents.length > 0) {
        context += `- Eventos passados aqui: ${locationMemory.significantEvents.slice(-3).join(', ')}\n`
      }
    }

    if (recentEvents.length > 0) {
      context += `- Eventos recentes no mundo: ${recentEvents.map(e => e.content.title || e.content.description).join(', ')}\n`
    }

    if (relevantMemories.length > 0) {
      context += `- Memórias relevantes: ${relevantMemories.map(m => m.content.title || m.content.description || m.type).join(', ')}\n`
    }

    return context
  }

  // Salva/carrega estado da memória (para persistência)
  serialize(): string {
    return JSON.stringify({
      memories: Array.from(this.memories.entries()),
      npcMemories: Array.from(this.npcMemories.entries()),
      locationMemories: Array.from(this.locationMemories.entries())
    })
  }

  deserialize(data: string): void {
    try {
      const parsed = JSON.parse(data)
      this.memories = new Map(parsed.memories)
      this.npcMemories = new Map(parsed.npcMemories)
      this.locationMemories = new Map(parsed.locationMemories)

      // Converter timestamps de volta para Date objects
      for (const [id, memory] of this.memories) {
        memory.timestamp = new Date(memory.timestamp)
      }

      for (const [id, npc] of this.npcMemories) {
        npc.history.firstEncounter = new Date(npc.history.firstEncounter)
        npc.history.lastInteraction = new Date(npc.history.lastInteraction)
      }

      for (const [id, location] of this.locationMemories) {
        location.lastVisited = new Date(location.lastVisited)
      }
    } catch (error) {
      console.error('Erro ao desserializar memória do Game Master:', error)
    }
  }
}

export const gameMasterMemory = new GameMasterMemory()