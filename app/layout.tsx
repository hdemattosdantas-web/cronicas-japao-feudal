import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "./components/SessionProvider";
import { UsernameWrapper } from "./components/UsernameWrapper";
import { Analytics } from "./components/Analytics";
import { NotificationProvider } from "./components/NotificationProvider";
import { FloatingAchievementButton } from "./components/FloatingAchievementButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crônicas do Japão Feudal - RPG de Vida",
  description: "Um RPG de vida ambientado no Japão feudal onde histórias humanas se cruzam com o oculto",
};

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/config"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Analytics />
          <NotificationProvider>
            <UsernameWrapper>
            <header className="header-overlay">
              <div className="container py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-3 nav-link">
                    <span className="text-2xl">🏯</span>
                    <div>
                      <h1 className="text-lg font-bold" style={{ color: 'var(--text-gold)' }}>
                        Crônicas do Japão Feudal
                      </h1>
                      <p className="text-xs opacity-80 interface-small">RPG de Vida • Japão Sengoku</p>
                    </div>
                  </Link>

                  <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="nav-link">
                      🏠 Início
                    </Link>
                    {session ? (
                      <>
                        <Link href="/friends" className="nav-link">
                          👥 Amigos
                        </Link>
                        <Link href="/chat" className="nav-link">
                          💬 Chat
                        </Link>
                        <Link href="/achievements" className="nav-link">
                          🏆 Conquistas
                        </Link>
                        <Link href="/rooms" className="nav-link">
                          🏰 Salas
                        </Link>
                        <Link href="/characters" className="nav-link">
                          🏯 Personagens
                        </Link>
                        <Link href="/settings" className="nav-link">
                          ⚙️ Configurações
                        </Link>
                        <Link href="/character/create" className="nav-link">
                          🎭 Criar
                        </Link>
                        <span className="text-sm interface-small">
                          Olá, {session.user?.name || session.user?.username || session.user?.email}
                        </span>
                      </>
                    ) : (
                      <Link href="/auth/signin" className="nav-link">
                        🚪 Entrar
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            </header>

            <main>
              {children}
            </main>

            <FloatingAchievementButton />

            <footer className="footer-overlay mt-12">
              <div className="container py-6 text-center interface-small">
                <p>🎌 Sistema de RPG de Vida • Japão Feudal • Progressão Orgânica</p>
                <p className="mt-2">🌟 "O mundo não gira ao seu redor"</p>
              </div>
            </footer>
          </UsernameWrapper>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
