import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/chat/rooms - Listar salas de chat do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true,
            participants: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Erro ao buscar salas de chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/chat/rooms - Criar nova sala de chat
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { name, type, participantIds, campaignId } = await request.json();

    if (!participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'É necessário pelo menos um participante' },
        { status: 400 }
      );
    }

    // Adicionar o usuário atual aos participantes
    const allParticipantIds = [...new Set([session.user.id, ...participantIds])];

    // Criar a sala de chat
    const room = await prisma.chatRoom.create({
      data: {
        name,
        type: type || 'direct',
        campaignId,
        participants: {
          create: allParticipantIds.map(userId => ({
            userId
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar sala de chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}