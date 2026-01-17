import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { calculateAttributes } from '@/lib/calculateAttributes'

const CHARACTERS_FILE = path.join(process.cwd(), 'data', 'characters.json')

interface Character {
  id: string
  userId: string
  userEmail: string
  name: string
  age: number
  origin: string
  profession: string
  lore: string
  attributes: any
  createdAt: string
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readCharacters(): Promise<Character[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(CHARACTERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeCharacters(characters: Character[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(CHARACTERS_FILE, JSON.stringify(characters, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const characters = await readCharacters()
    const userCharacters = characters.filter(char => char.userEmail === session.user.email)

    return NextResponse.json(userCharacters)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, age, origin, profession, lore } = body

    // Validações básicas
    if (!name || !age || !profession || !lore) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    if (lore.length < 50) {
      return NextResponse.json({ error: 'Lore deve ter pelo menos 50 caracteres' }, { status: 400 })
    }

    // Calcular atributos
    const attributes = calculateAttributes(lore, parseInt(age), profession)

    const characters = await readCharacters()

    const newCharacter: Character = {
      id: Date.now().toString(),
      userId: session.user.id || '',
      userEmail: session.user.email,
      name,
      age: parseInt(age),
      origin,
      profession,
      lore,
      attributes,
      createdAt: new Date().toISOString()
    }

    characters.push(newCharacter)
    await writeCharacters(characters)

    return NextResponse.json(newCharacter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}