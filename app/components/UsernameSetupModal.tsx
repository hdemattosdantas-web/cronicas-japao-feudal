"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"

interface UsernameSetupModalProps {
  onComplete: () => void
}

export function UsernameSetupModal({ onComplete }: UsernameSetupModalProps) {
  const { data: session } = useSession()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!username.trim()) {
      setError("Nome de usuário é obrigatório")
      setIsLoading(false)
      return
    }

    if (username.length < 3) {
      setError("Nome de usuário deve ter pelo menos 3 caracteres")
      setIsLoading(false)
      return
    }

    try {
      // TODO: Salvar username no backend quando o banco estiver funcionando
      // Por enquanto, vamos apenas simular e fechar o modal
      console.log("Username definido:", username)

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      onComplete()
    } catch (error) {
      setError("Erro ao salvar nome de usuário")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="card max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="title-section mb-2">🏯 Bem-vindo ao Mundo Feudal</h2>
          <p className="narrative-body">
            Para conectar com outros jogadores e encontrar amigos,
            defina seu nome de usuário único.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block interface-label mb-2">
              📛 Nome de Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu_nome_aqui"
              className="w-full px-3 py-2 border border-border rounded bg-ancient-paper text-coal-black"
              disabled={isLoading}
              required
            />
            <p className="text-xs interface-small mt-1">
              Este será seu nome visível para outros jogadores
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => signOut()}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              Sair
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? "Salvando..." : "Continuar"}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 rounded-lg text-xs interface-small opacity-75" style={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
          <p>
            <strong>🎭 Sobre Nomes de Usuário:</strong><br />
            Escolha um nome único que outros jogadores possam encontrar.
            Você pode alterá-lo depois nas configurações.
          </p>
        </div>
      </div>
    </div>
  )
}