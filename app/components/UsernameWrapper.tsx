"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { UsernameSetupModal } from "./UsernameSetupModal"

interface UsernameWrapperProps {
  children: React.ReactNode
}

export function UsernameWrapper({ children }: UsernameWrapperProps) {
  const { data: session, status } = useSession()
  const [showUsernameModal, setShowUsernameModal] = useState(false)

  useEffect(() => {
    // Verificar se o usuário está logado e não tem username
    if (status === "authenticated" && session?.user && !session.user.username) {
      // Pequeno delay para garantir que a página carregou
      const timer = setTimeout(() => {
        setShowUsernameModal(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [status, session])

  const handleUsernameComplete = () => {
    setShowUsernameModal(false)
    // TODO: Atualizar a sessão com o novo username
    window.location.reload() // Recarregar para atualizar a sessão
  }

  return (
    <>
      {children}
      {showUsernameModal && (
        <UsernameSetupModal onComplete={handleUsernameComplete} />
      )}
    </>
  )
}