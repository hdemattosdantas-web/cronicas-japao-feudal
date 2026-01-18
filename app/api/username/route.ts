import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { username } = await request.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Nome de usuário é obrigatório' }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Nome de usuário deve ter pelo menos 3 caracteres' }, { status: 400 })
    }

    if (username.length > 20) {
      return NextResponse.json({ error: 'Nome de usuário deve ter no máximo 20 caracteres' }, { status: 400 })
    }

    // Validar formato do username (apenas letras, números e underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ 
        error: 'Nome de usuário deve conter apenas letras, números e underscores' 
      }, { status: 400 })
    }

    // Verificar se o username já existe
    const existingUser = await (prisma as any).user.findFirst({
      where: {
        username: username.toLowerCase(),
        id: { not: session.user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Este nome de usuário já está em uso' }, { status: 409 })
    }

    // Atualizar o username do usuário
    const updatedUser = await (prisma as any).user.update({
      where: { id: session.user.id },
      data: { username: username.toLowerCase() }
    })

    return NextResponse.json({ 
      success: true, 
      username: updatedUser.username 
    })

  } catch (error) {
    console.error('Erro ao salvar username:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await (prisma as any).user.findUnique({
      where: { id: session.user.id },
      select: { username: true }
    })

    return NextResponse.json({ username: user?.username })

  } catch (error) {
    console.error('Erro ao buscar username:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
