'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface OnboardingModalProps {
  onClose: () => void
  onContinue: () => void
}

export default function OnboardingModal({ onClose, onContinue }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Você não começa como um herói.",
      content: `Você começa como alguém que nasceu em uma época difícil,
em um território instável,
em um mundo que não se importa com intenções.`
    },
    {
      title: "Sua jornada começa comum.",
      content: `Sua profissão define sua rotina.
Sua idade define suas limitações.
Sua história define quem você é.`
    },
    {
      title: "O mundo reagirá a você.",
      content: `O mundo reagirá a você com indiferença, curiosidade ou violência.

O sobrenatural existe —
mas não se revela para quem não está preparado para vê-lo.`
    },
    {
      title: "Escreva sua história com cuidado.",
      content: `Escreva sua história com cuidado.
Ela moldará seu corpo, sua mente
e aquilo que você será capaz de perceber.`
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onContinue()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Mesa Feudal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-red-600' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="min-h-[300px] flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-white mb-8 leading-tight">
              {steps[currentStep].title}
            </h3>

            <div className="text-xl text-gray-300 leading-relaxed whitespace-pre-line max-w-lg mx-auto">
              {steps[currentStep].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              ← Anterior
            </button>

            <span className="text-gray-400">
              {currentStep + 1} de {steps.length}
            </span>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Começar Jornada' : 'Próximo →'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-800 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            "O mundo não gira em torno do jogador. As coisas acontecem quer você veja ou não."
          </p>
        </div>
      </div>
    </div>
  )
}