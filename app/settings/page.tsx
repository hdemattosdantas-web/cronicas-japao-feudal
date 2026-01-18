"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [currentUsername, setCurrentUsername] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    loadCurrentUsername()
  }, [session, status])

  const loadCurrentUsername = async () => {
    try {
      const response = await fetch('/api/username')
      if (response.ok) {
        const data = await response.json()
        setCurrentUsername(data.username || "")
        setUsername(data.username || "")
      }
    } catch (error) {
      console.error('Erro ao carregar username:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!username.trim()) {
      setMessage("Nome de usuário é obrigatório")
      setIsLoading(false)
      return
    }

    if (username.length < 3) {
      setMessage("Nome de usuário deve ter pelo menos 3 caracteres")
      setIsLoading(false)
      return
    }

    if (username.length > 20) {
      setMessage("Nome de usuário deve ter no máximo 20 caracteres")
      setIsLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setMessage("Nome de usuário deve conter apenas letras, números e underscores")
      setIsLoading(false)
      return
    }

    if (username === currentUsername) {
      setMessage("Nome de usuário não foi alterado")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Erro ao atualizar nome de usuário')
        return
      }

      setMessage("✅ Nome de usuário atualizado com sucesso!")
      setCurrentUsername(data.username)
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao atualizar nome de usuário")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <p>Carregando configurações...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Redirecionará
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              ⚙️ Configurações
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Gerencie seu perfil e preferências
            </p>
          </div>
          <Link href="/">
            <button style={{
              background: 'transparent',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
              padding: '8px 16px',
              borderRadius: '6px'
            }}>
              ← Voltar ao Início
            </button>
          </Link>
        </div>

        {/* Seção de Perfil */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Perfil do Usuário
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block interface-label mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={session.user?.email || ""}
                disabled
                className="w-full px-3 py-2 border border-border rounded bg-gray-100"
                style={{ cursor: 'not-allowed' }}
              />
              <p className="text-xs interface-small mt-1 opacity-60">
                Email não pode ser alterado
              </p>
            </div>

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
              />
              <p className="text-xs interface-small mt-1">
                Este é seu nome único para encontrar amigos
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading || username === currentUsername}
              className="btn-primary"
              style={{
                opacity: (isLoading || username === currentUsername) ? 0.7 : 1,
                cursor: (isLoading || username === currentUsername) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? "Salvando..." : "💾 Salvar Alterações"}
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('✅')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Informações do Sistema */}
        <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-bold mb-4">📋 Informações do Sistema</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🎮 Sistema de Amigos</h4>
              <ul className="text-sm space-y-1">
                <li>• Use seu nome de usuário para ser encontrado</li>
                <li>• Busque amigos por @username ou email</li>
                <li>• Convide amigos online para salas</li>
                <li>• Status online atualizado automaticamente</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🎒 Sistema de Inventário</h4>
              <ul className="text-sm space-y-1">
                <li>• Cada personagem tem sua própria bolsa</li>
                <li>• Capacidade varia por profissão</li>
                <li>• Itens essenciais no início</li>
                <li>• Equipamentos fornecem bônus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-bold mb-4">🔗 Links Rápidos</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/characters">
              <button className="w-full text-sm" style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '8px',
                borderRadius: '6px'
              }}>
                🏯 Personagens
              </button>
            </Link>
            
            <Link href="/friends">
              <button className="w-full text-sm" style={{
                background: '#10b981',
                color: 'white',
                padding: '8px',
                borderRadius: '6px'
              }}>
                👥 Amigos
              </button>
            </Link>
            
            <Link href="/rooms">
              <button className="w-full text-sm" style={{
                background: '#3b82f6',
                color: 'white',
                padding: '8px',
                borderRadius: '6px'
              }}>
                🏰 Salas
              </button>
            </Link>
            
            <Link href="/achievements">
              <button className="w-full text-sm" style={{
                background: '#8b5cf6',
                color: 'white',
                padding: '8px',
                borderRadius: '6px'
              }}>
                🏆 Conquistas
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
