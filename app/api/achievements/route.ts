import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { PrismaClient } from '@prisma/client';
import { ACHIEVEMENTS, checkAchievementUnlock } from '@/lib/achievements';

const prisma = new PrismaClient();

// GET /api/achievements - Listar conquistas do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar conquistas do usuário
    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        achievement: true
      }
    });

    // Calcular estatísticas do usuário (simulado por enquanto)
    const userStats = await calculateUserStats(session.user.id);

    // Preparar resposta com progresso
    const achievementsWithProgress = ACHIEVEMENTS.map(achievementData => {
      const userAchievement = userAchievements.find(
        ua => ua.achievement.name === achievementData.name
      );

      const progress = checkAchievementUnlock(achievementData, userStats);

      return {
        ...achievementData,
        id: userAchievement?.achievement.id,
        unlocked: userAchievement?.isCompleted || false,
        unlockedAt: userAchievement?.unlockedAt,
        progress: progress.progress,
        maxProgress: progress.maxProgress,
        progressPercent: Math.round((progress.progress / progress.maxProgress) * 100)
      };
    });

    return NextResponse.json({
      achievements: achievementsWithProgress,
      stats: userStats,
      totalUnlocked: userAchievements.filter(ua => ua.isCompleted).length,
      totalAchievements: ACHIEVEMENTS.length
    });
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/achievements/check - Verificar e desbloquear conquistas
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { action } = await request.json();

    if (action !== 'check_unlocks') {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    // Calcular estatísticas atuais do usuário
    const userStats = await calculateUserStats(session.user.id);

    // Verificar conquistas que podem ser desbloqueadas
    const unlockedAchievements = [];

    for (const achievementData of ACHIEVEMENTS) {
      // Verificar se já foi desbloqueada
      const existingAchievement = await prisma.userAchievement.findFirst({
        where: {
          userId: session.user.id,
          achievement: {
            name: achievementData.name
          }
        }
      });

      if (existingAchievement?.isCompleted) continue;

      // Verificar se atende aos requisitos
      const progress = checkAchievementUnlock(achievementData, userStats);

      if (progress.unlocked) {
        // Criar ou atualizar conquista
        let achievement = await prisma.achievement.findUnique({
          where: { name: achievementData.name }
        });

        if (!achievement) {
          achievement = await prisma.achievement.create({
            data: {
              name: achievementData.name,
              description: achievementData.description,
              icon: achievementData.icon,
              category: achievementData.category,
              type: achievementData.type,
              requirements: achievementData.requirements,
              reward: achievementData.reward
            }
          });
        }

        const userAchievement = await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId: session.user.id,
              achievementId: achievement.id
            }
          },
          update: {
            isCompleted: true,
            unlockedAt: new Date(),
            progress: progress.maxProgress
          },
          create: {
            userId: session.user.id,
            achievementId: achievement.id,
            isCompleted: true,
            unlockedAt: new Date(),
            progress: progress.maxProgress
          },
          include: {
            achievement: true
          }
        });

        unlockedAchievements.push(userAchievement);
      }
    }

    return NextResponse.json({
      unlockedAchievements,
      message: unlockedAchievements.length > 0
        ? `${unlockedAchievements.length} nova(s) conquista(s) desbloqueada(s)!`
        : 'Nenhuma nova conquista desbloqueada'
    });
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para calcular estatísticas do usuário
async function calculateUserStats(userId: string): Promise<Record<string, number>> {
  const [
    characters,
    friends,
    friendRequests
  ] = await Promise.all([
    prisma.character.findMany({ 
      where: { userId },
      include: { attributes: true }
    }),
    prisma.friend.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId }
        ]
      }
    }),
    prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    })
  ]);

  // Estatísticas básicas expandidas para o sistema de achievements
  const stats: Record<string, number> = {
    // Estatísticas existentes
    characters_created: characters.length,
    friends_made: friends.length,
    friend_requests_sent: friendRequests.filter(fr => fr.senderId === userId).length,
    friend_requests_received: friendRequests.filter(fr => fr.receiverId === userId).length,

    // Estatísticas de vida & cotidiano
    character_created_no_high_attributes: 0, // Será calculado baseado nos atributos
    years_in_same_province: 0, // Implementar no sistema de localização
    age_without_combat: 0, // Rastrear idade sem combate

    // Estatísticas de exploração
    cities_visited: 0, // Sistema de mapa
    investigate_hidden_location: 0, // Eventos de exploração

    // Estatísticas de confrontos mundanos
    survive_assault: 0, // Sistema de combate
    solo_mundane_victory: 0, // Vitórias em combate mundano

    // Estatísticas sobrenaturais
    witness_supernatural: 0, // Eventos sobrenaturais
    encounter_mystic_creature: 0, // Encontros com criaturas
    learn_entity_true_name: 0, // Descoberta de nomes verdadeiros

    // Estatísticas de conhecimento
    study_ancient_texts: 0, // Sistema de estudo
    perform_simple_ritual: 0, // Sistema de rituais

    // Estatísticas de legado
    have_child: 0, // Sistema familiar
    character_from_legacy: 0, // Criação de personagens filhos
    inherit_supernatural_contact: 0, // Herança sobrenatural

    // Estatísticas de classes secretas
    first_yokai_encounter: 0, // Primeiro yokai
    hear_spirit_voices: 0, // Vozes espirituais
    see_through_illusion: 0, // Ver ilusões
    receive_profane_mark: 0, // Marca profana
    bloody_prayer: 0, // Orações que sangram

    // Estatísticas gerais (placeholders para futuras implementações)
    days_played: 1,
    distance_traveled: 0,
    battles_won: 0,
    regions_visited: 0,
    character_level: Math.max(...characters.map(c => c.level), 0),
    skill_mastery: 0,
    peaceful_resolutions: 0,
    community_help: 0,
    special_event: 0
  };

  // Cálculos específicos baseados nos dados atuais
  characters.forEach(character => {
    // Verificar personagem sem atributos altos (≤6)
    if (character.attributes) {
      const attrs = character.attributes;
      const hasHighAttribute = 
        attrs.body > 6 ||
        attrs.strength > 6 ||
        attrs.agility > 6 ||
        attrs.intellect > 6 ||
        attrs.willpower > 6 ||
        attrs.perception > 6 ||
        attrs.socialPerception > 6 ||
        attrs.spiritualPerception > 6;
      
      if (!hasHighAttribute) {
        stats.character_created_no_high_attributes++;
      }
    }
  });

  return stats;
}