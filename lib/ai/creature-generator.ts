import { OpenAIService } from './openai-service'
import { CreatureType, CREATURE_TYPES, CreatureEncounter } from '../game/creature-types'

export class CreatureGenerator {
  private openai: OpenAIService

  constructor() {
    this.openai = new OpenAIService()
  }

  /**
   * Gera um encontro com criatura baseado no tipo e contexto
   * Segue filosofia: nunca dizer "monstro", criar dúvida, usar rumores
   */
  async generateCreatureEncounter(
    type: CreatureType,
    context: {
      location: string
      timeOfDay: string
      playerBackground?: string
      recentEvents?: string[]
      currentSeason?: string
    }
  ): Promise<CreatureEncounter> {
    const typeDefinition = CREATURE_TYPES[type]

    const prompt = this.buildCreaturePrompt(typeDefinition, context)

    try {
      const response = await this.generateWithAI(prompt)
      return this.parseCreatureResponse(response, type, context)
    } catch (error) {
      console.error('Erro ao gerar criatura:', error)
      return this.generateFallbackCreature(type, context)
    }
  }

  private async generateWithAI(prompt: string): Promise<string> {
    // Importar OpenAI dinamicamente para evitar problemas de build
    const OpenAI = (await import('openai')).default

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Você é o Mestre das Criaturas Misteriosas em Crônicas do Japão Feudal.
Sua função é criar encontros sobrenaturais que sigam ESTREITAMENTE estas regras:

❌ PROIBIDO:
- Usar palavras como "monstro", "criatura", "yōkai", "demônio", "fantasma"
- Explicar tudo diretamente
- Confirmar a verdade de qualquer suspeita
- Dar respostas claras

✅ OBRIGATÓRIO:
- Usar apenas rumores, observações, consequências
- Criar dúvida e ambiguidade
- Deixar espaço para interpretação
- Focar em detalhes mundanos com toques estranhos
- Usar linguagem natural, como um aldeão contando uma história

Retorne APENAS JSON válido no formato solicitado.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
    })

    return response.choices[0]?.message?.content || '{}'
  }

  private buildCreaturePrompt(
    typeDef: typeof CREATURE_TYPES[CreatureType],
    context: any
  ): string {
    return `Você é um contador de histórias misteriosas no Japão feudal. Sua tarefa é criar um encontro sutil e inquietante que siga estas REGRAS ESTREITAS:

❌ PROIBIDO:
- Usar palavras como "monstro", "criatura", "yōkai", "demônio", "fantasma"
- Explicar tudo diretamente
- Confirmar a verdade de qualquer suspeita
- Dar respostas claras

✅ OBRIGATÓRIO:
- Usar apenas rumores, observações, consequências
- Criar dúvida e ambiguidade
- Deixar espaço para interpretação
- Focar em detalhes mundanos com toques estranhos
- Usar linguagem natural, como um aldeão contando uma história

CONTEXTO DO ENCONTRO:
- Local: ${context.location}
- Horário: ${context.timeOfDay}
- Estação: ${context.currentSeason || 'desconhecida'}
- Jogador: ${context.playerBackground || 'viajante comum'}

TIPO DE MANIFESTAÇÃO: ${typeDef.name}
Temas filosóficos: ${typeDef.philosophicalThemes.join(', ')}
Estilos de manifestação: ${typeDef.manifestationStyles.join(', ')}

CRIE UM ENCONTRO QUE INCLUA:
1. Uma apresentação inicial misteriosa (2-3 frases)
2. 3-4 pistas sutis sobre algo estranho
3. Efeitos imediatos no jogador/mundo
4. Possíveis resoluções (pacífica, confrontadora, evasiva)
5. Uma dúvida persistente que fica na mente

Formate como JSON com campos: description, clues, manifestations, playerEffects, resolutionOptions, danger`
  }

  private parseCreatureResponse(
    response: string,
    type: CreatureType,
    context: any
  ): CreatureEncounter {
    try {
      // Tenta fazer parse do JSON da resposta
      const parsed = JSON.parse(response)

      return {
        id: `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        description: parsed.description || "Algo estranho aconteceu...",
        danger: parsed.danger || 'medium',
        clues: parsed.clues || [],
        manifestations: parsed.manifestations || [],
        playerEffects: {
          immediate: parsed.playerEffects?.immediate || [],
          gradual: parsed.playerEffects?.gradual || [],
          permanent: parsed.playerEffects?.permanent || []
        },
        resolutionOptions: {
          peaceful: parsed.resolutionOptions?.peaceful || [],
          confrontational: parsed.resolutionOptions?.confrontational || [],
          avoidance: parsed.resolutionOptions?.avoidance || []
        }
      }
    } catch (error) {
      console.error('Erro ao fazer parse da resposta da IA:', error)
      return this.generateFallbackCreature(type, context)
    }
  }

  private generateFallbackCreature(
    type: CreatureType,
    context: any
  ): CreatureEncounter {
    const typeDef = CREATURE_TYPES[type]

    // Criaturas de fallback baseadas no tipo, seguindo a filosofia misteriosa
    const fallbacks = {
      [CreatureType.SUBSTITUTOS]: {
        description: "Há rumores de que o velho ferreiro não é mais o mesmo desde que voltou da floresta. Seus olhos parecem... diferentes.",
        clues: [
          "Vizinhos dizem que ele evita espelhos",
          "Suas ferramentas fazem sons estranhos à noite",
          "Animais fogem quando ele se aproxima"
        ],
        manifestations: ["Som de metal sendo trabalhado em horas estranhas"],
        danger: 'medium' as const
      },

      [CreatureType.ENTIDADES_CONTATO]: {
        description: "Objetos aparecem em lugares onde não deveriam estar. Uma criança encontrou uma moeda antiga na fonte do vilarejo.",
        clues: [
          "Perturbações inexplicáveis nos equipamentos",
          "Sonhos compartilhados entre moradores",
          "Sombras que se movem contra a luz"
        ],
        manifestations: ["Objetos se movendo sozinhos", "Perturbações tecnológicas"],
        danger: 'low' as const
      },

      [CreatureType.GHOULS]: {
        description: "A fome parece ter afetado algumas famílias mais do que outras. Eles consomem... demais.",
        clues: [
          "Vizinhos relatam apetites insaciáveis",
          "Comportamentos estranhos durante refeições",
          "Mudanças sutis na aparência"
        ],
        manifestations: ["Perturbações durante refeições coletivas"],
        danger: 'high' as const
      },

      [CreatureType.YOKAI_TRADICIONAIS]: {
        description: "As velhas histórias falam de espíritos da floresta, mas quem sabe o que é verdade?",
        clues: [
          "Animais se comportando estranhamente",
          "Fenômenos naturais inexplicáveis",
          "Tradições antigas sendo lembradas"
        ],
        manifestations: ["Perturbações na natureza local"],
        danger: 'medium' as const
      },

      [CreatureType.YUREI]: {
        description: "Há um ar pesado no ar, como se memórias antigas não quisessem partir.",
        clues: [
          "Toques gelados em noites frias",
          "Vozes sussurrando nomes esquecidos",
          "Perturbações emocionais inexplicáveis"
        ],
        manifestations: ["Perturbações emocionais coletivas"],
        danger: 'low' as const
      },

      [CreatureType.MONONOKE]: {
        description: "O vilarejo carrega um peso invisível. Coisas que aconteceram há muito tempo ainda ecoam.",
        clues: [
          "Atmosfera opressiva em certos locais",
          "Eventos que se repetem ciclicamente",
          "Perturbações emocionais em grupo"
        ],
        manifestations: ["Perturbações ambientais graduais"],
        danger: 'medium' as const
      },

      [CreatureType.KAMI_MENORES]: {
        description: "A floresta parece observar os visitantes. Alguns dizem que ela julga suas ações.",
        clues: [
          "Fenômenos naturais inexplicáveis",
          "Guias invisíveis para os respeitosos",
          "Punições sutis para os desrespeitosos"
        ],
        manifestations: ["Perturbações na natureza"],
        danger: 'low' as const
      },

      [CreatureType.TSUKUMOGAMI]: {
        description: "Objetos antigos guardam mais segredos do que parecem. Alguns têm... personalidade própria.",
        clues: [
          "Itens se movendo sozinhos",
          "Influências sutis no comportamento",
          "Histórias que parecem ganhar vida"
        ],
        manifestations: ["Objetos com comportamento próprio"],
        danger: 'low' as const
      }
    }

    const fallback = fallbacks[type]

    return {
      id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      description: fallback.description,
      danger: fallback.danger,
      clues: fallback.clues,
      manifestations: fallback.manifestations,
      playerEffects: {
        immediate: ["Sensação de ser observado"],
        gradual: ["Dúvidas persistentes"],
        permanent: ["Mudanças sutis na percepção"]
      },
      resolutionOptions: {
        peaceful: ["Observar e aprender", "Respeitar os sinais"],
        confrontational: ["Investigar diretamente", "Confrontar as manifestações"],
        avoidance: ["Partir do local", "Ignorar os sinais"]
      }
    }
  }

  /**
   * Gera encontros aleatórios baseados na localização e contexto
   */
  async generateRandomEncounter(
    location: string,
    playerLevel: 'novice' | 'experienced' | 'veteran' = 'novice'
  ): Promise<CreatureEncounter> {
    // Probabilidades baseadas no nível do jogador
    const probabilities = {
      novice: {
        [CreatureType.KAMI_MENORES]: 0.3,
        [CreatureType.TSUKUMOGAMI]: 0.25,
        [CreatureType.YUREI]: 0.2,
        [CreatureType.MONONOKE]: 0.15,
        [CreatureType.SUBSTITUTOS]: 0.05,
        [CreatureType.ENTIDADES_CONTATO]: 0.03,
        [CreatureType.GHOULS]: 0.01,
        [CreatureType.YOKAI_TRADICIONAIS]: 0.01
      },
      experienced: {
        [CreatureType.MONONOKE]: 0.25,
        [CreatureType.SUBSTITUTOS]: 0.2,
        [CreatureType.YOKAI_TRADICIONAIS]: 0.15,
        [CreatureType.ENTIDADES_CONTATO]: 0.15,
        [CreatureType.KAMI_MENORES]: 0.1,
        [CreatureType.GHOULS]: 0.08,
        [CreatureType.YUREI]: 0.05,
        [CreatureType.TSUKUMOGAMI]: 0.02
      },
      veteran: {
        [CreatureType.GHOULS]: 0.25,
        [CreatureType.YOKAI_TRADICIONAIS]: 0.25,
        [CreatureType.ENTIDADES_CONTATO]: 0.2,
        [CreatureType.SUBSTITUTOS]: 0.15,
        [CreatureType.MONONOKE]: 0.1,
        [CreatureType.YUREI]: 0.03,
        [CreatureType.KAMI_MENORES]: 0.01,
        [CreatureType.TSUKUMOGAMI]: 0.01
      }
    }

    const random = Math.random()
    let cumulative = 0
    const probs = probabilities[playerLevel]

    for (const [type, prob] of Object.entries(probs)) {
      cumulative += prob
      if (random <= cumulative) {
        return this.generateCreatureEncounter(
          type as CreatureType,
          {
            location,
            timeOfDay: this.getRandomTimeOfDay(),
            currentSeason: this.getRandomSeason()
          }
        )
      }
    }

    // Fallback para o tipo mais comum
    return this.generateCreatureEncounter(
      CreatureType.KAMI_MENORES,
      { location, timeOfDay: 'tarde', currentSeason: 'primavera' }
    )
  }

  private getRandomTimeOfDay(): string {
    const times = ['madrugada', 'amanhecer', 'manhã', 'tarde', 'anoitecer', 'noite', 'meia-noite']
    return times[Math.floor(Math.random() * times.length)]
  }

  private getRandomSeason(): string {
    const seasons = ['primavera', 'verão', 'outono', 'inverno']
    return seasons[Math.floor(Math.random() * seasons.length)]
  }
}