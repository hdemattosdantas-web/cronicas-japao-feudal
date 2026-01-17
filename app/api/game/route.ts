import { NextRequest, NextResponse } from 'next/server'

// API movida para /api/game-states para evitar problemas com fs no client
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  return NextResponse.redirect(new URL(`/api/game-states?${searchParams}`, request.url))
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/game-states', request.url), { status: 307 })
}