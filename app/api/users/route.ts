import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

interface UserStatus {
  userId: string
  email: string
  name: string
  username?: string
  isOnline: boolean
  lastSeen: string
  currentRoom?: string
}

// GET /api/users?search=term&type=email|username - Buscar usuários
// GET /api/users?friends=true - Listar amigos online
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const searchType = searchParams.get('type') || 'email'
    const friends = searchParams.get('friends')

    if (friends === 'true') {
      // Retornar amigos online
      try {
        const friendsData = await (prisma as any).friend.findMany({
          where: {
            OR: [
              { userId: session.user.id },
              { friendId: session.user.id }
            ]
          },
          include: {
            user: true,
            friend: true
          }
        })

        const friendIds = friendsData.map((friend: any) => 
          friend.userId === session.user.id ? friend.friendId : friend.userId
        )

        // Buscar status online dos amigos (simplificado - poderia usar Redis ou WebSocket)
        const onlineFriends = await (prisma as any).user.findMany({
          where: {
            id: { in: friendIds },
            // TODO: Implementar sistema real de status online
          },
          select: {
            id: true,
            email: true,
            name: true,
            username: true
          }
        })

        const formattedFriends = onlineFriends.map((user: any) => ({
          userId: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          isOnline: true, // Simplificado
          lastSeen: new Date().toISOString()
        }))

        return NextResponse.json(formattedFriends)
      } catch (error) {
        console.error('Erro ao buscar amigos:', error)
        return NextResponse.json([])
      }
    }

    if (search) {
      // Buscar usuários por email ou username
      let whereClause: any = {
        email: { not: session.user.email } // Não mostrar o próprio usuário
      }

      if (searchType === 'email') {
        whereClause.email = {
          contains: search.toLowerCase(),
          mode: 'insensitive'
        }
      } else if (searchType === 'username') {
        whereClause.username = {
          contains: search.toLowerCase(),
          mode: 'insensitive'
        }
      } else {
        // Busca em ambos os campos
        whereClause.OR = [
          {
            email: {
              contains: search.toLowerCase(),
              mode: 'insensitive'
            }
          },
          {
            username: {
              contains: search.toLowerCase(),
              mode: 'insensitive'
            }
          }
        ]
      }

      const foundUsers = await (prisma as any).user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          username: true
        },
        take: 10, // Limitar a 10 resultados
        orderBy: {
          name: 'asc'
        }
      })

      const formattedUsers = foundUsers.map((user: any) => ({
        userId: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isOnline: false, // Simplificado
        lastSeen: new Date().toISOString()
      }))

      return NextResponse.json(formattedUsers)
    }

    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST /api/users/status - Atualizar status online
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { isOnline, currentRoom } = body

    // TODO: Implementar sistema real de status online com Redis ou WebSocket
    // Por enquanto, apenas retornar sucesso
    console.log(`Status do usuário ${session.user.id}: ${isOnline ? 'online' : 'offline'}, sala: ${currentRoom || 'nenhuma'}`)

    return NextResponse.json({ message: 'Status atualizado' })
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}