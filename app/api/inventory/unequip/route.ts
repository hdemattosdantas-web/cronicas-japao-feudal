import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { InventoryService } from '@/lib/inventory/inventory-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { inventoryId, slotId } = body

    if (!inventoryId || !slotId) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos' },
        { status: 400 }
      )
    }

    // Verificar se o inventário pertence a um personagem do usuário
    const inventory = await (prisma as any).inventory.findUnique({
      where: { id: inventoryId },
      include: { character: true }
    })

    if (!inventory || inventory.character.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Inventário não encontrado' },
        { status: 404 }
      )
    }

    await InventoryService.unequipItem(inventoryId, slotId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao desequipar item:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
