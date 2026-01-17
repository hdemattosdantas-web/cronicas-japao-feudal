import { OpenAIService, openaiService } from '../ai/openai-service'
import { CreatureGenerator } from '../ai/creature-generator'
import { GameMasterPersonalityManager, personalityManager } from '../ai/game-master-personality'
import { GameMasterMemory, gameMasterMemory } from '../ai/game-master-memory'
import { CharacterEvolutionManager } from '../game/character-evolution'
import { getWorldManifestoPrompt, WORLD_MANIFESTO } from '../game/world-manifesto'
import { GameState, Scene, NPC, Item } from '../game/types'
import { CreatureEncounter, CreatureType } from '../game/creature-types'

export class GameMasterEngine {
  private ai: OpenAIService
  private creatureGenerator: CreatureGenerator
  private personalityManager: GameMasterPersonalityManager
  private memory: GameMasterMemory

  constructor() {
    this.ai = openaiService
    this.creatureGenerator = new CreatureGenerator()
    this.personalityManager = personalityManager
    this.memory = gameMasterMemory
  }

  async processPlayerAction(
    gameState: GameState,
    currentScene: Scene,
    action: string,
    choiceId?: string
  ): Promise<{
    narration: string
    mood: string
    newScene?: Scene
    events?: any[]
    npcResponses?: any[]
    encounters?: any[]
    attributeChanges?: Record<string, number>
    experience?: number
  }> {
    // Atualizar personalidade do mestre baseada no contexto
    this.personalityManager.adaptPersonality({
      playerLevel: gameState.level,
      recentChoices: gameState.choicesMade.slice(-5), // últimas 5 escolhas
      currentMood: 'mysterious', // TODO: implementar tracking de mood
      supernaturalEvents: gameState.choicesMade.filter(choice =>
        choice.includes('creature') || choice.includes('supernatural')
      ).length
    })

    // Construir contexto narrativo com memória
    const narrativeContext = this.memory.generateNarrativeContext(
      currentScene.location || 'desconhecido',
      gameState.characterId
    )

    // Contexto para a IA
    const context = {
      scene: currentScene,
      character: {
        name: 'Personagem', // TODO: Pegar do banco
        profession: 'Aventureiro', // TODO: Pegar do banco
        attributes: gameState.attributes
      },
      gameState,
      recentChoices: gameState.choicesMade.slice(-3),
      action,
      location: currentScene.location || 'Local misterioso',
      timeOfDay: currentScene.timeOfDay || 'dia',
      weather: currentScene.weather || 'claro',
      narrativeContext,
      personalityPrompt: this.personalityManager.generatePersonalityPrompt()
    }

    // Gerar narração com IA usando personalidade e memória
    const aiResponse = await this.generateIntelligentNarration(context)

    // Verificar se deve gerar um encontro com criatura baseado na personalidade
    const personality = this.personalityManager.getCurrentPersonality()
    const encounterChance = personality.encounterBias.mysterious * 0.4 + 0.1 // Base 10% + bias misterioso
    const shouldGenerateEncounter = Math.random() < encounterChance

    let encounter = null
    if (shouldGenerateEncounter) {
      try {
        encounter = await this.creatureGenerator.generateRandomEncounter(
          context.location,
          gameState.level > 5 ? 'experienced' : gameState.level > 10 ? 'veteran' : 'novice'
        )

        // Registrar encontro na memória
        this.memory.addMemory({
          type: 'creature',
          importance: encounter.danger === 'extreme' ? 'major' : encounter.danger === 'high' ? 'significant' : 'minor',
          content: {
            type: encounter.type,
            description: encounter.description,
            location: context.location,
            danger: encounter.danger
          },
          tags: ['criatura', encounter.type, context.location, encounter.danger],
          connections: [],
          consequences: ['Possível crescimento espiritual', 'Riscos desconhecidos']
        })
      } catch (error) {
        console.error('Erro ao gerar encontro com criatura:', error)
      }
    }

    // Processar mudanças nos atributos baseadas na escolha
    const attributeChanges: Record<string, number> = {}
    const choice = currentScene.choices.find(c => c.id === choiceId)
    if (choice?.consequences?.attributeChanges) {
      Object.entries(choice.consequences.attributeChanges).forEach(([attr, change]) => {
        attributeChanges[attr] = (attributeChanges[attr] || 0) + (change as number)
      })
    }

    // Calcular experiência
    const experience = choice?.consequences?.experience || Math.floor(Math.random() * 20) + 5

    // Registrar ação do jogador na memória
    this.memory.addMemory({
      type: 'player_action',
      importance: choice?.consequences?.experience && choice.consequences.experience > 50 ? 'significant' : 'minor',
      content: {
        action: action,
        choice: choiceId,
        location: context.location,
        consequences: attributeChanges
      },
      tags: ['jogador', gameState.characterId, context.location],
      connections: [],
      consequences: Object.keys(attributeChanges).length > 0 ? [`Mudanças em: ${Object.keys(attributeChanges).join(', ')}`] : []
    })

    return {
      narration: aiResponse.narration,
      mood: aiResponse.mood,
      events: aiResponse.events,
      encounters: encounter ? [encounter] : [],
      attributeChanges,
      experience
    }
  }

