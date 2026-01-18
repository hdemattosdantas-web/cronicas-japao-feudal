import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignInForm } from "./signin-form"

export default async function SignInPage() {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="container fade-in">
      <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
            🏯 Entrar no Mundo Feudal
          </h1>
          <p className="text-sm opacity-70 mt-2">
            Faça login para salvar seus personagens e continuar suas campanhas
          </p>
        </div>

        <SignInForm />

        <div className="mt-6 text-center">
          <Link href="/">
            <button style={{
              background: 'transparent',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              ← Voltar ao Início
            </button>
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-lg text-xs opacity-60" style={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
          <p>
            <strong>🎭 Sobre a Autenticação:</strong><br />
            Seus dados são protegidos e criptografados. Faça login usando email e senha cadastrados.
          </p>
        </div>
      </div>
    </div>
  )
}