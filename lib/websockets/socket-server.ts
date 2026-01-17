import { Server as HTTPServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { gameMaster } from '../game-master/engine'
import { mapManager, PlayerPosition } from '../game/map-coordinates'
import { promises as fs } from 'fs'
import path from 'path'

interface GameRoom {
  id: string
  players: string[]
  gameState: any
  currentScene: any
  isActive: boolean
  createdAt: Date
}

const USERS_STATUS_FILE = path.join(process.cwd(), 'data', 'users-status.json')

interface UserStatus {
  userId: string
  email: string
  name: string
  isOnline: boolean
  lastSeen: string
  currentRoom?: string
  socketId?: string
}

export class SocketManager {
  private io: SocketServer
  private rooms: Map<string, GameRoom> = new Map()
  private onlineUsers: Map<string, UserStatus> = new Map()

  constructor(server: HTTPServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:4000",
        methods: ["GET", "POST"]
      }
    })

    this.setupSocketHandlers()
  }

  private async updateUserStatus(userId: string, email: string, name: string, isOnline: boolean, socketId?: string, currentRoom?: string) {
    const status: UserStatus = {
      userId,
      email,
      name,
      isOnline,
      lastSeen: new Date().toISOString(),
      currentRoom,
      socketId
    }

    if (isOnline) {
      this.onlineUsers.set(userId, status)
    } else {
      this.onlineUsers.delete(userId)
    }

    // Salvar no arquivo (opcional, para persistência)
    try {
      const dataDir = path.join(process.cwd(), 'data')
      await fs.mkdir(dataDir, { recursive: true })

      const allStatuses = Array.from(this.onlineUsers.values())
      await fs.writeFile(USERS_STATUS_FILE, JSON.stringify(allStatuses, null, 2))
    } catch (error) {
      console.error('Erro ao salvar status dos usuários:', error)
    }
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('🟢 Jogador conectado:', socket.id)

      // Entrar em uma sala de jogo
      socket.on('join-room', async (data: { roomId: string, playerId: string, characterId: string, userEmail: string, userName: string, initialLocation?: string }) => {
        const { roomId, playerId, characterId, userEmail, userName, initialLocation = 'owari_village' } = data

        socket.join(roomId)

        // Atualizar status online
        await this.updateUserStatus(playerId, userEmail, userName, true, socket.id, roomId)

        let room = this.rooms.get(roomId)
        if (!room) {
          // Criar nova sala
          room = {
            id: roomId,
            players: [],
            gameState: null,
            currentScene: null,
            isActive: false,
            createdAt: new Date()
          }
          this.rooms.set(roomId, room)
        }

        // Adicionar jogador à sala
        if (!room.players.includes(playerId)) {
          room.players.push(playerId)
        }

        // Inicializar posição do jogador no mapa
        const playerPosition: PlayerPosition = {
          playerId,
          characterId,
          userName,
          locationId: initialLocation,
          coordinates: { x: 400, y: 350 }, // Posição inicial na aldeia de Owari
          isOnline: true,
          lastSeen: new Date().toISOString(),
          status: 'resting'
        }
        mapManager.updatePlayerPosition(playerId, playerPosition)

        // Notificar outros jogadores
        socket.to(roomId).emit('player-joined', {
          playerId,
          playerPosition,
          playerCount: room.players.length
        })

        // Enviar estado atual da sala
        socket.emit('room-state', {
          room,
          players: room.players.length,
          playerPosition
        })

        // Enviar posições de todos os jogadores na sala
        const allPlayersInRoom = room.players.map(playerId =>
          mapManager.getPlayerPosition(playerId)
        ).filter(Boolean)

        socket.emit('players-positions-update', allPlayersInRoom)

        console.log(`🎮 Jogador ${playerId} (${userName}) entrou na sala ${roomId} em ${initialLocation}`)
      })

      // Ação do jogador
      socket.on('player-action', async (data: {
        roomId: string
        playerId: string
        action: string
        choiceId?: string
      }) => {
        const { roomId, playerId, action, choiceId } = data
        const room = this.rooms.get(roomId)

        if (!room || !room.gameState || !room.currentScene) {
          socket.emit('error', { message: 'Sala não encontrada ou jogo não iniciado' })
          return
        }

        try {
          // Processar ação com o Game Master AI
          const result = await gameMaster.processPlayerAction(
            room.gameState,
            room.currentScene,
            action,
            choiceId
          )

          // Atualizar estado da sala
          room.gameState = {
            ...room.gameState,
            attributes: {
              ...room.gameState.attributes,
              ...result.attributeChanges
            },
            experience: room.gameState.experience + (result.experience || 0)
          }

          // Enviar narração para todos na sala
          this.io.to(roomId).emit('narration-update', {
            narration: result.narration,
            mood: result.mood,
            playerId,
            action,
            gameState: room.gameState
          })

          // Se há nova cena, atualizar
          if (result.newScene) {
            room.currentScene = result.newScene
            this.io.to(roomId).emit('scene-change', {
              scene: result.newScene,
              gameState: room.gameState
            })
          }

          // Se há encontros, notificar
          if (result.encounters && result.encounters.length > 0) {
            this.io.to(roomId).emit('random-encounter', {
              encounter: result.encounters[0]
            })
          }

        } catch (error) {
          console.error('Erro ao processar ação:', error)
          socket.emit('error', { message: 'Erro ao processar ação' })
        }
      })

      // Atualizar posição do jogador
      socket.on('update-position', (data: {
        roomId: string
        playerId: string
        locationId: string
        coordinates: { x: number, y: number }
        status?: PlayerPosition['status']
      }) => {
        const { roomId, playerId, locationId, coordinates, status } = data

        const currentPosition = mapManager.getPlayerPosition(playerId)
        if (currentPosition) {
          const updatedPosition = {
            ...currentPosition,
            locationId,
            coordinates,
            status: status || currentPosition.status,
            lastSeen: new Date().toISOString()
          }

          mapManager.updatePlayerPosition(playerId, updatedPosition)

          // Broadcast atualização para todos na sala
          this.io.to(roomId).emit('player-position-update', {
            playerId,
            position: updatedPosition
          })

          console.log(`📍 Jogador ${playerId} moveu para ${locationId} (${coordinates.x}, ${coordinates.y})`)
        }
      })

      // Solicitar atualização das posições
      socket.on('request-positions', (data: { roomId: string }) => {
        const { roomId } = data
        const room = this.rooms.get(roomId)

        if (room) {
          const allPlayersInRoom = room.players.map(playerId =>
            mapManager.getPlayerPosition(playerId)
          ).filter(Boolean)

          socket.emit('players-positions-update', allPlayersInRoom)
        }
      })

      // Chat da sala
      socket.on('chat-message', (data: {
        roomId: string
        playerId: string
        message: string
        type: 'message' | 'action' | 'system'
      }) => {
        const { roomId, playerId, message, type } = data

        // Broadcast para todos na sala
        this.io.to(roomId).emit('chat-message', {
          playerId,
          message,
          type,
          timestamp: new Date().toISOString()
        })
      })

      // Interação com NPC
      socket.on('npc-interaction', async (data: {
        roomId: string
        playerId: string
        npcId: string
        action: string
      }) => {
        const { roomId, playerId, npcId, action } = data
        const room = this.rooms.get(roomId)

        if (!room?.currentScene) return

        const npc = room.currentScene.npcs?.find((n: any) => n.id === npcId)
        if (!npc) return

        try {
          const response = await gameMaster.generateNPCResponse(npc, action, {
            location: room.currentScene.location || 'local misterioso',
            timeOfDay: room.currentScene.timeOfDay || 'dia',
            weather: room.currentScene.weather || 'claro',
            gameState: room.gameState
          })

          // Enviar resposta do NPC para todos na sala
          this.io.to(roomId).emit('npc-response', {
            npcId,
            response: response.response,
            attitude: response.attitude,
            offers: response.offers,
            hints: response.hints,
            playerId
          })

        } catch (error) {
          console.error('Erro na interação com NPC:', error)
        }
      })

      // Desconectar
      socket.on('disconnect', async () => {
        console.log('🔴 Jogador desconectado:', socket.id)

        // Encontrar usuário desconectado
        let disconnectedUser: UserStatus | undefined
        let disconnectedPlayerId: string | undefined

        for (const [userId, userStatus] of this.onlineUsers.entries()) {
          if (userStatus.socketId === socket.id) {
            disconnectedUser = userStatus
            disconnectedPlayerId = userId
            await this.updateUserStatus(userId, userStatus.email, userStatus.name, false)
            break
          }
        }

        // Atualizar status no mapa se foi um jogador identificado
        if (disconnectedPlayerId) {
          const currentPosition = mapManager.getPlayerPosition(disconnectedPlayerId)
          if (currentPosition) {
            mapManager.updatePlayerPosition(disconnectedPlayerId, {
              ...currentPosition,
              isOnline: false,
              lastSeen: new Date().toISOString(),
              status: 'resting'
            })
          }
        }

        // Remover jogador das salas
        for (const [roomId, room] of this.rooms.entries()) {
          const playerIndex = room.players.indexOf(socket.id)
          if (playerIndex > -1) {
            room.players.splice(playerIndex, 1)

            // Notificar outros jogadores
            socket.to(roomId).emit('player-left', {
              playerId: socket.id,
              playerCount: room.players.length,
              userName: disconnectedUser?.name
            })

            // Broadcast atualização de posição
            if (disconnectedPlayerId) {
              socket.to(roomId).emit('player-position-update', {
                playerId: disconnectedPlayerId,
                position: mapManager.getPlayerPosition(disconnectedPlayerId)
              })
            }

            // Se sala ficou vazia, remover
            if (room.players.length === 0) {
              this.rooms.delete(roomId)
            }
          }
        }
      })
    })
  }

  // Método para obter estatísticas das salas
  getRoomStats() {
    const stats = {
      totalRooms: this.rooms.size,
      activeRooms: Array.from(this.rooms.values()).filter(r => r.isActive).length,
      totalPlayers: Array.from(this.rooms.values()).reduce((sum, room) => sum + room.players.length, 0)
    }

    return stats
  }

  // Método para criar sala pública
  createPublicRoom(roomId: string): GameRoom {
    const room: GameRoom = {
      id: roomId,
      players: [],
      gameState: null,
      currentScene: null,
      isActive: false,
      createdAt: new Date()
    }

    this.rooms.set(roomId, room)
    return room
  }

  // Método para iniciar jogo em uma sala
  startGame(roomId: string, initialGameState: any, initialScene: any) {
    const room = this.rooms.get(roomId)
    if (room) {
      room.gameState = initialGameState
      room.currentScene = initialScene
      room.isActive = true

      // Notificar todos na sala
      this.io.to(roomId).emit('game-started', {
        gameState: initialGameState,
        scene: initialScene
      })
    }
  }
}

let socketManager: SocketManager | null = null

export function initSocketServer(server: HTTPServer): SocketManager {
  if (!socketManager) {
    socketManager = new SocketManager(server)
  }
  return socketManager
}

export function getSocketManager(): SocketManager | null {
  return socketManager
}