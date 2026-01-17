import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { promises as fs } from 'fs'
import path from 'path'

const FRIEND_REQUESTS_FILE = path.join(process.cwd(), 'data', 'friend-requests.json')
const FRIENDS_FILE = path.join(process.cwd(), 'data', 'friends.json')

interface FriendRequest {
  id: string
  fromUserId: string
  fromUserEmail: string
  fromUserName: string
  toUserId: string
  toUserEmail: string
  toUserName: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

interface Friend {
  id: string
  userId: string
  friendId: string
  friendEmail: string
  friendName: string
  addedAt: string
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readFriendRequests(): Promise<FriendRequest[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(FRIEND_REQUESTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeFriendRequests(requests: FriendRequest[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(FRIEND_REQUESTS_FILE, JSON.stringify(requests, null, 2))
}

async function readFriends(): Promise<Friend[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(FRIENDS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeFriends(friends: Friend[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(FRIENDS_FILE, JSON.stringify(friends, null, 2))
}

// GET /api/friends/requests - Listar pedidos de amizade pendentes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const requests = await readFriendRequests()
    const userRequests = requests.filter(req =>
      req.toUserEmail === session.user.email && req.status === 'pending'
    )

    return NextResponse.json(userRequests)
  } catch (error) {
    console.error('Erro ao listar pedidos de amizade:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PUT /api/friends/requests - Aceitar ou recusar pedido de amizade
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, action } = body // action: 'accept' | 'decline'

    if (!requestId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    const requests = await readFriendRequests()
    const requestIndex = requests.findIndex(req => req.id === requestId)

    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const friendRequest = requests[requestIndex]

    // Verificar se o usuário é o destinatário
    if (friendRequest.toUserEmail !== session.user.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    if (action === 'accept') {
      // Criar amizade
      const friends = await readFriends()
      const newFriend: Friend = {
        id: `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: friendRequest.fromUserId,
        friendId: session.user.id,
        friendEmail: session.user.email,
        friendName: session.user.name || 'Usuário',
        addedAt: new Date().toISOString()
      }

      const reverseFriend: Friend = {
        id: `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_reverse`,
        userId: session.user.id,
        friendId: friendRequest.fromUserId,
        friendEmail: friendRequest.fromUserEmail,
        friendName: friendRequest.fromUserName,
        addedAt: new Date().toISOString()
      }

      friends.push(newFriend, reverseFriend)
      await writeFriends(friends)

      friendRequest.status = 'accepted'
    } else {
      friendRequest.status = 'declined'
    }

    // Atualizar pedido
    requests[requestIndex] = friendRequest
    await writeFriendRequests(requests)

    return NextResponse.json({
      message: action === 'accept' ? 'Amizade aceita!' : 'Pedido recusado'
    })
  } catch (error) {
    console.error('Erro ao processar pedido de amizade:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}