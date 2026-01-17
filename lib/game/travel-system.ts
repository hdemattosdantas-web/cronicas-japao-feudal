// Sistema de Viagem Narrativa - Crônicas do Japão Feudal

import { MapLocation, JAPAN_FEUDAL_MAP } from './map-coordinates'

export enum TravelMethod {
  WALKING = 'walking',
  HORSE = 'horse',
  CART = 'cart',
  BOAT = 'boat'
}

export enum TravelCondition {
  CLEAR = 'clear',
  RAIN = 'rain',
  SNOW = 'snow',
  STORM = 'storm',
  FOG = 'fog'
}

export interface TravelRoute {
  from: string
  to: string
  distance: number // em km
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
  terrain: 'road' | 'mountain' | 'forest' | 'river' | 'coastal'
  typicalDuration: {
    walking: number // dias
    horse: number
    cart: number
    boat?: number
  }
  waypoints: string[]
  dangers: string[]
  landmarks: string[]
}

export interface TravelEvent {
  id: string
  type: 'encounter' | 'weather' | 'fatigue' | 'discovery' | 'rest'
  title: string
  description: string
  choices: Array<{
    text: string
    consequences: {
      timeCost: number
      healthCost?: number
      resourceCost?: Record<string, number>
      rewards?: Record<string, any>
      nextEvent?: string
    }
  }>
}

export interface ActiveTravel {
  characterId: string
  fromLocation: string
  toLocation: string
  currentPosition: number // 0-100, progresso da viagem
  method: TravelMethod
  condition: TravelCondition
  daysElapsed: number
  totalDays: number
  currentEvent?: TravelEvent
  fatigue: number // 0-100
  supplies: {
    food: number
    water: number
    medicine: number
  }
  waypointsPassed: string[]
}

export class TravelSystem {
  private routes: Map<string, TravelRoute> = new Map()
  private activeTravels: Map<string, ActiveTravel> = new Map()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // Rotas principais do Japão feudal
    const routes: TravelRoute[] = [
      // Rota da Estrada de Nagoya
      {
        from: 'owari_village',
        to: 'kiyosu_town',
        distance: 15,
        difficulty: 'easy',
        terrain: 'road',
        typicalDuration: { walking: 1, horse: 1, cart: 1 },
        waypoints: ['Ponte do Rio Kiso'],
        dangers: ['Bandidos', 'Terreno irregular'],
        landmarks: ['Campos de arroz dourados', 'Templo rural antigo']
      },
      {
        from: 'kiyosu_town',
        to: 'nagoya',
        distance: 12,
        difficulty: 'easy',
        terrain: 'road',
        typicalDuration: { walking: 1, horse: 1, cart: 1 },
        waypoints: ['Porto fluvial'],
        dangers: ['Ladinos urbanos'],
        landmarks: ['Mercado movimentado', 'Castelo imponente']
      },
      {
        from: 'nagoya',
        to: 'gifu',
        distance: 20,
        difficulty: 'moderate',
        terrain: 'road',
        typicalDuration: { walking: 2, horse: 1, cart: 2 },
        waypoints: ['Rio Nagara'],
        dangers: ['Travessia perigosa', 'Terreno montanhoso'],
        landmarks: ['Cachoeiras majestosas', 'Floresta densa']
      },
      // Rota Nakasendō (Estrada Central)
      {
        from: 'nagoya',
        to: 'matsumoto',
        distance: 150,
        difficulty: 'hard',
        terrain: 'mountain',
        typicalDuration: { walking: 12, horse: 8, cart: 15 },
        waypoints: ['Posto de Magome', 'Posto de Tsumago', 'Passe Kiso'],
        dangers: ['Montanhas íngremes', 'Neve precoce', 'Bandidos', 'Criaturas das montanhas'],
        landmarks: ['Vales profundos', 'Templos isolados', 'Picos nevados']
      },
      // Rota para Kai
      {
        from: 'kiyosu_town',
        to: 'kofu',
        distance: 80,
        difficulty: 'moderate',
        terrain: 'mountain',
        typicalDuration: { walking: 7, horse: 5, cart: 10 },
        waypoints: ['Passe Ashigara'],
        dangers: ['Montanhas', 'Tempo imprevisível'],
        landmarks: ['Vinhedos', 'Castelos de montanha']
      },
      // Grandes rotas
      {
        from: 'edo',
        to: 'kyoto',
        distance: 450,
        difficulty: 'hard',
        terrain: 'road',
        typicalDuration: { walking: 35, horse: 20, cart: 40 },
        waypoints: ['Hakone', 'Hamamatsu', 'Nagoya', 'Ōtsu'],
        dangers: ['Longa jornada', 'Bandidos', 'Doenças', 'Criaturas'],
        landmarks: ['Lago Hakone', 'Tokaido Road', 'Templos antigos']
      }
    ]

