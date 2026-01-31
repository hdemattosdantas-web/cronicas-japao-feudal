import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cronicas do Japao Feudal - RPG de Vida",
  description: "Um RPG de vida ambientado no Japao feudal onde historias humanas se cruzam com o oculto",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
          backgroundColor: "#f9fafb"
        }}
      >
        <header style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "16px 0"
        }}>
            <div style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Link href="/" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#fbbf24",
                  textDecoration: "none"
                }}>
                  <span style={{ fontSize: "24px" }}></span>
                  <div>
                    <h1 style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      margin: 0,
                      color: "#fbbf24"
                    }}>
                      Cronicas do Japao Feudal
                    </h1>
                    <p style={{
                      fontSize: "12px",
                      opacity: 0.8,
                      margin: 0
                    }}>
                      RPG de Vida
                    </p>
                  </div>
                </Link>

                <nav style={{
                  display: "none",
                  gap: "24px"
                }} className="md:flex">
                  <Link href="/" style={{
                    color: "#fbbf24",
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s"
                  }}>
                    Inicio
                  </Link>
                  <Link href="/auth/signin" style={{
                    color: "#fbbf24",
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s"
                  }}>
                    Entrar
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main>
            {children}
          </main>

          <footer style={{
            backgroundColor: "#1a1a1a",
            color: "#9ca3af",
            borderTop: "1px solid #374151",
            marginTop: "48px",
            padding: "24px 0"
          }}>
            <div style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
              textAlign: "center"
            }}>
              <p style={{ fontSize: "14px", margin: 0 }}>
                Sistema de RPG de Vida
              </p>
              <p style={{
                fontSize: "14px",
                margin: "8px 0 0 0"
              }}>
                "O mundo nao gira ao seu redor"
              </p>
            </div>
          </footer>
      </body>
    </html>
  )
}
