import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { sendVerificationRequest } from "./email"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Nome de Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username.toLowerCase()
          }
        });

        if (!user) {
          return null;
        }

        // Verificar se o email foi confirmado
        if (!user.emailVerified) {
          throw new Error("Por favor, confirme seu email antes de fazer login.");
        }

        // Verificar senha
        const isPasswordValid = await compare(credentials.password, user.password!);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username || undefined,
        };
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "Crônicas do Japão <cronicas@japao-feudal.com>",
      sendVerificationRequest,
    })
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.uid) {
        session.user.id = token.uid as string
      }
      // Adicionar username se existir no token
      if (token?.username) {
        session.user.username = token.username as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id
        token.username = user.username
      }
      return token
    },
  },
  session: {
    strategy: "jwt", // Mudado para JWT para não requerer adapter
  },
}
