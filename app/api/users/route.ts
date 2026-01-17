import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { promises as fs } from 'fs'
import path from 'path'

const USERS_STATUS_FILE = path.join(process.cwd(), 'data', 'users-status.json')

interface UserStatus {
  userId: string
  email: string
  name: string
  isOnline: boolean
  lastSeen: string
  currentRoom?: string
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readUserStatuses(): Promise<UserStatus[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(USERS_STATUS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeUserStatuses(statuses: UserStatus[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(USERS_STATUS_FILE, JSON.stringify(statuses, null, 2))
}

async function updateUserStatus(userId: string, email: string, name: string, isOnline: boolean, currentRoom?: string) {
  const statuses = await readUserStatuses()
  const existingIndex = statuses.findIndex(status => status.userId === userId)

  const userStatus: UserStatus = {
    userId,
    email,
    name,
    isOnline,
    lastSeen: new Date().toISOString(),
    currentRoom
  }

  if (existingIndex >= 0) {
    statuses[existingIndex] = userStatus
  } else {
    statuses.push(userStatus)
  }

  await writeUserStatuses(statuses)
}

// GET /api/users?search=email - Buscar usuários por email
// GET /api/users/friends - Listar amigos online
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const friends = searchParams.get('friends')

    if (friends === 'true') {
      // Retornar amigos online
      const userStatuses = await readUserStatuses()

      // Buscar lista de amigos do usuário
      try {
        const friendsData = await fs.readFile(path.join(process.cwd(), 'data', 'friends.json'), 'utf-8')
        const friendsList = JSON.parse(friendsData)

        const userFriends = friendsList.filter((friend: any) =>
          friend.userId === session.user.id ||
          friend.friendId === session.user.id
        ).map((friend: any) => ({
          friendId: friend.userId === session.user.id ? friend.friendId : friend.userId,
          friendEmail: friend.userId === session.user.id ? friend.friendEmail : friend.friendEmail
        }))

        const onlineFriends = userStatuses.filter(status =>
          userFriends.some((friend: any) => friend.friendId === status.userId) &&
          status.isOnline
        )

        return NextResponse.json(onlineFriends)
      } catch {
        return NextResponse.json([])
      }
    }

    if (search) {
      // Buscar usuários por email (para adicionar amigos)
      const userStatuses = await readUserStatuses()
      const foundUsers = userStatuses.filter(status =>
        status.email.toLowerCase().includes(search.toLowerCase()) &&
        status.email !== session.user.email
      ).slice(0, 10) // Limitar a 10 resultados

      return NextResponse.json(foundUsers)
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

    await updateUserStatus(
      session.user.id,
      session.user.email,
      session.user.name || 'Usuário',
      isOnline,
      currentRoom
    )

    return NextResponse.json({ message: 'Status atualizado' })
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}