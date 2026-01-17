import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Campaign, Scene } from '@/lib/game/types'

const CAMPAIGNS_DIR = path.join(process.cwd(), 'data', 'campaigns')

async function loadCampaign(campaignId: string): Promise<Campaign | null> {
  try {
    const campaignPath = path.join(CAMPAIGNS_DIR, `${campaignId}.json`)
    const data = await fs.readFile(campaignPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

// GET /api/campaigns/[id] - Obter campanha específica
// GET /api/campaigns/[id]?scene=sceneId - Obter cena específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params
    const { searchParams } = new URL(request.url)
    const sceneId = searchParams.get('scene')

    const campaign = await loadCampaign(campaignId)
    if (!campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
    }

    if (sceneId) {
      // Retornar cena específica
      const scene = campaign.scenes.find(s => s.id === sceneId)
      if (!scene) {
        return NextResponse.json({ error: 'Cena não encontrada' }, { status: 404 })
      }
      return NextResponse.json(scene)
    }

    // Retornar campanha completa
    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Erro na API de campanha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}