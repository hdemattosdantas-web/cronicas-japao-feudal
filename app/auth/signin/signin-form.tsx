"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignInForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setMessage(result.error)
      } else if (result?.ok) {
        // Atualizar sessão e redirecionar
        await getSession()
        router.push("/")
      }
    } catch (error) {
      setMessage("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulário de Login por Nome de Usuário e Senha */}
      <form onSubmit={handleCredentialsSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            📛 Nome de Usuário
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="seu_usuario"
            required
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            🔒 Senha
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Sua senha"
            required
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.username || !formData.password}
          className="w-full"
          style={{
            opacity: (isLoading || !formData.username || !formData.password) ? 0.7 : 1,
            cursor: (isLoading || !formData.username || !formData.password) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '🚪 Entrando...' : '🚪 Entrar'}
        </button>

        {/* Link Esqueci minha senha */}
        <div className="text-center">
          <Link href="/auth/forgot-password" className="text-sm text-[#d4af37] hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </form>

      {/* Messages */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('✅')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Link para registro */}
      <div className="mt-6 text-center">
        <span className="interface-small">Não tem conta? </span>
        <Link href="/auth/register" className="text-gold hover:underline">
          Criar conta
        </Link>
      </div>
    </div>
  )
}