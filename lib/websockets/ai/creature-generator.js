"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatureGenerator = void 0;
const openai_service_1 = require("./openai-service");
const creature_types_1 = require("../game/creature-types");
class CreatureGenerator {
    constructor() {
        this.openai = new openai_service_1.OpenAIService();
    }
    /**
     * Gera um encontro com criatura baseado no tipo e contexto
     * Segue filosofia: nunca dizer "monstro", criar dúvida, usar rumores
     */
    async generateCreatureEncounter(type, context) {
        const typeDefinition = creature_types_1.CREATURE_TYPES[type];
        const prompt = this.buildCreaturePrompt(typeDefinition, context);
        try {
            const response = await this.generateWithAI(prompt);
            return this.parseCreatureResponse(response, type, context);
        }
        catch (error) {
            console.error('Erro ao gerar criatura:', error);
            return this.generateFallbackCreature(type, context);
        }
    }
    async generateWithAI(prompt) {
        // Importar OpenAI dinamicamente para evitar problemas de build
        const OpenAI = (await Promise.resolve().then(() => require('openai'))).default;
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || '',
        });
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
        });
        return response.choices[0]?.message?.content || '{}';
    }
    buildCreaturePrompt(typeDef, context) {
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

Formate como JSON com campos: description, clues, manifestations, playerEffects, resolutionOptions, danger`;
    }
    parseCreatureResponse(response, type, context) {
        try {
            // Tenta fazer parse do JSON da resposta
            const parsed = JSON.parse(response);
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
            };
        }
        catch (error) {
            console.error('Erro ao fazer parse da resposta da IA:', error);
            return this.generateFallbackCreature(type, context);
        }
    }
    generateFallbackCreature(type, context) {
        const typeDef = creature_types_1.CREATURE_TYPES[type];
        // Criaturas de fallback baseadas no tipo, seguindo a filosofia misteriosa
        const fallbacks = {
            [creature_types_1.CreatureType.SUBSTITUTOS]: {
                description: "Há rumores de que o velho ferreiro não é mais o mesmo desde que voltou da floresta. Seus olhos parecem... diferentes.",
                clues: [
                    "Vizinhos dizem que ele evita espelhos",
                    "Suas ferramentas fazem sons estranhos à noite",
                    "Animais fogem quando ele se aproxima"
                ],
                manifestations: ["Som de metal sendo trabalhado em horas estranhas"],
                danger: 'medium'
            },
            [creature_types_1.CreatureType.ENTIDADES_CONTATO]: {
                description: "Objetos aparecem em lugares onde não deveriam estar. Uma criança encontrou uma moeda antiga na fonte do vilarejo.",
                clues: [
                    "Perturbações inexplicáveis nos equipamentos",
                    "Sonhos compartilhados entre moradores",
                    "Sombras que se movem contra a luz"
                ],
                manifestations: ["Objetos se movendo sozinhos", "Perturbações tecnológicas"],
                danger: 'low'
            },
            [creature_types_1.CreatureType.GHOULS]: {
                description: "A fome parece ter afetado algumas famílias mais do que outras. Eles consomem... demais.",
                clues: [
                    "Vizinhos relatam apetites insaciáveis",
                    "Comportamentos estranhos durante refeições",
                    "Mudanças sutis na aparência"
                ],
                manifestations: ["Perturbações durante refeições coletivas"],
                danger: 'high'
            },
            [creature_types_1.CreatureType.YOKAI_TRADICIONAIS]: {
                description: "As velhas histórias falam de espíritos da floresta, mas quem sabe o que é verdade?",
                clues: [
                    "Animais se comportando estranhamente",
                    "Fenômenos naturais inexplicáveis",
                    "Tradições antigas sendo lembradas"
                ],
                manifestations: ["Perturbações na natureza local"],
                danger: 'medium'
            },
            [creature_types_1.CreatureType.YUREI]: {
                description: "Há um ar pesado no ar, como se memórias antigas não quisessem partir.",
                clues: [
                    "Toques gelados em noites frias",
                    "Vozes sussurrando nomes esquecidos",
                    "Perturbações emocionais inexplicáveis"
                ],
                manifestations: ["Perturbações emocionais coletivas"],
                danger: 'low'
            },
            [creature_types_1.CreatureType.MONONOKE]: {
                description: "O vilarejo carrega um peso invisível. Coisas que aconteceram há muito tempo ainda ecoam.",
                clues: [
                    "Atmosfera opressiva em certos locais",
                    "Eventos que se repetem ciclicamente",
                    "Perturbações emocionais em grupo"
                ],
                manifestations: ["Perturbações ambientais graduais"],
                danger: 'medium'
            },
            [creature_types_1.CreatureType.KAMI_MENORES]: {
                description: "A floresta parece observar os visitantes. Alguns dizem que ela julga suas ações.",
                clues: [
                    "Fenômenos naturais inexplicáveis",
                    "Guias invisíveis para os respeitosos",
                    "Punições sutis para os desrespeitosos"
                ],
                manifestations: ["Perturbações na natureza"],
                danger: 'low'
            },
            [creature_types_1.CreatureType.TSUKUMOGAMI]: {
                description: "Objetos antigos guardam mais segredos do que parecem. Alguns têm... personalidade própria.",
                clues: [
                    "Itens se movendo sozinhos",
                    "Influências sutis no comportamento",
                    "Histórias que parecem ganhar vida"
                ],
                manifestations: ["Objetos com comportamento próprio"],
                danger: 'low'
            }
        };
        const fallback = fallbacks[type];
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
        };
    }
    /**
     * Gera encontros aleatórios baseados na localização e contexto
     */
    async generateRandomEncounter(location, playerLevel = 'novice') {
        // Probabilidades baseadas no nível do jogador
        const probabilities = {
            novice: {
                [creature_types_1.CreatureType.KAMI_MENORES]: 0.3,
                [creature_types_1.CreatureType.TSUKUMOGAMI]: 0.25,
                [creature_types_1.CreatureType.YUREI]: 0.2,
                [creature_types_1.CreatureType.MONONOKE]: 0.15,
                [creature_types_1.CreatureType.SUBSTITUTOS]: 0.05,
                [creature_types_1.CreatureType.ENTIDADES_CONTATO]: 0.03,
                [creature_types_1.CreatureType.GHOULS]: 0.01,
                [creature_types_1.CreatureType.YOKAI_TRADICIONAIS]: 0.01
            },
            experienced: {
                [creature_types_1.CreatureType.MONONOKE]: 0.25,
                [creature_types_1.CreatureType.SUBSTITUTOS]: 0.2,
                [creature_types_1.CreatureType.YOKAI_TRADICIONAIS]: 0.15,
                [creature_types_1.CreatureType.ENTIDADES_CONTATO]: 0.15,
                [creature_types_1.CreatureType.KAMI_MENORES]: 0.1,
                [creature_types_1.CreatureType.GHOULS]: 0.08,
                [creature_types_1.CreatureType.YUREI]: 0.05,
                [creature_types_1.CreatureType.TSUKUMOGAMI]: 0.02
            },
            veteran: {
                [creature_types_1.CreatureType.GHOULS]: 0.25,
                [creature_types_1.CreatureType.YOKAI_TRADICIONAIS]: 0.25,
                [creature_types_1.CreatureType.ENTIDADES_CONTATO]: 0.2,
                [creature_types_1.CreatureType.SUBSTITUTOS]: 0.15,
                [creature_types_1.CreatureType.MONONOKE]: 0.1,
                [creature_types_1.CreatureType.YUREI]: 0.03,
                [creature_types_1.CreatureType.KAMI_MENORES]: 0.01,
                [creature_types_1.CreatureType.TSUKUMOGAMI]: 0.01
            }
        };
        const random = Math.random();
        let cumulative = 0;
        const probs = probabilities[playerLevel];
        for (const [type, prob] of Object.entries(probs)) {
            cumulative += prob;
            if (random <= cumulative) {
                return this.generateCreatureEncounter(type, {
                    location,
                    timeOfDay: this.getRandomTimeOfDay(),
                    currentSeason: this.getRandomSeason()
                });
            }
        }
        // Fallback para o tipo mais comum
        return this.generateCreatureEncounter(creature_types_1.CreatureType.KAMI_MENORES, { location, timeOfDay: 'tarde', currentSeason: 'primavera' });
    }
    getRandomTimeOfDay() {
        const times = ['madrugada', 'amanhecer', 'manhã', 'tarde', 'anoitecer', 'noite', 'meia-noite'];
        return times[Math.floor(Math.random() * times.length)];
    }
    getRandomSeason() {
        const seasons = ['primavera', 'verão', 'outono', 'inverno'];
        return seasons[Math.floor(Math.random() * seasons.length)];
    }
}
exports.CreatureGenerator = CreatureGenerator;
