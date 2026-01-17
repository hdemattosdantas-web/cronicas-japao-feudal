"use strict";
// Sistema de Evolução de Personagem - Crônicas do Japão Feudal
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterEvolutionManager = exports.CharacterClass = exports.CreatureType = void 0;
var CreatureType;
(function (CreatureType) {
    CreatureType["SUBSTITUTOS"] = "substitutos";
    CreatureType["ENTIDADES_CONTATO"] = "entidades_contato";
    CreatureType["GHOULS"] = "ghouls";
    CreatureType["YOKAI_TRADICIONAIS"] = "yokai_tradicionais";
    CreatureType["YUREI"] = "yurei";
    CreatureType["MONONOKE"] = "mononoke";
    CreatureType["KAMI_MENORES"] = "kami_menores";
    CreatureType["TSUKUMOGAMI"] = "tsukumogami";
})(CreatureType || (exports.CreatureType = CreatureType = {}));
var CharacterClass;
(function (CharacterClass) {
    // Classes iniciais
    CharacterClass["CAMPONES"] = "campon\u00EAs";
    CharacterClass["FERREIRO"] = "ferreiro";
    CharacterClass["LENHADOR"] = "lenhador";
    CharacterClass["PESCADOR"] = "pescador";
    CharacterClass["MERCADOR"] = "mercador";
    CharacterClass["MENSAGEIRO"] = "mensageiro";
    CharacterClass["MONGE_BUDISTA"] = "monge_budista";
    CharacterClass["SACERDOTE_XINTOISTA"] = "sacerdote_xintoista";
    CharacterClass["SOLDADO_RASO"] = "soldado_raso";
    CharacterClass["CURANDEIRO"] = "curandeiro";
    CharacterClass["ARTISTA_AMBULANTE"] = "artista_ambulante";
    // Classes evoluídas baseadas em criaturas
    CharacterClass["GUARDIAO_DOS_IMPOSTORES"] = "guardi\u00E3o_dos_impostores";
    CharacterClass["VIAJANTE_ENTRE_MUNDOS"] = "viajante_entre_mundos";
    CharacterClass["DEVORADOR_DE_ALMAS"] = "devorador_de_almas";
    CharacterClass["MEDIADOR_ESPIRITUAL"] = "mediador_espiritual";
    CharacterClass["GUIA_DOS_PERDIDOS"] = "guia_dos_perdidos";
    CharacterClass["HARMONIZADOR_DE_EMOCOES"] = "harmonizador_de_emocoes";
    CharacterClass["PROTETOR_DA_NATUREZA"] = "protetor_da_natureza";
    CharacterClass["GUARDIAO_DOS_ANTIGOS"] = "guardi\u00E3o_dos_antigos"; // Tsukumogami
})(CharacterClass || (exports.CharacterClass = CharacterClass = {}));
class CharacterEvolutionManager {
    constructor(initialClass = CharacterClass.CAMPONES) {
        this.evolutionData = {
            currentClass: initialClass,
            availableClasses: [initialClass],
            creatureEncounters: {},
            evolutionPoints: 0,
            spiritualAwakening: 0,
            classMastery: {
                [initialClass]: 25 // Começa com 25% de maestria na classe inicial
            },
            uniqueTraits: [],
            evolutionHistory: [{
                    date: new Date(),
                    event: `Iniciou jornada como ${initialClass}`,
                    attributeChanges: {}
                }]
        };
        // Inicializar registros de criaturas
        Object.values(CreatureType).forEach(type => {
            this.evolutionData.creatureEncounters[type] = {
                creatureType: type,
                encounterCount: 0,
                lastEncounter: new Date(),
                successfulEncounters: 0,
                failedEncounters: 0,
                learnedLessons: [],
                grantedPowers: []
            };
        });
    }
    // Registrar encontro com criatura
    recordCreatureEncounter(creatureType, success, lesson, grantedPower) {
        const record = this.evolutionData.creatureEncounters[creatureType];
        record.encounterCount++;
        record.lastEncounter = new Date();
        if (success) {
            record.successfulEncounters++;
            this.evolutionData.evolutionPoints += 10;
            if (lesson)
                record.learnedLessons.push(lesson);
            if (grantedPower)
                record.grantedPowers.push(grantedPower);
        }
        else {
            record.failedEncounters++;
            this.evolutionData.evolutionPoints += 5; // Mesmo fracassos ensinam
        }
        // Aumentar despertar espiritual
        this.evolutionData.spiritualAwakening = Math.min(100, this.evolutionData.spiritualAwakening + (success ? 2 : 1));
        // Verificar se desbloqueou nova classe
        this.checkClassUnlock(creatureType);
    }
    // Verificar se desbloqueou nova classe baseada em encontros
    checkClassUnlock(creatureType) {
        const record = this.evolutionData.creatureEncounters[creatureType];
        const classUnlocks = {
            [CreatureType.SUBSTITUTOS]: {
                class: CharacterClass.GUARDIAO_DOS_IMPOSTORES,
                requiredEncounters: 3
            },
            [CreatureType.ENTIDADES_CONTATO]: {
                class: CharacterClass.VIAJANTE_ENTRE_MUNDOS,
                requiredEncounters: 5
            },
            [CreatureType.GHOULS]: {
                class: CharacterClass.DEVORADOR_DE_ALMAS,
                requiredEncounters: 4
            },
            [CreatureType.YOKAI_TRADICIONAIS]: {
                class: CharacterClass.MEDIADOR_ESPIRITUAL,
                requiredEncounters: 6
            },
            [CreatureType.YUREI]: {
                class: CharacterClass.GUIA_DOS_PERDIDOS,
                requiredEncounters: 3
            },
            [CreatureType.MONONOKE]: {
                class: CharacterClass.HARMONIZADOR_DE_EMOCOES,
                requiredEncounters: 4
            },
            [CreatureType.KAMI_MENORES]: {
                class: CharacterClass.PROTETOR_DA_NATUREZA,
                requiredEncounters: 5
            },
            [CreatureType.TSUKUMOGAMI]: {
                class: CharacterClass.GUARDIAO_DOS_ANTIGOS,
                requiredEncounters: 4
            }
        };
        const unlockInfo = classUnlocks[creatureType];
        if (unlockInfo && record.successfulEncounters >= unlockInfo.requiredEncounters) {
            if (!this.evolutionData.availableClasses.includes(unlockInfo.class)) {
                this.evolutionData.availableClasses.push(unlockInfo.class);
                this.evolutionData.classMastery[unlockInfo.class] = 0;
                // Registrar na história
                this.evolutionData.evolutionHistory.push({
                    date: new Date(),
                    event: `Desbloqueou classe: ${unlockInfo.class}`,
                    classChange: unlockInfo.class,
                    attributeChanges: {}
                });
            }
        }
    }
    // Mudar classe do personagem
    changeClass(newClass) {
        if (!this.evolutionData.availableClasses.includes(newClass)) {
            return false; // Classe não disponível
        }
        const oldClass = this.evolutionData.currentClass;
        this.evolutionData.currentClass = newClass;
        // Aumentar maestria na nova classe
        this.evolutionData.classMastery[newClass] = Math.min(100, (this.evolutionData.classMastery[newClass] || 0) + 10);
        // Registrar mudança
        this.evolutionData.evolutionHistory.push({
            date: new Date(),
            event: `Mudou classe de ${oldClass} para ${newClass}`,
            classChange: newClass,
            attributeChanges: this.getClassAttributeBonuses(newClass)
        });
        return true;
    }
    // Obter bônus de atributos por classe
    getClassAttributeBonuses(characterClass) {
        const bonuses = {
            // Classes iniciais têm bônus menores
            [CharacterClass.CAMPONES]: { corpo: 1, forca: 1 },
            [CharacterClass.FERREIRO]: { forca: 2, percepcao: 1 },
            [CharacterClass.LENHADOR]: { forca: 2, resistencia_sobrenatural: 1 },
            [CharacterClass.PESCADOR]: { agilidade: 2, percepcao: 1 },
            [CharacterClass.MERCADOR]: { intelecto: 2, vontade: 1 },
            [CharacterClass.MENSAGEIRO]: { agilidade: 2, percepcao: 1 },
            [CharacterClass.MONGE_BUDISTA]: { vontade: 2, harmonia_espiritual: 1 },
            [CharacterClass.SACERDOTE_XINTOISTA]: { vontade: 1, comunhao_natural: 1 },
            [CharacterClass.SOLDADO_RASO]: { corpo: 2, forca: 1 },
            [CharacterClass.CURANDEIRO]: { intelecto: 1, empatia_emocional: 1 },
            [CharacterClass.ARTISTA_AMBULANTE]: { intelecto: 1, agilidade: 1 },
            // Classes evoluídas têm bônus espirituais
            [CharacterClass.GUARDIAO_DOS_IMPOSTORES]: {
                furtividade_sombria: 3,
                adaptabilidade_mistica: 2,
                percepcao: 1
            },
            [CharacterClass.VIAJANTE_ENTRE_MUNDOS]: {
                clarividencia: 3,
                adaptabilidade_mistica: 2,
                intelecto: 1
            },
            [CharacterClass.DEVORADOR_DE_ALMAS]: {
                voracidade_controlada: 3,
                resistencia_sobrenatural: 2,
                forca: 1
            },
            [CharacterClass.MEDIADOR_ESPIRITUAL]: {
                diplomacia_espiritual: 3,
                harmonia_espiritual: 2,
                vontade: 1
            },
            [CharacterClass.GUIA_DOS_PERDIDOS]: {
                empatia_pós_vida: 3,
                memoria_ancestral: 2,
                percepcao: 1
            },
            [CharacterClass.HARMONIZADOR_DE_EMOCOES]: {
                harmonizacao_emocional: 3,
                empatia_emocional: 2,
                vontade: 1
            },
            [CharacterClass.PROTETOR_DA_NATUREZA]: {
                comunhao_natural: 3,
                afinidade_elemental: 2,
                resistencia_sobrenatural: 1
            },
            [CharacterClass.GUARDIAO_DOS_ANTIGOS]: {
                preservacao_temporal: 3,
                memoria_ancestral: 2,
                intelecto: 1
            }
        };
        return bonuses[characterClass] || {};
    }
    // Obter dados de evolução
    getEvolutionData() {
        return this.evolutionData;
    }
    // Calcular atributos totais incluindo bônus de classe e criaturas
    calculateTotalAttributes(baseAttributes) {
        const total = { ...baseAttributes };
        // Bônus da classe atual
        const classBonuses = this.getClassAttributeBonuses(this.evolutionData.currentClass);
        Object.entries(classBonuses).forEach(([attr, bonus]) => {
            const attrKey = attr;
            total[attrKey] = (total[attrKey] || 0) + bonus;
        });
        // Bônus baseados em encontros com criaturas
        Object.values(this.evolutionData.creatureEncounters).forEach(record => {
            if (record.successfulEncounters > 0) {
                const creatureBonuses = this.getCreatureAttributeBonuses(record.creatureType, record.successfulEncounters);
                Object.entries(creatureBonuses).forEach(([attr, bonus]) => {
                    const attrKey = attr;
                    total[attrKey] = (total[attrKey] || 0) + bonus;
                });
            }
        });
        return total;
    }
    // Bônus de atributos baseados em criaturas enfrentadas
    getCreatureAttributeBonuses(creatureType, successfulEncounters) {
        const baseBonus = Math.floor(successfulEncounters / 2); // 1 ponto a cada 2 encontros bem-sucedidos
        const bonuses = {
            [CreatureType.SUBSTITUTOS]: {
                furtividade_sombria: baseBonus,
                adaptabilidade_mistica: Math.floor(baseBonus / 2)
            },
            [CreatureType.ENTIDADES_CONTATO]: {
                clarividencia: baseBonus,
                adaptabilidade_mistica: Math.floor(baseBonus / 2)
            },
            [CreatureType.GHOULS]: {
                voracidade_controlada: baseBonus,
                resistencia_sobrenatural: Math.floor(baseBonus / 2)
            },
            [CreatureType.YOKAI_TRADICIONAIS]: {
                diplomacia_espiritual: baseBonus,
                harmonia_espiritual: Math.floor(baseBonus / 2)
            },
            [CreatureType.YUREI]: {
                empatia_pós_vida: baseBonus,
                memoria_ancestral: Math.floor(baseBonus / 2)
            },
            [CreatureType.MONONOKE]: {
                harmonizacao_emocional: baseBonus,
                empatia_emocional: Math.floor(baseBonus / 2)
            },
            [CreatureType.KAMI_MENORES]: {
                comunhao_natural: baseBonus,
                afinidade_elemental: Math.floor(baseBonus / 2)
            },
            [CreatureType.TSUKUMOGAMI]: {
                preservacao_temporal: baseBonus,
                memoria_ancestral: Math.floor(baseBonus / 2)
            }
        };
        return bonuses[creatureType] || {};
    }
    // Serializar para salvar
    serialize() {
        return JSON.stringify({
            evolutionData: this.evolutionData,
            serializedAt: new Date().toISOString()
        });
    }
    // Desserializar para carregar
    deserialize(data) {
        try {
            const parsed = JSON.parse(data);
            this.evolutionData = parsed.evolutionData;
            // Converter datas de volta
            Object.values(this.evolutionData.creatureEncounters).forEach((record) => {
                record.lastEncounter = new Date(record.lastEncounter);
            });
            this.evolutionData.evolutionHistory.forEach((entry) => {
                entry.date = new Date(entry.date);
            });
        }
        catch (error) {
            console.error('Erro ao desserializar dados de evolução:', error);
        }
    }
}
exports.CharacterEvolutionManager = CharacterEvolutionManager;