    routes.forEach(route => {
      const key = `${route.from}-${route.to}`
      this.routes.set(key, route)
    })
  }

  // Iniciar viagem
  startTravel(
    characterId: string,
    fromLocationId: string,
    toLocationId: string,
    method: TravelMethod = TravelMethod.WALKING
  ): ActiveTravel {
    const routeKey = `${fromLocationId}-${toLocationId}`
    let route = this.routes.get(routeKey)

    // Se não existe rota direta, criar uma baseada na distância
    if (!route) {
      const fromLoc = JAPAN_FEUDAL_MAP[fromLocationId]
      const toLoc = JAPAN_FEUDAL_MAP[toLocationId]

      if (fromLoc && toLoc) {
        const distance = this.calculateDistance(fromLoc.coordinates, toLoc.coordinates)
        route = this.createDynamicRoute(fromLocationId, toLocationId, distance)
        this.routes.set(routeKey, route)
      } else {
        throw new Error('Locais não encontrados')
      }
    }

    const totalDays = route.typicalDuration[method] || route.typicalDuration.walking

    const travel: ActiveTravel = {
      characterId,
      fromLocation: fromLocationId,
      toLocation: toLocationId,
      currentPosition: 0,
      method,
      condition: this.getRandomCondition(),
      daysElapsed: 0,
      totalDays,
      fatigue: 0,
      supplies: {
        food: 10, // dias de comida
        water: 10,
        medicine: 3
      },
      waypointsPassed: []
    }

    this.activeTravels.set(characterId, travel)
    return travel
  }

  // Progresso da viagem (chamado diariamente)
  progressTravel(characterId: string): {
    travel: ActiveTravel
    events: TravelEvent[]
    completed: boolean
  } {
    const travel = this.activeTravels.get(characterId)
    if (!travel) {
      throw new Error('Viagem não encontrada')
    }

    const events: TravelEvent[] = []
    travel.daysElapsed++

    // Calcular progresso baseado no método e condições
    const baseProgress = 100 / travel.totalDays
    let actualProgress = baseProgress

    // Modificadores baseados no método
    switch (travel.method) {
      case TravelMethod.HORSE:
        actualProgress *= 1.5
        break
      case TravelMethod.CART:
        actualProgress *= 0.8
        break
      case TravelMethod.BOAT:
        actualProgress *= 2.0
        break
    }

    // Modificadores baseados nas condições
    switch (travel.condition) {
      case TravelCondition.RAIN:
        actualProgress *= 0.7
        break
      case TravelCondition.SNOW:
        actualProgress *= 0.5
        break
      case TravelCondition.STORM:
        actualProgress *= 0.3
        break
      case TravelCondition.FOG:
        actualProgress *= 0.8
        break
    }

    travel.currentPosition = Math.min(100, travel.currentPosition + actualProgress)

    // Aumentar fadiga
    travel.fatigue += this.getFatigueIncrease(travel.method, travel.condition)

    // Consumir suprimentos
    travel.supplies.food -= this.getSupplyConsumption('food', travel.method)
    travel.supplies.water -= this.getSupplyConsumption('water', travel.method)

    // Gerar eventos aleatórios
    const randomEvents = this.generateRandomEvents(travel)
    events.push(...randomEvents)

    // Verificar se completou
    const completed = travel.currentPosition >= 100

    if (completed) {
      this.activeTravels.delete(characterId)
    }

    return { travel, events, completed }
  }

  // Gerar eventos aleatórios durante viagem
  private generateRandomEvents(travel: ActiveTravel): TravelEvent[] {
    const events: TravelEvent[] = []
    const eventChance = Math.random()

    if (eventChance < 0.3) { // 30% chance de evento
      const eventType = this.getRandomEventType(travel)

      switch (eventType) {
        case 'weather':
          events.push(this.generateWeatherEvent(travel))
          break
        case 'encounter':
          events.push(this.generateEncounterEvent(travel))
          break
        case 'fatigue':
          events.push(this.generateFatigueEvent(travel))
          break
        case 'discovery':
          events.push(this.generateDiscoveryEvent(travel))
          break
        case 'rest':
          events.push(this.generateRestEvent(travel))
          break
      }
    }

    return events
  }

  private getRandomEventType(travel: ActiveTravel): string {
    const types = ['weather', 'encounter', 'fatigue', 'discovery', 'rest']
    return types[Math.floor(Math.random() * types.length)]
  }

  private generateWeatherEvent(travel: ActiveTravel): TravelEvent {
    const weatherEvents = [
      {
        title: 'Chuva Forte',
        description: 'Uma tempestade repentina cai sobre o grupo, tornando o caminho lamacento e perigoso.',
        choices: [
          {
            text: 'Buscar abrigo',
            consequences: { timeCost: 1, healthCost: 0 }
          },
          {
            text: 'Continuar apesar da chuva',
            consequences: { timeCost: 0, healthCost: 5 }
          }
        ]
      },
      {
        title: 'Nevoeiro Denso',
        description: 'Um nevoeiro espesso reduz a visibilidade, tornando fácil se perder.',
        choices: [
          {
            text: 'Esperar o nevoeiro passar',
            consequences: { timeCost: 1 }
          },
          {
            text: 'Usar bússola e continuar',
            consequences: { timeCost: 0 }
          }
        ]
      }
    ]

    return {
      id: `weather_${Date.now()}`,
      type: 'weather',
      ...weatherEvents[Math.floor(Math.random() * weatherEvents.length)]
    }
  }

  private generateEncounterEvent(travel: ActiveTravel): TravelEvent {
    const encounterEvents = [
      {
        title: 'Bandidos na Estrada',
        description: 'Um grupo de bandidos bloqueia o caminho, exigindo tributo.',
        choices: [
          {
            text: 'Lutar contra eles',
            consequences: { timeCost: 0, healthCost: 10 }
          },
          {
            text: 'Pagar tributo',
            consequences: { timeCost: 0, resourceCost: { gold: 50 } }
          },
          {
            text: 'Tentar escapar',
            consequences: { timeCost: 1 }
          }
        ]
      },
      {
        title: 'Viajante Ferido',
        description: 'Encontram um viajante ferido caído à beira da estrada.',
        choices: [
          {
            text: 'Ajudar o viajante',
            consequences: { timeCost: 1, resourceCost: { medicine: 1 } }
          },
          {
            text: 'Ignorar e continuar',
            consequences: { timeCost: 0 }
          }
        ]
      }
    ]

    return {
      id: `encounter_${Date.now()}`,
      type: 'encounter',
      ...encounterEvents[Math.floor(Math.random() * encounterEvents.length)]
    }
  }

  private generateFatigueEvent(travel: ActiveTravel): TravelEvent {
    return {
      id: `fatigue_${Date.now()}`,
      type: 'fatigue',
      title: 'Fadiga da Jornada',
      description: 'A longa viagem está cobrando seu preço. O grupo está exausto.',
      choices: [
        {
          text: 'Descansar um dia',
          consequences: { timeCost: 1 }
        },
        {
          text: 'Continuar apesar do cansaço',
          consequences: { timeCost: 0, healthCost: 3 }
        },
        {
          text: 'Usar medicina',
          consequences: { timeCost: 0, resourceCost: { medicine: 1 } }
        }
      ]
    }
  }

  private generateDiscoveryEvent(travel: ActiveTravel): TravelEvent {
    const discoveries = [
      'Uma cachoeira escondida com água cristalina',
      'Ruínas antigas parcialmente enterradas',
      'Uma clareira com flores luminosas',
      'Pegadas estranhas que não parecem humanas',
      'Um templo abandonado com artefatos antigos'
    ]

    const discovery = discoveries[Math.floor(Math.random() * discoveries.length)]

    return {
      id: `discovery_${Date.now()}`,
      type: 'discovery',
      title: 'Descoberta Inesperada',
      description: `Durante a viagem, o grupo descobre: ${discovery}`,
      choices: [
        {
          text: 'Investigar a descoberta',
          consequences: { timeCost: 2, rewards: { lore: 1 } }
        },
        {
          text: 'Registrar e continuar',
          consequences: { timeCost: 0, rewards: { experience: 10 } }
        }
      ]
    }
  }

  private generateRestEvent(travel: ActiveTravel): TravelEvent {
    return {
      id: `rest_${Date.now()}`,
      type: 'rest',
      title: 'Oportunidade de Descanso',
      description: 'Encontram um local adequado para descansar e recuperar forças.',
      choices: [
        {
          text: 'Descansar completamente (1 dia)',
          consequences: { timeCost: 1 }
        },
        {
          text: 'Descanso rápido (meio dia)',
          consequences: { timeCost: 0.5 }
        },
        {
          text: 'Continuar viagem',
          consequences: { timeCost: 0 }
        }
      ]
    }
  }

  // Utilitários
  private calculateDistance(coord1: { x: number, y: number }, coord2: { x: number, y: number }): number {
    const dx = coord1.x - coord2.x
    const dy = coord1.y - coord2.y
    return Math.sqrt(dx * dx + dy * dy) * 10 // Converter para km aproximado
  }

  private createDynamicRoute(fromId: string, toId: string, distance: number): TravelRoute {
    const difficulty = distance > 100 ? 'extreme' : distance > 50 ? 'hard' : distance > 25 ? 'moderate' : 'easy'
    const terrain: 'road' | 'mountain' | 'forest' | 'river' | 'coastal' = 'road'

    return {
      from: fromId,
      to: toId,
      distance,
      difficulty,
      terrain,
      typicalDuration: {
        walking: Math.ceil(distance / 20),
        horse: Math.ceil(distance / 40),
        cart: Math.ceil(distance / 15)
      },
      waypoints: [],
      dangers: ['Estrada desconhecida', 'Possíveis bandidos'],
      landmarks: ['Terrenos variados', 'Vilarejos esparsos']
    }
  }

  private getRandomCondition(): TravelCondition {
    const conditions: TravelCondition[] = [TravelCondition.CLEAR, TravelCondition.CLEAR, TravelCondition.CLEAR, TravelCondition.RAIN, TravelCondition.FOG, TravelCondition.SNOW]
    return conditions[Math.floor(Math.random() * conditions.length)]
  }

  private getFatigueIncrease(method: TravelMethod, condition: TravelCondition): number {
    let fatigue = 5 // Base

    // Método afeta fadiga
    switch (method) {
      case TravelMethod.WALKING:
        fatigue += 3
        break
      case TravelMethod.HORSE:
        fatigue += 1
        break
      case TravelMethod.CART:
        fatigue += 2
        break
      case TravelMethod.BOAT:
        fatigue -= 2
        break
    }

    // Condições afetam fadiga
    switch (condition) {
      case TravelCondition.RAIN:
        fatigue += 2
        break
      case TravelCondition.SNOW:
        fatigue += 3
        break
      case TravelCondition.STORM:
        fatigue += 5
        break
    }

    return fatigue
  }

  private getSupplyConsumption(resource: 'food' | 'water', method: TravelMethod): number {
    const baseConsumption = { food: 1, water: 1 }

    switch (method) {
      case TravelMethod.WALKING:
        return baseConsumption[resource] * 1.5
      case TravelMethod.HORSE:
        return baseConsumption[resource] * 1.2
      case TravelMethod.CART:
        return baseConsumption[resource] * 1.8
      case TravelMethod.BOAT:
        return baseConsumption[resource] * 0.5
      default:
        return baseConsumption[resource]
    }
  }

  // Métodos públicos
  getActiveTravel(characterId: string): ActiveTravel | undefined {
    return this.activeTravels.get(characterId)
  }

  getRoute(fromId: string, toId: string): TravelRoute | undefined {
    return this.routes.get(`${fromId}-${toId}`)
  }

  getAvailableRoutes(fromId: string): TravelRoute[] {
    return Array.from(this.routes.values()).filter(route => route.from === fromId)
  }
}

export const travelSystem = new TravelSystem()