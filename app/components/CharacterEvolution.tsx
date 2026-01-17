'use client'

import React, { useState, useEffect } from 'react'
import {
  CharacterEvolutionManager,
  CharacterClass,
  CreatureType,
  ExpandedAttributes
} from '../../lib/game/character-evolution'

// Interface temporária para FamilyMember
interface FamilyMember {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'non_binary'
  relationship: string
  characterClass: CharacterClass
  attributes?: ExpandedAttributes
  traits: string[]
  isAlive: boolean
  birthDate?: Date
  significantEvents?: Array<{
    date: Date
    event: string
    impact: string
  }>
}

interface CharacterEvolutionProps {
  characterId: string
  currentAttributes: ExpandedAttributes
  onAttributesChange: (newAttributes: ExpandedAttributes) => void
}

export default function CharacterEvolution({
  characterId,
  currentAttributes,
  onAttributesChange
}: CharacterEvolutionProps) {
  const [evolutionManager] = useState(() => new CharacterEvolutionManager())
  const [evolutionData, setEvolutionData] = useState(evolutionManager.getEvolutionData())
  const [showFamily, setShowFamily] = useState(false)
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(evolutionData.currentClass)

  useEffect(() => {
    // Calcular atributos totais quando dados mudarem
    const totalAttributes = evolutionManager.calculateTotalAttributes(currentAttributes)
    onAttributesChange(totalAttributes)
  }, [evolutionData, currentAttributes, onAttributesChange])

  const handleClassChange = (newClass: CharacterClass) => {
    if (evolutionManager.changeClass(newClass)) {
      setEvolutionData(evolutionManager.getEvolutionData())
      setSelectedClass(newClass)
    }
  }

  const getClassDisplayName = (characterClass: CharacterClass): string => {
    const names: Record<CharacterClass, string> = {
      [CharacterClass.CAMPONES]: 'Camponês',
      [CharacterClass.FERREIRO]: 'Ferreiro',
      [CharacterClass.LENHADOR]: 'Lenhador',
      [CharacterClass.PESCADOR]: 'Pescador',
      [CharacterClass.MERCADOR]: 'Mercador',
      [CharacterClass.MENSAGEIRO]: 'Mensageiro',
      [CharacterClass.MONGE_BUDISTA]: 'Monge Budista',
      [CharacterClass.SACERDOTE_XINTOISTA]: 'Sacerdote Xintoísta',
      [CharacterClass.SOLDADO_RASO]: 'Soldado Raso',
      [CharacterClass.CURANDEIRO]: 'Curandeiro',
      [CharacterClass.ARTISTA_AMBULANTE]: 'Artista Ambulante',
      [CharacterClass.GUARDIAO_DOS_IMPOSTORES]: 'Guardião dos Impostores',
      [CharacterClass.VIAJANTE_ENTRE_MUNDOS]: 'Viajante entre Mundos',
      [CharacterClass.DEVORADOR_DE_ALMAS]: 'Devorador de Almas',
      [CharacterClass.MEDIADOR_ESPIRITUAL]: 'Mediador Espiritual',
      [CharacterClass.GUIA_DOS_PERDIDOS]: 'Guia dos Perdidos',
      [CharacterClass.HARMONIZADOR_DE_EMOCOES]: 'Harmonizador de Emoções',
      [CharacterClass.PROTETOR_DA_NATUREZA]: 'Protetor da Natureza',
      [CharacterClass.GUARDIAO_DOS_ANTIGOS]: 'Guardião dos Antigos'
    }
    return names[characterClass] || characterClass
  }

  const getCreatureDisplayName = (creatureType: CreatureType): string => {
    const names: Record<CreatureType, string> = {
      [CreatureType.SUBSTITUTOS]: 'Substitutos',
      [CreatureType.ENTIDADES_CONTATO]: 'Entidades de Contato',
      [CreatureType.GHOULS]: 'Ghouls',
      [CreatureType.YOKAI_TRADICIONAIS]: 'Yōkai Tradicionais',
      [CreatureType.YUREI]: 'Yūrei',
      [CreatureType.MONONOKE]: 'Mononoke',
      [CreatureType.KAMI_MENORES]: 'Kami Menores',
      [CreatureType.TSUKUMOGAMI]: 'Tsukumogami'
    }
    return names[creatureType] || creatureType
  }

  const totalAttributes = evolutionManager.calculateTotalAttributes(currentAttributes)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Evolução do Personagem</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFamily(!showFamily)}
            className={`px-4 py-2 rounded ${
              showFamily ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            👨‍👩‍👧‍👦 Família
          </button>
        </div>
      </div>

      {/* Status de Evolução */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Classe Atual</h3>
          <p className="text-blue-700 text-lg font-medium">
            {getClassDisplayName(evolutionData.currentClass)}
          </p>
          <p className="text-blue-600 text-sm">
            Maestria: {evolutionData.classMastery[evolutionData.currentClass] || 0}%
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Despertar Espiritual</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${evolutionData.spiritualAwakening}%` }}
            ></div>
          </div>
          <p className="text-green-700 text-sm">{evolutionData.spiritualAwakening}% desperto</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Pontos de Evolução</h3>
          <p className="text-purple-700 text-2xl font-bold">{evolutionData.evolutionPoints}</p>
          <p className="text-purple-600 text-sm">Disponíveis para uso</p>
        </div>
      </div>

      {/* Seleção de Classe */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Classes Disponíveis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {evolutionData.availableClasses.map(characterClass => (
            <button
              key={characterClass}
              onClick={() => handleClassChange(characterClass)}
              className={`p-3 rounded-lg border-2 transition-all ${
                evolutionData.currentClass === characterClass
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium text-sm">
                {getClassDisplayName(characterClass)}
              </div>
              <div className="text-xs opacity-75">
                {evolutionData.classMastery[characterClass] || 0}% maestria
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Encontros com Criaturas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Encontros com Criaturas Místicas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(evolutionData.creatureEncounters).map(([type, record]) => (
            <div key={type} className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-sm mb-1">
                {getCreatureDisplayName(type as CreatureType)}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Encontros: {record.encounterCount}</div>
                <div>Sucessos: {record.successfulEncounters}</div>
                <div>Fracassos: {record.failedEncounters}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traços Únicos */}
      {evolutionData.uniqueTraits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Traços Únicos</h3>
          <div className="flex flex-wrap gap-2">
            {evolutionData.uniqueTraits.map((trait, index) => (
              <span
                key={index}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Evolução */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Histórico de Evolução</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {evolutionData.evolutionHistory.map((entry, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{entry.event}</span>
                <span className="text-gray-500">
                  {entry.date.toLocaleDateString()}
                </span>
              </div>
              {entry.classChange && (
                <div className="text-green-600 text-xs mt-1">
                  Nova classe desbloqueada: {getClassDisplayName(entry.classChange)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Atributos Totais */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Atributos Totais (incluindo bônus)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(totalAttributes).map(([attr, value]) => (
            <div key={attr} className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600 capitalize">
                {attr.replace(/_/g, ' ')}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {value || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal da Família */}
      {showFamily && (
        <FamilyPanel
          characterId={characterId}
          onClose={() => setShowFamily(false)}
        />
      )}
    </div>
  )
}

// Componente do painel familiar
interface FamilyPanelProps {
  characterId: string
  onClose: () => void
}

function FamilyPanel({ characterId, onClose }: FamilyPanelProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [showMarriage, setShowMarriage] = useState(false)
  const [showChildren, setShowChildren] = useState(false)

  // Simulação - em produção, isso viria da API
  useEffect(() => {
    // Mock data para demonstração
    const mockMembers: FamilyMember[] = [
      {
        id: characterId,
        name: 'Personagem Principal',
        age: 25,
        gender: 'male',
        relationship: 'child', // Na verdade seria o fundador
        characterClass: CharacterClass.CAMPONES,
        attributes: {} as ExpandedAttributes,
        traits: ['Determinado', 'Honesto'],
        isAlive: true,
        birthDate: new Date('1700-01-01'),
        significantEvents: []
      }
    ]
    setFamilyMembers(mockMembers)
  }, [characterId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Sistema Familiar</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Ações Familiares */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowMarriage(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
            >
              💍 Casamento
            </button>
            <button
              onClick={() => setShowChildren(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              👶 Filhos
            </button>
          </div>

          {/* Membros da Família */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyMembers.map(member => (
              <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    member.isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isAlive ? 'Vivo' : 'Falecido'}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div>Idade: {member.age} anos</div>
                  <div>Gênero: {member.gender === 'male' ? 'Masculino' : member.gender === 'female' ? 'Feminino' : 'Não binário'}</div>
                  <div>Classe: {member.characterClass}</div>
                  <div>Relação: {member.relationship}</div>
                </div>

                {member.traits.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Traços:</div>
                    <div className="flex flex-wrap gap-1">
                      {member.traits.map((trait, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Modal de Casamento */}
          {showMarriage && (
            <MarriageModal onClose={() => setShowMarriage(false)} />
          )}

          {/* Modal de Filhos */}
          {showChildren && (
            <ChildrenModal onClose={() => setShowChildren(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

// Modal de casamento
function MarriageModal({ onClose }: { onClose: () => void }) {
  const [targetName, setTargetName] = useState('')
  const [dowry, setDowry] = useState(0)

  const handlePropose = () => {
    // Lógica de proposta de casamento
    alert(`Proposta enviada para ${targetName} com dote de ${dowry} moedas!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Proposta de Casamento</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Pretendente</label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Digite o nome..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dote (moedas)</label>
            <input
              type="number"
              value={dowry}
              onChange={(e) => setDowry(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePropose}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded"
            >
              💍 Enviar Proposta
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal de filhos
function ChildrenModal({ onClose }: { onClose: () => void }) {
  const [childName, setChildName] = useState('')

  const handleGenerateChild = () => {
    // Lógica de geração de filho
    alert(`Filho ${childName} gerado com sucesso!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Gerar Filho</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Filho</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Digite o nome..."
            />
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="text-blue-800">
              <strong>Herança:</strong> O filho herdará traços físicos, personalidade e aptidões dos pais,
              além de possíveis poderes espirituais da linhagem familiar.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerateChild}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              👶 Gerar Filho
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}