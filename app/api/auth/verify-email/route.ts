import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificação é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar token de verificação
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date() // Token ainda não expirou
        }
      }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já foi verificado
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email já foi verificado anteriormente' },
        { status: 400 }
      );
    }

    // Atualizar usuário como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date()
      }
    });

    // Remover token usado
    await prisma.verificationToken.delete({
      where: { token }
    });

    return NextResponse.json({
      message: '✅ Email verificado com sucesso! Você já pode fazer login.'
    });

  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}