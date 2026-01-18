import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { InventoryService } from '@/lib/inventory/inventory-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const characterId = params.characterId

    // Verificar se o personagem pertence ao usuário
    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: session.user.id
      }
    })

    if (!character) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 })
    }

    const inventory = await InventoryService.getInventory(characterId)
    
    if (!inventory) {
      // Criar inventário se não existir
      const newInventory = await InventoryService.createInventory(characterId, character.profession)
      return NextResponse.json(newInventory)
    }

    return NextResponse.json(inventory)
  } catch (error) {
    console.error('Erro ao buscar inventário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
