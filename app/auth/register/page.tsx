"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validações
    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      setIsLoading(false)
      return
    }

    if (!formData.username.trim()) {
      setError("Nome de usuário é obrigatório")
      setIsLoading(false)
      return
    }

    if (formData.username.length < 3) {
      setError("Nome de usuário deve ter pelo menos 3 caracteres")
      setIsLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório")
      setIsLoading(false)
      return
    }

    if (!formData.password) {
      setError("Senha é obrigatória")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implementar registro no backend quando banco estiver funcionando
      // Por enquanto, simular registro e redirecionar para login
      console.log("Dados de registro:", formData)

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert("✅ Conta criada com sucesso! Faça login para continuar.")
      router.push("/auth/signin")

    } catch (error) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container fade-in">
      <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <div className="text-center mb-6">
          <h1 className="title-hero mb-4">
            🏯 Criar Conta
          </h1>
          <p className="narrative-body">
            Junte-se aos aventureiros do Japão feudal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block interface-label mb-2">
              👤 Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              className="w-full px-3 py-2 border border-border rounded bg-ancient-paper text-coal-black"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block interface-label mb-2">
              📛 Nome de Usuário
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="seu_nome_unico"
              className="w-full px-3 py-2 border border-border rounded bg-ancient-paper text-coal-black"
              disabled={isLoading}
              required
            />
            <p className="text-xs interface-small mt-1">
              Este será seu nome único no jogo
            </p>
          </div>

          <div>
            <label className="block interface-label mb-2">
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              className="w-full px-3 py-2 border border-border rounded bg-ancient-paper text-coal-black"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block interface-label mb-2">
              🔒 Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Sua senha"
              className="w-full px-3 py-2 border border-border rounded bg-ancient-paper text-coal-black"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block interface-label mb-2">
              🔒 Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
              className="w-full px-3 py-2 border border-border rounded bg-ancient-paper text-coal-black"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "🏯 Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="interface-small mb-2">
            Já tem uma conta?
          </p>
          <Link href="/auth/signin">
            <button className="btn-secondary">
              🚪 Fazer Login
            </button>
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-lg text-xs interface-small opacity-75" style={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
          <p>
            <strong>🎭 Sobre o Cadastro:</strong><br />
            Suas informações são protegidas. Escolha um nome de usuário único que outros jogadores possam encontrar.
          </p>
        </div>
      </div>
    </div>
  )
}