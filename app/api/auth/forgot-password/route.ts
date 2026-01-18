import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Por segurança, não revelamos se o email existe ou não
    // Sempre retornamos sucesso para evitar enumeração de usuários

    // Se o usuário existe, criar token de reset
    if (user) {
      const resetToken = randomBytes(32).toString('hex');

      // Salvar token de reset (expira em 1 hora)
      await prisma.verificationToken.create({
        data: {
          identifier: `reset-${email.toLowerCase()}`,
          token: resetToken,
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
        }
      });

      // Enviar email de reset
      try {
        await sendResetPasswordEmail(email, resetToken);
      } catch (emailError) {
        console.error('Erro ao enviar email de reset:', emailError);
        // Não falhar a requisição por erro de email
      }
    }

    return NextResponse.json({
      message: 'Se o email existir em nossa base, você receberá instruções para redefinir sua senha.'
    });

  } catch (error) {
    console.error('Erro ao processar forgot password:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para enviar email de reset de senha
async function sendResetPasswordEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: 'Crônicas do Japão Feudal <cronicasdojapaofeudal@gmail.com>',
      to: email,
      subject: '🏯 Redefinição de Senha - Crônicas do Japão Feudal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fef7e6;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; margin: 20px;">
            <h1 style="color: #2c1810; text-align: center; margin-bottom: 30px;">
              🏯 Redefinição de Senha
            </h1>

            <p style="color: #2c1810; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Recebemos uma solicitação para redefinir sua senha em <strong>Crônicas do Japão Feudal</strong>.
            </p>

            <p style="color: #2c1810; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Clique no botão abaixo para criar uma nova senha:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #8b4513; color: white; padding: 15px 30px;
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block; font-size: 16px;">
                🔑 Redefinir Senha
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Se o botão não funcionar, copie e cole este link no seu navegador:
              <br>
              <a href="${resetUrl}" style="color: #8b4513;">${resetUrl}</a>
            </p>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0;">
                <strong>⚠️ Segurança:</strong> Este link expira em 1 hora e só pode ser usado uma vez.
                Se você não solicitou esta redefinição, ignore este email.
              </p>
            </div>

            <p style="color: #2c1810; font-size: 14px; text-align: center;">
              🌟 Continue sua jornada no Japão Sengoku! 🌟
            </p>
          </div>
        </div>
      `,
      text: `
        Redefinição de Senha - Crônicas do Japão Feudal

        Recebemos uma solicitação para redefinir sua senha.

        Para criar uma nova senha, acesse: ${resetUrl}

        Este link expira em 1 hora.

        Se você não solicitou esta redefinição, ignore este email.

        Continue sua jornada no Japão Sengoku!
      `,
    }),
  });

  if (!result.ok) {
    throw new Error('Failed to send reset password email');
  }
}