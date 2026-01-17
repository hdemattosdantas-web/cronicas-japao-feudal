import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { GameState } from '@/lib/game/types'
import { gameMaster } from '@/lib/game-master/engine'
import { CreatureEncounter } from '@/lib/game/creature-types'

const GAME_STATES_DIR = path.join(process.cwd(), 'data', 'game-states')

async function ensureDataDirectory() {
  try {
    await fs.access(GAME_STATES_DIR)
  } catch {
    await fs.mkdir(GAME_STATES_DIR, { recursive: true })
  }
}

async function loadGameState(userEmail: string, characterId: string): Promise<GameState | null> {
  try {
    await ensureDataDirectory()
    const statePath = path.join(GAME_STATES_DIR, `${userEmail}_${characterId}.json`)
    const data = await fs.readFile(statePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

async function saveGameState(gameState: GameState): Promise<void> {
  try {
    await ensureDataDirectory()
    const statePath = path.join(GAME_STATES_DIR, `${gameState.characterId}.json`)

    const updatedState = {
      ...gameState,
      updatedAt: new Date().toISOString()
    }

    await fs.writeFile(statePath, JSON.stringify(updatedState, null, 2))
  } catch (error) {
    console.error('Erro ao salvar estado do jogo:', error)
    throw error
  }
}

async function startCampaign(userEmail: string, characterId: string, campaignId: string): Promise<GameState> {
  // Carregar campanha para obter startingSceneId
  const campaignResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/campaigns/${campaignId}`)
  if (!campaignResponse.ok) {
    throw new Error('Campanha não encontrada')
  }
  const campaign = await campaignResponse.json()

  // Atributos base (simplificado - em produção viria da API de personagens)
  const baseAttributes = {
    corpo: 5, força: 5, agilidade: 5, percepção: 5, intelecto: 5, vontade: 5
  }

  const gameState: GameState = {
    campaignId,
    characterId,
    currentSceneId: campaign.startingSceneId,
    visitedScenes: [],
    choicesMade: [],
    inventory: [],
    attributes: baseAttributes,
    experience: 0,
    level: 1,
    health: 100,
    maxHealth: 100,
    completedCampaigns: [],
    activeQuests: [],
    discoveredLocations: [],
    reputation: {},
    flags: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await saveGameState(gameState)
  return gameState
}

async function makeChoice(userEmail: string, characterId: string, choiceId: string) {
  const gameState = await loadGameState(userEmail, characterId)
  if (!gameState) {
    throw new Error('Estado do jogo não encontrado')
  }

  // Carregar cena atual
  const sceneResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/campaigns/${gameState.campaignId}?scene=${gameState.currentSceneId}`)
  if (!sceneResponse.ok) {
    throw new Error('Cena não encontrada')
  }
  const scene = await sceneResponse.json()

  const choice = scene.choices.find((c: any) => c.id === choiceId)
  if (!choice) {
    throw new Error('Escolha não encontrada')
  }

  // Aplicar consequências
  if (choice.consequences) {
    if (choice.consequences.attributeChanges) {
      Object.entries(choice.consequences.attributeChanges).forEach(([attr, change]) => {
        gameState.attributes[attr] = (gameState.attributes[attr] || 0) + (change as number)
      })
    }

    if (choice.consequences.experience) {
      gameState.experience += choice.consequences.experience
    }

    if (choice.consequences.health) {
      gameState.health = Math.max(0, Math.min(gameState.maxHealth, gameState.health + choice.consequences.health))
    }
  }

  // Atualizar estado
  gameState.choicesMade.push(choiceId)
  gameState.visitedScenes.push(gameState.currentSceneId)
  gameState.currentSceneId = choice.nextSceneId
  gameState.updatedAt = new Date().toISOString()

  // Verificar se campanha terminou
  if (choice.nextSceneId === 'end_campaign') {
    gameState.completedCampaigns.push(gameState.campaignId)
  }

  await saveGameState(gameState)

  // Carregar próxima cena (se existir)
  let nextScene = null
  if (choice.nextSceneId !== 'end_campaign') {
    const nextSceneResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/campaigns/${gameState.campaignId}?scene=${choice.nextSceneId}`)
    if (nextSceneResponse.ok) {
      nextScene = await nextSceneResponse.json()
    }
  }

  return { gameState, nextScene, campaignEnded: !nextScene }
}

async function resolveCreatureEncounter(
  userEmail: string,
  characterId: string,
  creatureEncounter: CreatureEncounter,
  resolutionType: 'peaceful' | 'confrontational' | 'avoidance' | 'observe'
) {
  const gameState = await loadGameState(userEmail, characterId)
  if (!gameState) {
    throw new Error('Estado do jogo não encontrado')
  }

  // Usar o GameMaster para processar a resolução
  const result = await gameMaster.processPlayerAction(
    gameState,
    {
      id: 'creature_encounter',
      title: 'Encontro Misterioso',
      description: creatureEncounter.description,
      location: 'local atual',
      timeOfDay: 'night' as const,
      weather: 'clear' as const,
      choices: [],
      npcs: [],
      items: []
    },
    `Resolução ${resolutionType} para encontro com criatura`,
    `creature_${resolutionType}`
  )

  // Aplicar mudanças nos atributos
  if (result.attributeChanges) {
    Object.entries(result.attributeChanges).forEach(([attr, change]) => {
      gameState.attributes[attr] = (gameState.attributes[attr] || 0) + (change as number)
    })
  }

  // Adicionar experiência baseada na resolução
  const experienceGained = resolutionType === 'peaceful' ? 15 :
                          resolutionType === 'confrontational' ? 20 :
                          resolutionType === 'avoidance' ? 5 : 10
  gameState.experience += experienceGained

  // Atualizar percepção espiritual baseada na resolução
  const spiritualBonus = resolutionType === 'peaceful' ? 2 :
                        resolutionType === 'confrontational' ? 3 :
                        resolutionType === 'observe' ? 1 : 0

  if (spiritualBonus > 0) {
    gameState.attributes.percepção = (gameState.attributes.percepção || 0) + spiritualBonus
    gameState.attributes.vontade = (gameState.attributes.vontade || 0) + Math.floor(spiritualBonus / 2)
  }

  // Salvar estado atualizado
  await saveGameState(gameState)

  return {
    narration: result.narration,
    attributeChanges: result.attributeChanges,
    experience: experienceGained,
    spiritualBonus
  }
}

// GET /api/game-states?character=ID - Obter estado atual
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const characterId = searchParams.get('character')

    if (!characterId) {
      return NextResponse.json({ error: 'ID do personagem necessário' }, { status: 400 })
    }

    const gameState = await loadGameState(session.user.email, characterId)

    if (!gameState) {
      return NextResponse.json({ error: 'Estado do jogo não encontrado' }, { status: 404 })
    }

    // Carregar cena atual
    let scene = null
    if (gameState.currentSceneId !== 'end_campaign') {
      const sceneResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/campaigns/${gameState.campaignId}?scene=${gameState.currentSceneId}`)
      if (sceneResponse.ok) {
        scene = await sceneResponse.json()
      }
    }

    return NextResponse.json({ gameState, scene })
  } catch (error) {
    console.error('Erro na API de estados de jogo:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST /api/game-states - Criar novo estado de jogo (iniciar campanha)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { characterId, campaignId } = body

    if (!characterId || !campaignId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const gameState = await startCampaign(session.user.email, characterId, campaignId)

    // Carregar cena inicial
    const sceneResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/campaigns/${campaignId}?scene=${gameState.currentSceneId}`)
    let scene = null
    if (sceneResponse.ok) {
      scene = await sceneResponse.json()
    }

    return NextResponse.json({ gameState, scene }, { status: 201 })
  } catch (error) {
    console.error('Erro ao iniciar campanha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PUT /api/game-states - Fazer uma escolha
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { characterId, choiceId, creatureEncounter, resolutionType } = body

    if (!characterId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Verificar se é uma resolução de encontro com criatura
    if (creatureEncounter && resolutionType) {
      const result = await resolveCreatureEncounter(
        session.user.email,
        characterId,
        creatureEncounter,
        resolutionType
      )
      return NextResponse.json(result)
    }

    // Escolha normal de cena
    if (!choiceId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const result = await makeChoice(session.user.email, characterId, choiceId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao processar escolha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}