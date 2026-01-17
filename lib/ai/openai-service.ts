import OpenAI from 'openai'

export class OpenAIService {
  private client: OpenAI

  // Método público para acessar o cliente (para uso interno do engine)
  getClient(): OpenAI {
    return this.client
  }

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }

  async generateNarration(context: {
    scene: any
    character: any
    gameState: any
    recentChoices: any[]
    action: string
    location: string
    timeOfDay: string
    weather: string
  }): Promise<{
    narration: string
    mood: 'peaceful' | 'tense' | 'mysterious' | 'dramatic' | 'hopeful'
    suggestions?: string[]
    events?: string[]
  }> {
    const prompt = this.buildNarrationPrompt(context)

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é o Mestre do Mundo em Crônicas do Japão Feudal, um RPG ambientado no período Sengoku.
Sua função é criar uma narrativa imersiva, controlar encontros com criaturas místicas do folclore japonês,
gerenciar conversas com NPCs e ditar o rumo da história baseado nas ações dos jogadores.

IMPORTANTE:
- O mundo não gira em torno do jogador
- Seja imprevisível e misterioso
- Inclua elementos sobrenaturais gradualmente
- NPCs têm personalidades próprias e agendas
- Criaturas yokai aparecem em momentos inesperados
- Mantenha o tom épico e atmosférico do Japão feudal`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      })

      const content = response.choices[0]?.message?.content || ''
      return this.parseNarrationResponse(content)
    } catch (error) {
      console.error('Erro na geração de narração:', error)
      return {
        narration: 'O mundo permanece em silêncio misterioso...',
        mood: 'mysterious'
      }
    }
  }

  async generateEncounter(location: string, playerLevel: number, recentEvents: string[]): Promise<{
    type: 'creature' | 'npc' | 'event' | 'treasure' | 'none'
    description: string
    options: string[]
    danger: 'low' | 'medium' | 'high' | 'extreme'
  }> {
    const prompt = `Gere um encontro aleatório no Japão feudal para um jogador de nível ${playerLevel} em ${location}.

Eventos recentes: ${recentEvents.join(', ')}

Considere:
- Criaturas yokai (tengu, kappa, kitsune, oni)
- NPCs misteriosos (monges errantes, samurais renegados, xamãs)
- Eventos sobrenaturais
- Tesouros antigos
- Probabilidade: 30% criatura, 30% NPC, 20% evento, 15% tesouro, 5% nada

Retorne apenas JSON no formato:
{
  "type": "creature|npc|event|treasure|none",
  "description": "descrição do encontro",
  "options": ["opção1", "opção2", "opção3"],
  "danger": "low|medium|high|extreme"
}`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.9,
      })

      const content = response.choices[0]?.message?.content || '{}'
      return JSON.parse(content)
    } catch (error) {
      console.error('Erro na geração de encontro:', error)
      return {
        type: 'none',
        description: 'O caminho permanece tranquilo...',
        options: [],
        danger: 'low'
      }
    }
  }

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
    const questPrompt = `Crie uma missão dinâmica para um jogador nível ${playerLevel} no Japão feudal, localizado em ${location}.

Contexto do jogador: ${playerBackground}

A missão deve:
- Ser coerente com o período Sengoku
- Incluir elementos sobrenaturais subtis
- Ter 2-4 objetivos claros
- Oferecer recompensas apropriadas

Retorne apenas JSON:
{
  "id": "quest_unique_id",
  "title": "Título Épico",
  "description": "Descrição detalhada",
  "objectives": ["objetivo1", "objetivo2"],
  "rewards": {
    "experience": 100,
    "items": ["item1"],
    "reputation": {"facção": 10}
  }
}`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: questPrompt }],
        max_tokens: 600,
        temperature: 0.8,
      })

      const content = response.choices[0]?.message?.content || '{}'
      const quest = JSON.parse(content)

      // Garantir que tem ID único
      quest.id = `dynamic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return quest
    } catch (error) {
      // Fallback para missão estática
      return {
        id: `fallback_${Date.now()}`,
        title: 'A Jornada Continua',
        description: 'Continue explorando o mundo feudal e descobrindo seus segredos.',
        objectives: ['Explorar uma nova área', 'Conhecer um NPC interessante'],
        rewards: {
          experience: 50,
          items: [],
          reputation: {}
        }
      }
    }
  }

  async generateNPCDialogue(npc: any, playerAction: string, context: any): Promise<{
    response: string
    attitude: 'friendly' | 'neutral' | 'hostile' | 'mysterious'
    offers: string[]
    hints: string[]
  }> {
    const prompt = `Gere uma resposta de diálogo para o NPC ${npc.name} (${npc.profession}) no Japão feudal.

Contexto:
- NPC: ${JSON.stringify(npc)}
- Ação do jogador: ${playerAction}
- Local: ${context.location}
- Clima: ${context.weather}
- Hora: ${context.timeOfDay}

O NPC deve ter personalidade própria, segredos e motivações. Pode oferecer quests, informações ou itens.
Considere o folclore japonês e a atmosfera feudal.

Retorne apenas JSON:
{
  "response": "fala do NPC",
  "attitude": "friendly|neutral|hostile|mysterious",
  "offers": ["oferta1", "oferta2"],
  "hints": ["dica1", "dica2"]
}`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content || '{}'
      return JSON.parse(content)
    } catch (error) {
      return {
        response: '...O NPC permanece em silêncio...',
        attitude: 'mysterious',
        offers: [],
        hints: []
      }
    }
  }

  private buildNarrationPrompt(context: any): string {
    return `Jogador ${context.character.name} (${context.character.profession}) está em ${context.location} durante ${context.timeOfDay} com ${context.weather}.

Estado atual:
- Atributos: ${JSON.stringify(context.character.attributes)}
- Experiência: ${context.experience}
- Cena atual: ${context.scene.title}
- Escolhas recentes: ${context.recentChoices.map((c: any) => c.text).join(', ')}

Ação tomada: "${context.action}"

Gere uma narração imersiva que:
1. Descreva as consequências da ação
2. Mantenha o tom misterioso do Japão feudal
3. Introduza elementos sobrenaturais sutilmente
4. Crie antecipação para eventos futuros
5. Mostre que o mundo existe independentemente do jogador

Retorne em formato JSON:
{
  "narration": "narracao descritiva",
  "mood": "peaceful|tense|mysterious|dramatic|hopeful",
  "suggestions": ["sugestao opcional"],
  "events": ["evento que pode acontecer"]
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
}

export const openaiService = new OpenAIService()