// Sistema Familiar - Crônicas do Japão Feudal

import { CharacterClass, ExpandedAttributes, Family, FamilyMember } from './character-evolution'

export enum RelationshipStatus {
  SINGLE = 'single',
  COURTING = 'courting',
  ENGAGED = 'engaged',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export interface MarriageProposal {
  id: string
  proposerId: string
  targetId: string
  proposalDate: Date
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  dowry?: number // Dote oferecido
  conditions?: string[] // Condições especiais
}

export interface ChildInheritance {
  physicalTraits: string[] // Aparência física herdada
  personalityTraits: string[] // Traços de personalidade
  specialAbilities: string[] // Habilidades especiais
  classAptitudes: CharacterClass[] // Classes para as quais tem aptidão
  familyLegacy: string[] // Legado familiar
  spiritualAffinity: string[] // Afinidades espirituais herdadas
}

export class FamilySystem {
  private families: Map<string, Family> = new Map()
  private marriageProposals: Map<string, MarriageProposal> = new Map()

  // Criar nova família
  createFamily(
    founderId: string,
    founderName: string,
    familyName: string,
    initialMember: FamilyMember
  ): Family {
    const family: Family = {
      id: `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: familyName,
      founder: founderId,
      members: [initialMember],
      generation: 1,
      reputation: 0,
      wealth: 100, // Riqueza inicial
      influence: 0,
      territories: [],
      familyTraits: [],
      bloodlinePowers: [],
      rivalFamilies: [],
      alliances: []
    }

    this.families.set(family.id, family)
    return family
  }

  // Sistema de casamento
  proposeMarriage(
    proposerId: string,
    targetId: string,
    dowry: number = 0,
    conditions: string[] = []
  ): MarriageProposal {
    const proposal: MarriageProposal = {
      id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      proposerId,
      targetId,
      proposalDate: new Date(),
      status: 'pending',
      dowry,
      conditions
    }

    this.marriageProposals.set(proposal.id, proposal)
    return proposal
  }

  // Aceitar proposta de casamento
  acceptMarriage(proposalId: string): Family | null {
    const proposal = this.marriageProposals.get(proposalId)
    if (!proposal || proposal.status !== 'pending') return null

    proposal.status = 'accepted'

    // Criar nova família ou adicionar ao cônjuge
    const spouseFamily = this.findFamilyByMember(proposal.targetId)
    const proposerFamily = this.findFamilyByMember(proposal.proposerId)

    if (spouseFamily && proposerFamily && spouseFamily.id !== proposerFamily.id) {
      // Mesclar famílias ou criar aliança
      return this.mergeFamilies(proposerFamily, spouseFamily)
    } else if (spouseFamily) {
      // Adicionar à família existente
      return this.addSpouseToFamily(proposal.proposerId, spouseFamily.id)
    } else if (proposerFamily) {
      // Adicionar à família do proposer
      return this.addSpouseToFamily(proposal.targetId, proposerFamily.id)
    } else {
      // Criar nova família
      return this.createNewMarriedFamily(proposal.proposerId, proposal.targetId)
    }
  }

  private mergeFamilies(family1: Family, family2: Family): Family {
    // Lógica complexa de fusão familiar
    const mergedFamily: Family = {
      ...family1,
      name: `${family1.name}-${family2.name}`,
      members: [...family1.members, ...family2.members],
      wealth: family1.wealth + family2.wealth,
      influence: Math.max(family1.influence, family2.influence),
      territories: [...new Set([...family1.territories, ...family2.territories])],
      familyTraits: [...new Set([...family1.familyTraits, ...family2.familyTraits])],
      bloodlinePowers: [...new Set([...family1.bloodlinePowers, ...family2.bloodlinePowers])]
    }

    // Atualizar referências
    this.families.set(mergedFamily.id, mergedFamily)
    this.families.delete(family2.id)

    return mergedFamily
  }

  private addSpouseToFamily(spouseId: string, familyId: string): Family | null {
    const family = this.families.get(familyId)
    if (!family) return null

    // Lógica para adicionar cônjuge
    // (implementação simplificada)
    return family
  }

  private createNewMarriedFamily(spouse1Id: string, spouse2Id: string): Family {
    // Criar família baseada nos cônjuges
    // (implementação simplificada)
    return {} as Family
  }

  // Sistema de geração de filhos
  generateChild(
    parent1: FamilyMember,
    parent2: FamilyMember,
    childName: string,
    birthLocation: string
  ): FamilyMember {
    const child: FamilyMember = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: childName,
      age: 0,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      relationship: 'child',
      characterClass: CharacterClass.CAMPONES, // Classe inicial
      attributes: this.generateChildAttributes(parent1.attributes, parent2.attributes),
      traits: this.generateChildTraits(parent1, parent2),
      isAlive: true,
      birthDate: new Date(),
      significantEvents: [{
        date: new Date(),
        event: `Nascido em ${birthLocation}`,
        impact: 'positive'
      }]
    }

    return child
  }

  // Gerar atributos do filho baseados nos pais
  private generateChildAttributes(
    parent1Attrs: ExpandedAttributes,
    parent2Attrs: ExpandedAttributes
  ): ExpandedAttributes {
    const childAttrs: ExpandedAttributes = {
      corpo: 5,
      forca: 5,
      agilidade: 5,
      percepcao: 5,
      intelecto: 5,
      vontade: 5,
      harmonia_espiritual: 0,
      resistencia_sobrenatural: 0,
      afinidade_elemental: 0,
      empatia_emocional: 0,
      memoria_ancestral: 0,
      adaptabilidade_mistica: 0
    }

    // Herdar atributos com variação genética
    const geneticVariation = () => Math.floor(Math.random() * 3) - 1 // -1, 0, ou 1

    Object.keys(childAttrs).forEach(attr => {
      const attrKey = attr as keyof ExpandedAttributes
      const parent1Value = parent1Attrs[attrKey] || 0
      const parent2Value = parent2Attrs[attrKey] || 0

      // Média dos pais + variação genética
      const baseValue = Math.floor((parent1Value + parent2Value) / 2)
      childAttrs[attrKey] = Math.max(0, baseValue + geneticVariation())
    })

    return childAttrs
  }

  // Gerar traços do filho
  private generateChildTraits(parent1: FamilyMember, parent2: FamilyMember): string[] {
    const allTraits = [...parent1.traits, ...parent2.traits]
    const uniqueTraits = [...new Set(allTraits)]

    // Selecionar 2-4 traços dos pais
    const selectedTraits: string[] = []
    const numTraits = Math.min(uniqueTraits.length, 2 + Math.floor(Math.random() * 3))

    for (let i = 0; i < numTraits; i++) {
      const randomTrait = uniqueTraits[Math.floor(Math.random() * uniqueTraits.length)]
      if (!selectedTraits.includes(randomTrait)) {
        selectedTraits.push(randomTrait)
      }
    }

    // Chance de traço único
    if (Math.random() < 0.1) { // 10% de chance
      selectedTraits.push(this.generateUniqueTrait())
    }

    return selectedTraits
  }

  // Gerar traço único especial
  private generateUniqueTrait(): string {
    const uniqueTraits = [
      'Visão Noturna',
      'Sorte Natural',
      'Resistência ao Frio',
      'Memória Fotográfica',
      'Carisma Natural',
      'Intuição Aguçada',
      'Força Interior',
      'Adaptabilidade',
      'Paz Interior',
      'Determinação Inabalável'
    ]

    return uniqueTraits[Math.floor(Math.random() * uniqueTraits.length)]
  }

  // Sistema de herança e evolução dos filhos
  calculateChildInheritance(
    child: FamilyMember,
    parents: FamilyMember[],
    family: Family
  ): ChildInheritance {
    const inheritance: ChildInheritance = {
      physicalTraits: this.generatePhysicalTraits(parents),
      personalityTraits: child.traits,
      specialAbilities: [],
      classAptitudes: this.calculateClassAptitudes(parents),
      familyLegacy: family.bloodlinePowers,
      spiritualAffinity: this.calculateSpiritualAffinity(parents)
    }

    // Adicionar habilidades especiais baseadas na família
    if (family.bloodlinePowers.length > 0) {
      inheritance.specialAbilities.push(...family.bloodlinePowers.slice(0, 2))
    }

    return inheritance
  }

  private generatePhysicalTraits(parents: FamilyMember[]): string[] {
    const traits: string[] = []

    // Traços baseados na aparência dos pais
    if (parents.some(p => p.traits.includes('Alto'))) traits.push('Alto')
    if (parents.some(p => p.traits.includes(' Forte'))) traits.push('Musculoso')
    if (parents.some(p => p.traits.includes(' Inteligente'))) traits.push('Expressão Inteligente')
    if (parents.some(p => p.traits.includes(' Ágil'))) traits.push('Leve')

    // Traços únicos
    const possibleTraits = [
      'Olhos Escuros', 'Cabelos Compridos', 'Pele Clara', 'Olhos Claros',
      'Cabelos Escuros', 'Estatura Média', 'Constituição Robusta', 'Traços Delicados'
    ]

    // Adicionar 2-3 traços físicos
    const numTraits = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < numTraits; i++) {
      const trait = possibleTraits[Math.floor(Math.random() * possibleTraits.length)]
      if (!traits.includes(trait)) {
        traits.push(trait)
      }
    }

    return traits
  }

  private calculateClassAptitudes(parents: FamilyMember[]): CharacterClass[] {
    const aptitudes = new Set<CharacterClass>()

    // Herdar aptidões dos pais
    parents.forEach(parent => {
      aptitudes.add(parent.characterClass)

      // Adicionar classes relacionadas
      const relatedClasses = this.getRelatedClasses(parent.characterClass)
      relatedClasses.forEach(cls => aptitudes.add(cls))
    })

    return Array.from(aptitudes)
  }

  private getRelatedClasses(characterClass: CharacterClass): CharacterClass[] {
    const related: Record<CharacterClass, CharacterClass[]> = {
      [CharacterClass.CAMPONES]: [CharacterClass.LENHADOR, CharacterClass.CURANDEIRO],
      [CharacterClass.FERREIRO]: [CharacterClass.MERCADOR, CharacterClass.SOLDADO_RASO],
      [CharacterClass.LENHADOR]: [CharacterClass.CAMPONES, CharacterClass.PROTETOR_DA_NATUREZA],
      [CharacterClass.PESCADOR]: [CharacterClass.MERCADOR, CharacterClass.MENSAGEIRO],
      [CharacterClass.MERCADOR]: [CharacterClass.FERREIRO, CharacterClass.ARTISTA_AMBULANTE],
      [CharacterClass.MENSAGEIRO]: [CharacterClass.PESCADOR, CharacterClass.ARTISTA_AMBULANTE],
      [CharacterClass.MONGE_BUDISTA]: [CharacterClass.SACERDOTE_XINTOISTA, CharacterClass.MEDIADOR_ESPIRITUAL],
      [CharacterClass.SACERDOTE_XINTOISTA]: [CharacterClass.MONGE_BUDISTA, CharacterClass.PROTETOR_DA_NATUREZA],
      [CharacterClass.SOLDADO_RASO]: [CharacterClass.FERREIRO, CharacterClass.GUARDIAO_DOS_IMPOSTORES],
      [CharacterClass.CURANDEIRO]: [CharacterClass.CAMPONES, CharacterClass.HARMONIZADOR_DE_EMOCOES],
      [CharacterClass.ARTISTA_AMBULANTE]: [CharacterClass.MENSAGEIRO, CharacterClass.MERCADOR],

      // Classes evoluídas têm menos relações
      [CharacterClass.GUARDIAO_DOS_IMPOSTORES]: [CharacterClass.SOLDADO_RASO],
      [CharacterClass.VIAJANTE_ENTRE_MUNDOS]: [CharacterClass.MENSAGEIRO],
      [CharacterClass.DEVORADOR_DE_ALMAS]: [CharacterClass.CURANDEIRO],
      [CharacterClass.MEDIADOR_ESPIRITUAL]: [CharacterClass.MONGE_BUDISTA],
      [CharacterClass.GUIA_DOS_PERDIDOS]: [CharacterClass.SACERDOTE_XINTOISTA],
      [CharacterClass.HARMONIZADOR_DE_EMOCOES]: [CharacterClass.CURANDEIRO],
      [CharacterClass.PROTETOR_DA_NATUREZA]: [CharacterClass.LENHADOR],
      [CharacterClass.GUARDIAO_DOS_ANTIGOS]: [CharacterClass.MERCADOR]
    }

    return related[characterClass] || []
  }

  private calculateSpiritualAffinity(parents: FamilyMember[]): string[] {
    const affinities: string[] = []

    // Verificar classes espirituais dos pais
    parents.forEach(parent => {
      if (this.isSpiritualClass(parent.characterClass)) {
        affinities.push(this.getSpiritualAffinity(parent.characterClass))
      }
    })

    return [...new Set(affinities)]
  }

  private isSpiritualClass(characterClass: CharacterClass): boolean {
    const spiritualClasses = [
      CharacterClass.MONGE_BUDISTA,
      CharacterClass.SACERDOTE_XINTOISTA,
      CharacterClass.MEDIADOR_ESPIRITUAL,
      CharacterClass.GUIA_DOS_PERDIDOS,
      CharacterClass.HARMONIZADOR_DE_EMOCOES,
      CharacterClass.PROTETOR_DA_NATUREZA,
      CharacterClass.GUARDIAO_DOS_ANTIGOS
    ]

    return spiritualClasses.includes(characterClass)
  }

  private getSpiritualAffinity(characterClass: CharacterClass): string {
    const affinities: Partial<Record<CharacterClass, string>> = {
      [CharacterClass.MONGE_BUDISTA]: 'Iluminação Espiritual',
      [CharacterClass.SACERDOTE_XINTOISTA]: 'Comunhão com Kami',
      [CharacterClass.MEDIADOR_ESPIRITUAL]: 'Diplomacia Espiritual',
      [CharacterClass.GUIA_DOS_PERDIDOS]: 'Compaixão pelos Mortos',
      [CharacterClass.HARMONIZADOR_DE_EMOCOES]: 'Harmonia Emocional',
      [CharacterClass.PROTETOR_DA_NATUREZA]: 'Proteção Natural',
      [CharacterClass.GUARDIAO_DOS_ANTIGOS]: 'Preservação Temporal'
    }

    return affinities[characterClass] || 'Espiritualidade Geral'
  }

  // Envelhecimento e eventos da família
  ageFamilyMembers(): void {
    this.families.forEach(family => {
      family.members.forEach(member => {
        if (member.isAlive) {
          member.age++

          // Eventos baseados na idade
          if (member.age === 13) {
            // Cerimônia de passagem
            member.significantEvents.push({
              date: new Date(),
              event: 'Cerimônia de passagem para adulto',
              impact: 'positive'
            })
          } else if (member.age === 60) {
            // Aposentadoria
            member.significantEvents.push({
              date: new Date(),
              event: 'Aposentadoria e passagem do legado',
              impact: 'neutral'
            })
          } else if (member.age >= 80 && Math.random() < 0.1) {
            // Morte natural
            this.handleMemberDeath(member, 'idade avançada')
          }
        }
      })
    })
  }

  // Sistema de morte
  handleMemberDeath(member: FamilyMember, cause: string): void {
    member.isAlive = false
    member.deathCause = cause

    member.significantEvents.push({
      date: new Date(),
      event: `Morreu devido a ${cause}`,
      impact: 'negative'
    })

    // Impacto na família
    const family = this.findFamilyByMember(member.id)
    if (family) {
      if (member.relationship === 'child') {
        family.reputation -= 5 // Tragédia familiar
      } else if (member.age >= 60) {
        family.reputation += 2 // Morte honrosa na velhice
      }
    }
  }

  // Utilitários
  findFamilyByMember(memberId: string): Family | undefined {
    for (const family of this.families.values()) {
      if (family.members.some(m => m.id === memberId)) {
        return family
      }
    }
    return undefined
  }

  getFamily(familyId: string): Family | undefined {
    return this.families.get(familyId)
  }

  getAllFamilies(): Family[] {
    return Array.from(this.families.values())
  }

  // Serialização
  serialize(): string {
    return JSON.stringify({
      families: Array.from(this.families.entries()),
      marriageProposals: Array.from(this.marriageProposals.entries()),
      serializedAt: new Date().toISOString()
    })
  }

  deserialize(data: string): void {
    try {
      const parsed = JSON.parse(data)
      this.families = new Map(parsed.families)
      this.marriageProposals = new Map(parsed.marriageProposals)

      // Converter datas
      this.families.forEach(family => {
        family.members.forEach(member => {
          member.birthDate = new Date(member.birthDate)
          member.significantEvents.forEach(event => {
            event.date = new Date(event.date)
          })
        })
      })

      this.marriageProposals.forEach(proposal => {
        proposal.proposalDate = new Date(proposal.proposalDate)
      })
    } catch (error) {
      console.error('Erro ao desserializar sistema familiar:', error)
    }
  }
}

export const familySystem = new FamilySystem()