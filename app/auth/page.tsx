'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
      } else {
        // Registro
        await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      }

      router.push('/home')
    } catch (error: any) {
      let errorMessage = 'Erro na autenticação'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está cadastrado'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">🏯 Crônicas do Japão</h1>
          <p className="text-amber-700">
            {isLogin ? 'Bem-vindo de volta, samurai!' : 'Comece sua jornada no Japão feudal!'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Seu nome"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-amber-600 hover:text-amber-700 font-semibold"
            >
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
