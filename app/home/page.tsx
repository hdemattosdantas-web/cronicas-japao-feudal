'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-900">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            🏯 Bem-vindo ao Japão Feudal, {user.displayName || user.email}!
          </h1>
          <p className="text-amber-700 text-lg">
            Sua jornada como samurai começa agora...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-amber-900 mb-3">⚔️ Criar Personagem</h2>
            <p className="text-gray-600 mb-4">Crie seu samurai com habilidades únicas</p>
            <button 
              onClick={() => router.push('/characters')}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Começar
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-amber-900 mb-3">🏘️ Explorar Vila</h2>
            <p className="text-gray-600 mb-4">Visite a vila local e conheça outros personagens</p>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
              Explorar
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-amber-900 mb-3">📜 Missões</h2>
            <p className="text-gray-600 mb-4">Complete missões para ganhar honra e recompensas</p>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
              Ver Missões
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              // Implementar logout
              router.push('/auth')
            }}
            className="text-amber-600 hover:text-amber-700 underline"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
