import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { InventoryComponent } from "@/app/components/InventoryComponent"
import Link from "next/link"

interface InventoryPageProps {
  params: {
    characterId: string
  }
}

export default async function InventoryPage({ params }: InventoryPageProps) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container fade-in">
      <div className="mb-6">
        <Link 
          href="/characters"
          className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 mb-4"
        >
          <span>←</span>
          <span>Voltar aos Personagens</span>
        </Link>
        
        <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
          🎒 Inventário do Personagem
        </h1>
        <p className="text-sm opacity-70 mt-2">
          Gerencie os itens e equipamentos do seu personagem
        </p>
      </div>

      <div className="card">
        <InventoryComponent characterId={params.characterId} />
      </div>

      <div className="mt-6 p-4 rounded-lg text-xs opacity-60" style={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
        <p>
          <strong>🎒 Sobre o Inventário:</strong><br />
          Cada personagem possui uma bolsa com capacidade limitada de peso e slots. 
          Itens podem ser equipados em diferentes slots para fornecer bônus e habilidades especiais.
        </p>
      </div>
    </div>
  )
}
