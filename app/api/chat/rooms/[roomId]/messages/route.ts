import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/chat/rooms/[roomId]/messages - Buscar mensagens da sala
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { roomId } = await params;
    const { cursor, limit = '50' } = Object.fromEntries(request.nextUrl.searchParams);

    // Verificar se o usuário é participante da sala
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        roomId,
        userId: session.user.id
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit),
      ...(cursor && {
        cursor: {
          id: cursor
        },
        skip: 1
      })
    });

    // Buscar próxima página
    const nextCursor = messages.length === parseInt(limit)
      ? messages[messages.length - 1].id
      : null;

    return NextResponse.json({
      messages: messages.reverse(), // Retornar em ordem cronológica
      nextCursor
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/chat/rooms/[roomId]/messages - Enviar mensagem
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { roomId } = await params;
    const { content, messageType = 'text' } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário é participante da sala
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        roomId,
        userId: session.user.id
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Criar mensagem
    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        userId: session.user.id,
        content: content.trim(),
        messageType
      },
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
    });

    // Atualizar timestamp da sala
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}