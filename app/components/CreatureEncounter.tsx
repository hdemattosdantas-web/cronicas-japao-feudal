'use client'

import React, { useState } from 'react'
import { CreatureEncounter as CreatureEncounterType } from '../../lib/game/creature-types'

interface CreatureEncounterProps {
  encounter: CreatureEncounterType
  onResolve: (choice: 'peaceful' | 'confrontational' | 'avoidance' | 'observe') => void
  onDismiss: () => void
}

export default function CreatureEncounter({
  encounter,
  onResolve,
  onDismiss
}: CreatureEncounterProps) {
  const [revealedClues, setRevealedClues] = useState<number[]>([])
  const [showDetails, setShowDetails] = useState(false)

  const revealClue = (index: number) => {
    if (!revealedClues.includes(index)) {
      setRevealedClues([...revealedClues, index])
    }
  }

  const getDangerColor = (danger: string) => {
    switch (danger) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'extreme': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDangerIcon = (danger: string) => {
    switch (danger) {
      case 'low': return '🔔'
      case 'medium': return '⚠️'
      case 'high': return '🚨'
      case 'extreme': return '☠️'
      default: return '❓'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getDangerIcon(encounter.danger)}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Encontro Misterioso
                </h2>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDangerColor(encounter.danger)}`}>
                  {encounter.danger === 'low' && 'Observação'}
                  {encounter.danger === 'medium' && 'Inquietante'}
                  {encounter.danger === 'high' && 'Perigoso'}
                  {encounter.danger === 'extreme' && 'Crítico'}
                </span>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6">
          {/* Descrição Inicial */}
          <div className="mb-6">
            <p className="text-gray-700 italic leading-relaxed">
              "{encounter.description}"
            </p>
          </div>

          {/* Pistas Sutis */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>📝</span>
              Observações Registradas
            </h3>
            <div className="space-y-2">
              {encounter.clues.map((clue, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => revealClue(index)}
                >
                  {revealedClues.includes(index) ? (
                    <p className="text-gray-700">{clue}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Clique para revelar pista...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Manifestações */}
          {encounter.manifestations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>👁️</span>
                Manifestações Observadas
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {encounter.manifestations.map((manifestation, index) => (
                    <li key={index} className="text-gray-600 flex items-start gap-2">
                      <span className="text-xs mt-1">•</span>
                      <span>{manifestation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Detalhes Avançados (toggle) */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showDetails ? 'Ocultar' : 'Mostrar'} considerações sobre consequências...
            </button>

            {showDetails && (
              <div className="mt-4 space-y-4">
                {/* Efeitos Imediatos */}
                {encounter.playerEffects.immediate && encounter.playerEffects.immediate.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Efeitos Imediatos Possíveis</h4>
                    <ul className="space-y-1">
                      {encounter.playerEffects.immediate.map((effect, index) => (
                        <li key={index} className="text-blue-800 text-sm">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Efeitos Graduais */}
                {encounter.playerEffects.gradual && encounter.playerEffects.gradual.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Mudanças Graduais</h4>
                    <ul className="space-y-1">
                      {encounter.playerEffects.gradual.map((effect, index) => (
                        <li key={index} className="text-yellow-800 text-sm">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Efeitos Permanentes */}
                {encounter.playerEffects.permanent && encounter.playerEffects.permanent.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Consequências Duradouras</h4>
                    <ul className="space-y-1">
                      {encounter.playerEffects.permanent.map((effect, index) => (
                        <li key={index} className="text-red-800 text-sm">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Opções de Resolução */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>🤔</span>
              Como proceder?
            </h3>
            <div className="grid gap-3">
              {encounter.resolutionOptions.peaceful.length > 0 && (
                <button
                  onClick={() => onResolve('peaceful')}
                  className="p-4 border-2 border-green-200 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
                >
                  <div className="font-medium text-green-900 mb-1">🕊️ Abordagem Pacifica</div>
                  <div className="text-sm text-green-700">
                    {encounter.resolutionOptions.peaceful[0]}
                  </div>
                </button>
              )}

              {encounter.resolutionOptions.confrontational.length > 0 && (
                <button
                  onClick={() => onResolve('confrontational')}
                  className="p-4 border-2 border-red-200 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
                >
                  <div className="font-medium text-red-900 mb-1">⚔️ Investigar Ativamente</div>
                  <div className="text-sm text-red-700">
                    {encounter.resolutionOptions.confrontational[0]}
                  </div>
                </button>
              )}

              {encounter.resolutionOptions.avoidance.length > 0 && (
                <button
                  onClick={() => onResolve('avoidance')}
                  className="p-4 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                >
                  <div className="font-medium text-blue-900 mb-1">👣 Retirar-se Discretamente</div>
                  <div className="text-sm text-blue-700">
                    {encounter.resolutionOptions.avoidance[0]}
                  </div>
                </button>
              )}

              <button
                onClick={() => onResolve('observe')}
                className="p-4 border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-gray-900 mb-1">👀 Apenas Observar</div>
                <div className="text-sm text-gray-700">
                  Manter distância e registrar observações
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-500">
            Algumas coisas são melhores deixadas sem explicação completa...
          </p>
        </div>
      </div>
    </div>
  )
}