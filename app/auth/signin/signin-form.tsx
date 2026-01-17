"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Email sign-in temporariamente desabilitado devido a problemas com adapter
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("🔧 Login por email temporariamente indisponível. Use Google para continuar.")
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      setMessage("Erro ao fazer login com Google.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Google Sign In */}
      <div>
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3"
          style={{
            backgroundColor: '#4285f4',
            border: 'none',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continuar com Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2" style={{ backgroundColor: 'var(--background)' }}>ou</span>
        </div>
      </div>

      {/* Email Sign In */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            📧 Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full"
            disabled={isLoading}
          />
          <p className="text-xs opacity-70 mt-1">
            Receba um link mágico por email (sem senha necessária)
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full"
          style={{
            opacity: (isLoading || !email) ? 0.7 : 1,
            cursor: (isLoading || !email) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '📤 Enviando...' : '📧 Enviar Link Mágico'}
        </button>
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