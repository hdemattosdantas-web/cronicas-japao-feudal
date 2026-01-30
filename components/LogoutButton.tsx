'use client'

import { useAuth } from '@/components/AuthProvider'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'

export default function LogoutButton() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/auth')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (!user) return null

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
    >
      Sair ({user.displayName || user.email})
    </button>
  )
}
