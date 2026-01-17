// Middleware de autenticação - Next.js ainda suporta este formato
// mas considere migrar para configurações no next.config.ts no futuro
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/character/create",
    "/character/confirm",
    "/game",
    "/rooms",
    "/friends",
    "/characters",
    // Add more protected routes here
  ],
}