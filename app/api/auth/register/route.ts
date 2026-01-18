import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password } = await request.json();

    // Validações
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (!username?.trim()) {
      return NextResponse.json(
        { error: 'Nome de usuário é obrigatório' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Nome de usuário deve ter pelo menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Este email já está cadastrado' },
          { status: 400 }
        );
      }
      if (existingUser.username === username.toLowerCase()) {
        return NextResponse.json(
          { error: 'Este nome de usuário já está em uso' },
          { status: 400 }
        );
      }
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12);

    // Gerar token de verificação
    const verificationToken = randomBytes(32).toString('hex');

    // Criar usuário não verificado
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        emailVerified: null, // Será definido após verificação
      }
    });

    // Criar token de verificação
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      }
    });

    // Enviar email de verificação
    try {
      await sendRegistrationVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError);
      // Não falhar o registro, mas logar o erro
    }

    return NextResponse.json({
      message: '✅ Conta criada com sucesso! Verifique seu email para confirmar sua conta.',
      userId: user.id
    });

  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para enviar email de verificação de registro
async function sendRegistrationVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: 'Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>',
      to: email,
      subject: '🏯 Confirme sua conta - Crônicas do Japão Feudal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fef7e6;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; margin: 20px;">
            <h1 style="color: #2c1810; text-align: center; margin-bottom: 30px;">
              🏯 Bem-vindo às Crônicas do Japão Feudal!
            </h1>

            <p style="color: #2c1810; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Obrigado por se juntar aos aventureiros do Japão feudal! Para começar sua jornada,
              confirme seu email clicando no botão abaixo:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background-color: #8b4513; color: white; padding: 15px 30px;
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block; font-size: 16px;">
                ✅ Confirmar Email e Entrar no Jogo
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Se o botão não funcionar, copie e cole este link no seu navegador:
              <br>
              <a href="${verificationUrl}" style="color: #8b4513;">${verificationUrl}</a>
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Este link expira em 24 horas. Se você não solicitou esta conta, ignore este email.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="color: #2c1810; font-size: 14px; text-align: center;">
              🌟 Prepare-se para uma jornada épica através do Japão Sengoku! 🌟
            </p>
          </div>
        </div>
      `,
      text: `
        Bem-vindo às Crônicas do Japão Feudal!

        Obrigado por se juntar aos aventureiros do Japão feudal!

        Para confirmar sua conta e começar sua jornada, acesse este link:
        ${verificationUrl}

        Este link expira em 24 horas.

        Se você não solicitou esta conta, ignore este email.
      `,
    }),
  });

  if (!result.ok) {
    throw new Error('Failed to send verification email');
  }
}