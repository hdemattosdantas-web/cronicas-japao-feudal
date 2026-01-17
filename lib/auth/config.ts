import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { sendVerificationRequest } from "./email"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Desabilitado temporariamente devido a problemas de configuração
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // EmailProvider removido temporariamente - requer adapter
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
      }
      return token
    },
  },
  session: {
    strategy: "jwt", // Mudado para JWT para não requerer adapter
  },
}