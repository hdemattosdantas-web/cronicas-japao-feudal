import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Campaign } from '@/lib/game/types'

const CAMPAIGNS_DIR = path.join(process.cwd(), 'data', 'campaigns')

async function loadCampaign(campaignId: string): Promise<Campaign | null> {
  try {
    const campaignPath = path.join(CAMPAIGNS_DIR, `${campaignId}.json`)
    const data = await fs.readFile(campaignPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Erro ao carregar campanha ${campaignId}:`, error)
    return null
  }
}

async function getAllCampaigns(): Promise<Campaign[]> {
  try {
    const files = await fs.readdir(CAMPAIGNS_DIR)
    const campaigns: Campaign[] = []

    for (const file of files) {
      if (file.endsWith('.json')) {
        const campaignId = file.replace('.json', '')
        const campaign = await loadCampaign(campaignId)
        if (campaign) {
          campaigns.push(campaign)
        }
      }
    }

    return campaigns
  } catch (error) {
    console.error('Erro ao listar campanhas:', error)
    return []
  }
}

// GET /api/campaigns - Listar todas as campanhas
export async function GET() {
  try {
    const campaigns = await getAllCampaigns()
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Erro na API de campanhas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}