  private async generateIntelligentNarration(context: any): Promise<{
    narration: string
    mood: string
    suggestions?: string[]
    events?: string[]
  }> {
    const prompt = this.buildIntelligentPrompt(context)

    try {
      const response = await this.ai.getClient().chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é o Game Master em Mesa Feudal, um RPG narrativo no Japão feudal.

${getWorldManifestoPrompt()}

${context.personalityPrompt}

PRINCÍPIOS CORE DO MUNDO:
${WORLD_MANIFESTO.corePhilosophy}

${WORLD_MANIFESTO.humanCondition}

${WORLD_MANIFESTO.coreTruths}

IMPORTANTE SOBRE SUA FUNÇÃO:
- O mundo existe independentemente do jogador
- Sobrenatural é consequência, não espetáculo
- Conhecimento é perigoso, sobrevivência é mérito
- Ninguém escolhe ser especial - alguns apenas sobrevivem
- Mostre consequências através de detalhes mundanos
- Crie dúvida e ambiguidade
- Mantenha o mundo vivo e indiferente

${context.narrativeContext}

Retorne apenas JSON válido.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      })

      const content = response.choices[0]?.message?.content || '{}'
      return this.parseNarrationResponse(content)
    } catch (error) {
      console.error('Erro na geração inteligente de narração:', error)
      return {
        narration: 'O mundo permanece em silêncio contemplativo...',
        mood: 'mysterious'
      }
    }
  }

  private buildIntelligentPrompt(context: any): string {
    const personality = this.personalityManager.getCurrentPersonality()

    return `Como ${personality.name}, gere uma narração para esta situação:

JOGADOR:
- Nível: ${context.gameState.level}
- Atributos: ${JSON.stringify(context.character.attributes)}
- Escolhas recentes: ${context.recentChoices.join(', ')}

CENA ATUAL:
- Local: ${context.location} (${context.timeOfDay}, ${context.weather})
- Descrição: ${context.scene.description || 'Cena atual'}
- Ação tomada: "${context.action}"

CONTEXTO NARRATIVO:
${context.narrativeContext}

INSTRUÇÕES PARA SUA PERSONALIDADE:
${personality.narrativeStyle}

Gere uma narração que:
1. Mantenha o tom da sua personalidade atual
2. Considere o contexto histórico fornecido
3. Introduza elementos sobrenaturais de forma sutil
4. Mostre consequências das ações do jogador
5. Crie antecipação para eventos futuros

Retorne JSON:
{
  "narration": "narracao imersiva em português",
  "mood": "peaceful|tense|mysterious|dramatic|hopeful",
  "suggestions": ["dica opcional sobre próximos passos"],
  "events": ["evento que pode acontecer em breve"]
}`
  }

  private parseNarrationResponse(content: string): any {
    try {
      return JSON.parse(content)
    } catch {
      // Fallback se não conseguir parsear JSON
      return {
        narration: content,
        mood: 'mysterious' as const,
        suggestions: [],
        events: []
      }
    }
  }

  async generateNPCResponse(
    npc: NPC,
    playerAction: string,
    context: {
      location: string
      timeOfDay: string
      weather: string
      gameState: GameState
    }
  ): Promise<{
    response: string
    attitude: string
    offers: string[]
    hints: string[]
  }> {
    // Obter memória do NPC se existir
    const npcMemory = this.memory.getNPCMemory(npc.id)

    // Atualizar ou criar memória do NPC
    this.memory.createOrUpdateNPC({
      id: npc.id,
      name: npc.name,
      currentStatus: {
        location: context.location,
        health: 'good',
        mood: 'neutral',
        currentActivity: 'interagindo'
      }
    })

    // Atualizar atitude baseada na ação do jogador
    const attitudeChange = this.calculateAttitudeChange(playerAction, npcMemory)
    this.memory.updateNPCAttitude(npc.id, context.gameState.characterId, attitudeChange)

    // Gerar resposta inteligente considerando personalidade do mestre
    return await this.generateIntelligentNPCResponse(npc, playerAction, context, npcMemory)
  }

  private calculateAttitudeChange(action: string, npcMemory?: any): number {
    let change = 0

    // Ações positivas
    if (action.includes('ajudar') || action.includes('respeitar') || action.includes('presentear')) {
      change += 5
    }

    // Ações negativas
    if (action.includes('atacar') || action.includes('roubar') || action.includes('insultar')) {
      change -= 10
    }

    // Considerar atitude atual (NPCs com atitude baixa são mais difíceis de agradar)
    if (npcMemory) {
      const currentAttitude = npcMemory.personality.attitudes['player'] || 0
      if (currentAttitude < -50) {
        change = Math.floor(change * 0.5) // Menos impacto se já hostil
      }
    }

    return change
  }

  private async generateIntelligentNPCResponse(
    npc: NPC,
    playerAction: string,
    context: any,
    npcMemory?: any
  ): Promise<{
    response: string
    attitude: string
    offers: string[]
    hints: string[]
  }> {
    const personality = this.personalityManager.getCurrentPersonality()
    const currentAttitude = npcMemory?.personality.attitudes[context.gameState.characterId] || 0

    const prompt = `Como ${personality.name}, gere uma resposta para este NPC:

NPC: ${npc.name} (${npc.profession || 'desconhecido'})
Personalidade do NPC: ${JSON.stringify(npcMemory?.personality || { traits: ['misterioso'], motivations: ['sobrevivência'] })}
Atitude atual com o jogador: ${currentAttitude} (-100 a +100)

AÇÃO DO JOGADOR: "${playerAction}"

CONTEXTO:
- Local: ${context.location} (${context.timeOfDay})
- Personalidade do Mestre: ${personality.traits.join(', ')}
- Estilo narrativo: ${personality.narrativeStyle}

O NPC deve:
1. Ter personalidade consistente e própria
2. Reagir baseado na atitude atual
3. Possuir segredos e motivações
4. Oferecer quests, informações ou itens quando apropriado
5. Manter o tom misterioso do Japão feudal

Retorne JSON:
{
  "response": "resposta do NPC em português",
  "attitude": "friendly|neutral|hostile|mysterious",
  "offers": ["oferta1 - se apropriado"],
  "hints": ["dica sutil sobre lore ou quests"]
}`

    try {
      const response = await this.ai.getClient().chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content || '{}'
      return JSON.parse(content)
    } catch (error) {
      console.error('Erro na geração de resposta NPC inteligente:', error)
      return {
        response: '...O NPC observa você com olhos misteriosos...',
        attitude: 'mysterious',
        offers: [],
        hints: []
      }
    }
  }

  async generateRandomEvent(
    location: string,
    playerLevel: number,
    gameState: GameState
  ): Promise<{
    type: string
    title: string
    description: string
    choices: any[]
    danger: string
    creatureData?: CreatureEncounter
  } | null> {
    // 20% de chance de evento aleatório com criatura
    if (Math.random() > 0.2) return null

    try {
      const creatureEncounter = await this.creatureGenerator.generateRandomEncounter(
        location,
        playerLevel > 5 ? 'experienced' : playerLevel > 10 ? 'veteran' : 'novice'
      )

      return {
        type: 'creature_encounter',
        title: this.getCreatureEncounterTitle(creatureEncounter.danger),
        description: creatureEncounter.description,
        choices: this.generateCreatureChoices(creatureEncounter),
        danger: creatureEncounter.danger,
        creatureData: creatureEncounter
      }
    } catch (error) {
      console.error('Erro ao gerar evento com criatura:', error)
      return null
    }
  }

  private getEncounterTitle(type: string): string {
    const titles = {
      creature: 'Criatura Misteriosa',
      npc: 'Encontro Inesperado',
      event: 'Evento Sobrenatural',
      treasure: 'Descoberta Antiga'
    }
    return titles[type as keyof typeof titles] || 'Evento Misterioso'
  }

  private getCreatureEncounterTitle(danger: string): string {
    const titles = {
      low: 'Observação Estranha',
      medium: 'Incidente Inquietante',
      high: 'Perturbação Perigosa',
      extreme: 'Crise Sobrenatural'
    }
    return titles[danger as keyof typeof titles] || 'Encontro Misterioso'
  }

  private generateCreatureChoices(creature: CreatureEncounter): any[] {
    const choices = []

    // Opções pacíficas
    if (creature.resolutionOptions.peaceful.length > 0) {
      choices.push({
        id: 'creature_peaceful',
        text: creature.resolutionOptions.peaceful[0] || 'Observar com respeito',
        type: 'peaceful',
        nextSceneId: 'continue_adventure'
      })
    }

    // Opções de confronto
    if (creature.resolutionOptions.confrontational.length > 0) {
      choices.push({
        id: 'creature_confront',
        text: creature.resolutionOptions.confrontational[0] || 'Investigar diretamente',
        type: 'confrontational',
        nextSceneId: 'continue_adventure'
      })
    }

    // Opções de evasão
    if (creature.resolutionOptions.avoidance.length > 0) {
      choices.push({
        id: 'creature_avoid',
        text: creature.resolutionOptions.avoidance[0] || 'Partir discretamente',
        type: 'avoidance',
        nextSceneId: 'continue_adventure'
      })
    }

    // Sempre ter pelo menos uma opção de observação
    if (choices.length === 0) {
      choices.push({
        id: 'creature_observe',
        text: 'Observar atentamente o que acontece',
        type: 'observation',
        nextSceneId: 'continue_adventure'
      })
    }

    return choices
  }

  async adaptWorldToPlayer(
    gameState: GameState,
    playerChoices: string[]
  ): Promise<{
    worldChanges: string[]
    newQuests: any[]
    reputationChanges: Record<string, number>
  }> {
    // A IA analisa as escolhas do jogador e adapta o mundo
    // Isso cria uma experiência única para cada jogador

    const adaptations: {
      worldChanges: string[]
      newQuests: any[]
      reputationChanges: Record<string, number>
    } = {
      worldChanges: [],
      newQuests: [],
      reputationChanges: {}
    }

    // Exemplo: Jogadores agressivos podem ter mais encontros hostis
    const aggressiveChoices = playerChoices.filter(choice =>
      choice.toLowerCase().includes('atacar') ||
      choice.toLowerCase().includes('lutar')
    )

    if (aggressiveChoices.length > 3) {
      adaptations.worldChanges.push('Rumores de um guerreiro perigoso se espalham pelas vilas')
      adaptations.reputationChanges['vilas'] = -5
    }

    // Exemplo: Jogadores curiosos descobrem mais segredos
    const curiousChoices = playerChoices.filter(choice =>
      choice.toLowerCase().includes('investigar') ||
      choice.toLowerCase().includes('explorar')
    )

    if (curiousChoices.length > 2) {
      adaptations.newQuests.push({
        id: 'mystery_investigation',
        title: 'O Investigador',
        description: 'Um monge ouviu falar de sua curiosidade e quer sua ajuda em um mistério antigo.'
      })
    }

    return adaptations
  }

  // Método para gerar missões dinâmicas
  async generateDynamicQuest(
    playerLevel: number,
    location: string,
    playerBackground: string
  ): Promise<{
    id: string
    title: string
    description: string
    objectives: string[]
    rewards: any
  }> {
    return await openaiService.generateDynamicQuest(playerLevel, location, playerBackground)
  }

  /**
   * Gera um encontro com criatura específico baseado no progresso espiritual
   * Jogadores com mais percepção espiritual encontram criaturas mais reveladoras
   */
  async generateTargetedCreatureEncounter(
    gameState: GameState,
    context: {
      location: string
      timeOfDay: string
      recentEvents?: string[]
      playerChoices?: string[]
    }
  ): Promise<CreatureEncounter | null> {
    // Calcular nível de percepção espiritual baseado nos atributos
    const perception = gameState.attributes.percepção || 5
    const willpower = gameState.attributes.vontade || 5
    const spiritualAwareness = Math.floor((perception + willpower) / 2)

    // Chances de encontros baseadas na percepção espiritual
    const encounterChance = Math.min(0.8, spiritualAwareness / 20) // Máximo 80% de chance

    if (Math.random() > encounterChance) return null

    try {
      // Selecionar tipo baseado na percepção espiritual
      let targetType: CreatureType

      if (spiritualAwareness < 7) {
        // Baixa percepção: criaturas sutis
        targetType = Math.random() < 0.5 ? CreatureType.KAMI_MENORES : CreatureType.TSUKUMOGAMI
      } else if (spiritualAwareness < 10) {
        // Média percepção: criaturas emocionais
        targetType = Math.random() < 0.5 ? CreatureType.YUREI : CreatureType.MONONOKE
      } else if (spiritualAwareness < 13) {
        // Alta percepção: criaturas transformadoras
        targetType = Math.random() < 0.5 ? CreatureType.SUBSTITUTOS : CreatureType.GHOULS
      } else {
        // Percepção muito alta: criaturas alienígenas
        targetType = Math.random() < 0.5 ? CreatureType.ENTIDADES_CONTATO : CreatureType.YOKAI_TRADICIONAIS
      }

      return await this.creatureGenerator.generateCreatureEncounter(targetType, {
        location: context.location,
        timeOfDay: context.timeOfDay,
        playerBackground: `Jogador com percepção espiritual ${spiritualAwareness}/20`,
        recentEvents: context.recentEvents,
        currentSeason: this.getCurrentSeason()
      })
    } catch (error) {
      console.error('Erro ao gerar encontro direcionado:', error)
      return null
    }
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'primavera'
    if (month >= 5 && month <= 7) return 'verão'
    if (month >= 8 && month <= 10) return 'outono'
    return 'inverno'
  }

  // Processar resolução de encontro com criatura e registrar evolução
  processCreatureResolution(
    creatureEncounter: CreatureEncounter,
    resolutionType: 'peaceful' | 'confrontational' | 'avoidance' | 'observe',
    characterEvolution: CharacterEvolutionManager,
    success: boolean = true
  ): void {
    // Registrar encontro na evolução do personagem
    characterEvolution.recordCreatureEncounter(
      creatureEncounter.type,
      success,
      `Resolução ${resolutionType} de encontro com ${creatureEncounter.type}`,
      success ? this.generateCreaturePower(creatureEncounter.type, resolutionType) : undefined
    )
  }

  // Gerar poder baseado no tipo de criatura e resolução
  private generateCreaturePower(
    creatureType: CreatureType,
    resolutionType: string
  ): string {
    const powers: Record<CreatureType, Record<string, string>> = {
      [CreatureType.SUBSTITUTOS]: {
        peaceful: 'Capacidade de detectar impostores',
        confrontational: 'Resistência a ilusões',
        avoidance: 'Instinto de perigo aprimorado',
        observe: 'Visão espiritual temporária'
      },
      [CreatureType.ENTIDADES_CONTATO]: {
        peaceful: 'Comunicação com entidades',
        confrontational: 'Proteção contra invasões',
        avoidance: 'Detecção de anomalias',
        observe: 'Clarividência passageira'
      },
      [CreatureType.GHOULS]: {
        peaceful: 'Controle sobre a fome',
        confrontational: 'Força regenerativa',
        avoidance: 'Resistência a toxinas',
        observe: 'Percepção de intenções'
      },
      [CreatureType.YOKAI_TRADICIONAIS]: {
        peaceful: 'Diplomacia espiritual',
        confrontational: 'Poderes elementais',
        avoidance: 'Invisibilidade natural',
        observe: 'Compreensão de idiomas antigos'
      },
      [CreatureType.YUREI]: {
        peaceful: 'Compaixão pelos mortos',
        confrontational: 'Exorcismo básico',
        avoidance: 'Proteção contra assombrações',
        observe: 'Visão do outro lado'
      },
      [CreatureType.MONONOKE]: {
        peaceful: 'Harmonização emocional',
        confrontational: 'Manipulação de emoções',
        avoidance: 'Imunidade a maldições',
        observe: 'Leitura de auras emocionais'
      },
      [CreatureType.KAMI_MENORES]: {
        peaceful: 'Comunhão com a natureza',
        confrontational: 'Controle elemental',
        avoidance: 'Camuflagem natural',
        observe: 'Comunicação com animais'
      },
      [CreatureType.TSUKUMOGAMI]: {
        peaceful: 'Preservação de objetos',
        confrontational: 'Animação de objetos',
        avoidance: 'Detecção de itens encantados',
        observe: 'Memória de objetos'
      }
    }

    return powers[creatureType]?.[resolutionType] || 'Poder espiritual menor'
  }

  // Método para inicializar memória com dados básicos do jogo
  initializeMemory(): void {
    // NPCs importantes
    this.memory.createOrUpdateNPC({
      id: 'old_monk_hidetaka',
      name: 'Monge Hidetaka',
      personality: {
        traits: ['Sábio', 'Contemplativo', 'Misterioso'],
        attitudes: {},
        motivations: ['Preservar conhecimento antigo', 'Guiar almas perdidas'],
        secrets: ['Conhece rituais proibidos', 'Foi testemunha de eventos sobrenaturais']
      },
      currentStatus: {
        location: 'templo_antigo',
        health: 'good',
        mood: 'mysterious',
        currentActivity: 'meditando'
      }
    })

    // Locais importantes
    this.memory.createOrUpdateLocation({
      id: 'owari_village',
      name: 'Aldeia de Owari',
      description: 'Uma aldeia pacífica nas planícies de Owari',
      supernaturalPresence: 15,
      atmosphere: 'peaceful',
      significantEvents: ['Fundação da aldeia há 200 anos'],
      residentNPCs: ['old_monk_hidetaka', 'village_elder']
    })

    // Eventos importantes
    this.memory.addMemory({
      type: 'event',
      importance: 'legendary',
      content: {
        title: 'A Maldição do Samurai Traidor',
        description: 'Há séculos, um samurai traiu seu senhor e foi amaldiçoado a vagar eternamente'
      },
      tags: ['maldição', 'samurai', 'traição', 'lendário'],
      connections: [],
      consequences: ['Espíritos inquietos', 'Avisos para traidores']
    })
  }
}

export const gameMaster = new GameMasterEngine()
// Inicializar memória na criação
gameMaster.initializeMemory()