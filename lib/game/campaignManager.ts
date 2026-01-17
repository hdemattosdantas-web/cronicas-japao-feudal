import { promises as fs } from 'fs'
import path from 'path'
import { Campaign, GameState, Scene } from './types'

const CAMPAIGNS_DIR = path.join(process.cwd(), 'data', 'campaigns')
const GAME_STATES_DIR = path.join(process.cwd(), 'data', 'game-states')

export class CampaignManager {
  static async loadCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const campaignPath = path.join(CAMPAIGNS_DIR, `${campaignId}.json`)
      const data = await fs.readFile(campaignPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Erro ao carregar campanha ${campaignId}:`, error)
      return null
    }
  }

  static async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const files = await fs.readdir(CAMPAIGNS_DIR)
      const campaigns: Campaign[] = []

      for (const file of files) {
        if (file.endsWith('.json')) {
          const campaignId = file.replace('.json', '')
          const campaign = await this.loadCampaign(campaignId)
          if (campaign) {
            campaigns.push(campaign)
          }
        }
      }

      return campaigns
    } catch (error) {
      console.error('Erro ao listar campanhas:', error)
      return []
    }
  }

  static async getScene(campaignId: string, sceneId: string): Promise<Scene | null> {
    const campaign = await this.loadCampaign(campaignId)
    if (!campaign) return null

    return campaign.scenes.find(scene => scene.id === sceneId) || null
  }

  static async loadGameState(userEmail: string, characterId: string): Promise<GameState | null> {
    try {
      await fs.mkdir(GAME_STATES_DIR, { recursive: true })
      const statePath = path.join(GAME_STATES_DIR, `${userEmail}_${characterId}.json`)
      const data = await fs.readFile(statePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // Estado não existe ainda, retornar null
      return null
    }
  }

  static async saveGameState(gameState: GameState): Promise<void> {
    try {
      await fs.mkdir(GAME_STATES_DIR, { recursive: true })
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

  static async startCampaign(userEmail: string, characterId: string, campaignId: string): Promise<GameState> {
    const campaign = await this.loadCampaign(campaignId)
    if (!campaign) {
      throw new Error(`Campanha ${campaignId} não encontrada`)
    }

    // Carregar atributos do personagem (simplificado)
    // Em produção, isso viria da API de personagens
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

    await this.saveGameState(gameState)
    return gameState
  }

  static async makeChoice(
    userEmail: string,
    characterId: string,
    choiceId: string
  ): Promise<{ gameState: GameState; nextScene: Scene | null }> {
    const gameState = await this.loadGameState(userEmail, characterId)
    if (!gameState) {
      throw new Error('Estado do jogo não encontrado')
    }

    const scene = await this.getScene(gameState.campaignId, gameState.currentSceneId)
    if (!scene) {
      throw new Error('Cena atual não encontrada')
    }

    const choice = scene.choices.find(c => c.id === choiceId)
    if (!choice) {
      throw new Error('Escolha não encontrada')
    }

    // Aplicar consequências da escolha
    if (choice.consequences) {
      if (choice.consequences.attributeChanges) {
        Object.entries(choice.consequences.attributeChanges).forEach(([attr, change]) => {
          gameState.attributes[attr] = (gameState.attributes[attr] || 0) + change
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

    await this.saveGameState(gameState)

    const nextScene = choice.nextSceneId !== 'end_campaign'
      ? await this.getScene(gameState.campaignId, choice.nextSceneId)
      : null

    return { gameState, nextScene }
  }

  static async getCurrentScene(userEmail: string, characterId: string): Promise<{ gameState: GameState; scene: Scene | null } | null> {
    const gameState = await this.loadGameState(userEmail, characterId)
    if (!gameState) return null

    const scene = gameState.currentSceneId !== 'end_campaign'
      ? await this.getScene(gameState.campaignId, gameState.currentSceneId)
      : null

    return { gameState, scene }
  }
}