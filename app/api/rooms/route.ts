import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getSocketManager } from '@/lib/websockets/socket-server'

interface Room {
  id: string
  name: string
  description: string
  maxPlayers: number
  currentPlayers: number
  isPrivate: boolean
  password?: string
  campaignId: string
  hostId: string
  players: string[]
  createdAt: string
  isActive: boolean
}

// Simulação de armazenamento (em produção seria banco de dados)
let rooms: Room[] = [
  {
    id: 'vila-misteriosa',
    name: 'A Vila Misteriosa',
    description: 'Explore os segredos ocultos da vila de Owari',
    maxPlayers: 4,
    currentPlayers: 0,
    isPrivate: false,
    campaignId: 'jornada-inicial',
    hostId: 'system',
    players: [],
    createdAt: new Date().toISOString(),
    isActive: false
  },
  {
    id: 'floresta-encantada',
    name: 'Floresta Encantada',
    description: 'Aventure-se nas profundezas da floresta assombrada',
    maxPlayers: 6,
    currentPlayers: 0,
    isPrivate: false,
    campaignId: 'jornada-inicial',
    hostId: 'system',
    players: [],
    createdAt: new Date().toISOString(),
    isActive: false
  }
]

// GET /api/rooms - Listar salas disponíveis
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const includePrivate = searchParams.get('private') === 'true'

    let availableRooms = rooms.filter(room =>
      !room.isPrivate || (session?.user?.email && room.hostId === session.user.email)
    )

    if (!includePrivate) {
      availableRooms = availableRooms.filter(room => !room.isPrivate)
    }

    // Atualizar contagem de jogadores atual
    const socketManager = getSocketManager()
    if (socketManager) {
      const stats = socketManager.getRoomStats()
      // Aqui poderíamos atualizar as contagens se tivéssemos acesso às salas do socket
    }

    return NextResponse.json(availableRooms)
  } catch (error) {
    console.error('Erro ao listar salas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST /api/rooms - Criar nova sala
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, maxPlayers, isPrivate, password, campaignId } = body

    if (!name || !campaignId) {
      return NextResponse.json({ error: 'Nome e campanha são obrigatórios' }, { status: 400 })
    }

    const newRoom: Room = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      maxPlayers: Math.min(maxPlayers || 4, 8), // Máximo 8 jogadores
      currentPlayers: 0,
      isPrivate: isPrivate || false,
      password: isPrivate ? password : undefined,
      campaignId,
      hostId: session.user.email,
      players: [],
      createdAt: new Date().toISOString(),
      isActive: false
    }

    rooms.push(newRoom)

    // Criar sala no socket manager
    const socketManager = getSocketManager()
    if (socketManager) {
      socketManager.createPublicRoom(newRoom.id)
    }

    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar sala:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}