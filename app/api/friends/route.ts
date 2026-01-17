import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { promises as fs } from 'fs'
import path from 'path'

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

async function readFriends(): Promise<Friend[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'friends.json'), 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeFriends(friends: Friend[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(path.join(process.cwd(), 'data', 'friends.json'), JSON.stringify(friends, null, 2))
}

async function readFriendRequests(): Promise<FriendRequest[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'friend-requests.json'), 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeFriendRequests(requests: FriendRequest[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(path.join(process.cwd(), 'data', 'friend-requests.json'), JSON.stringify(requests, null, 2))
}

// GET /api/friends - Listar amigos do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const friends = await readFriends()
    const userFriends = friends.filter(friend =>
      friend.userId === session.user.id ||
      friend.friendId === session.user.id
    ).map(friend => ({
      id: friend.id,
      friendId: friend.userId === session.user.id ? friend.friendId : friend.userId,
      friendEmail: friend.userId === session.user.id ? friend.friendEmail : friend.friendEmail,
      friendName: friend.userId === session.user.id ? friend.friendName : friend.friendName,
      addedAt: friend.addedAt,
      isOnline: false // TODO: Implementar status online
    }))

    return NextResponse.json(userFriends)
  } catch (error) {
    console.error('Erro ao listar amigos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST /api/friends - Enviar pedido de amizade
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { friendEmail } = body

    if (!friendEmail || friendEmail === session.user.email) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Verificar se já são amigos
    const friends = await readFriends()
    const existingFriendship = friends.find(friend =>
      (friend.userId === session.user.id && friend.friendEmail === friendEmail) ||
      (friend.friendId === session.user.id && friend.friendEmail === session.user.email)
    )

    if (existingFriendship) {
      return NextResponse.json({ error: 'Já são amigos' }, { status: 400 })
    }

    // Verificar se já existe pedido pendente
    const requests = await readFriendRequests()
    const existingRequest = requests.find(req =>
      (req.fromUserEmail === session.user.email && req.toUserEmail === friendEmail) ||
      (req.fromUserEmail === friendEmail && req.toUserEmail === session.user.email)
    )

    if (existingRequest) {
      return NextResponse.json({ error: 'Já existe um pedido pendente' }, { status: 400 })
    }

    // Criar novo pedido de amizade
    const newRequest: FriendRequest = {
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: session.user.id,
      fromUserEmail: session.user.email,
      fromUserName: session.user.name || 'Usuário',
      toUserId: '', // Será preenchido quando o destinatário aceitar
      toUserEmail: friendEmail,
      toUserName: '', // Será preenchido quando o destinatário aceitar
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    requests.push(newRequest)
    await writeFriendRequests(requests)

    return NextResponse.json({ message: 'Pedido de amizade enviado!' }, { status: 201 })
  } catch (error) {
    console.error('Erro ao enviar pedido de amizade:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}