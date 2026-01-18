'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ACHIEVEMENT_CATEGORIES } from '@/lib/achievements';
import { trackPageView, trackAchievementUnlock } from '@/app/components/Analytics';
import { useNotification } from '@/app/components/NotificationProvider';

interface Achievement {
  id?: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  type: string;
  hidden?: boolean;
  rare?: boolean;
  requirements: any[];
  reward?: any;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  progressPercent: number;
}

interface UserStats {
  [key: string]: number;
}

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showAchievement, showSuccess, showInfo } = useNotification();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkingUnlocks, setCheckingUnlocks] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      loadAchievements();
      trackPageView('/achievements');
    }
  }, [status, router]);

  const loadAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements);
        setUserStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUnlocks = async () => {
    setCheckingUnlocks(true);
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'check_unlocks' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.unlockedAchievements.length > 0) {
          // Track unlocked achievements
          data.unlockedAchievements.forEach((ua: any) => {
            trackAchievementUnlock(ua.achievement.name, ua.achievement.category);
          });

          // Mostrar notificações para cada conquista desbloqueada
          data.unlockedAchievements.forEach((ua: any) => {
            showAchievement(ua.achievement.name, ua.achievement.description);
          });

          // Recarregar conquistas
          await loadAchievements();

          // Mostrar mensagem de sucesso
          showSuccess('Conquistas Desbloqueadas!', data.message);
        } else {
          showInfo('Sem Novas Conquistas', 'Nenhuma nova conquista desbloqueada no momento.');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
      alert('Erro ao verificar conquistas.');
    } finally {
      setCheckingUnlocks(false);
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
        <div className="text-xl">Carregando conquistas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-[#d4af37] mb-2">
            🏆 Conquistas
          </h1>
          <p className="text-gray-400 mb-4">
            Desbloqueie conquistas através de suas jornadas no Japão feudal
          </p>
          <div className="text-lg">
            <span className="text-[#d4af37] font-bold">{unlockedCount}</span>
            <span className="text-gray-400"> / {totalCount} conquistas desbloqueadas</span>
          </div>
        </div>

        {/* Botão de verificar conquistas */}
        <div className="text-center mb-6">
          <button
            onClick={checkUnlocks}
            disabled={checkingUnlocks}
            className="px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {checkingUnlocks ? '🔄 Verificando...' : '🔍 Verificar Novas Conquistas'}
          </button>
        </div>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#2a2a2a] text-[#d4af37] hover:bg-[#3a3a3a]'
            }`}
          >
            📊 Todas ({totalCount})
          </button>
          {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, category]) => {
            const count = achievements.filter(a => a.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-[#2a2a2a] text-[#d4af37] hover:bg-[#3a3a3a]'
                }`}
              >
                {category.icon} {category.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid de conquistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.name}
              className={`p-6 rounded-lg border transition-all relative ${
                achievement.unlocked
                  ? `bg-[#2a2a2a] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 ${achievement.rare ? 'ring-2 ring-purple-500/50' : ''}`
                  : achievement.hidden
                    ? 'bg-[#0a0a0a] border-gray-800 opacity-60 hover:opacity-80'
                    : 'bg-[#1a1a1a] border-gray-600'
              }`}
            >
              {/* Badges para conquistas especiais */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {achievement.hidden && !achievement.unlocked && (
                  <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">
                    🔒 Oculta
                  </span>
                )}
                {achievement.rare && (
                  <span className="px-2 py-1 bg-purple-700 text-xs text-purple-200 rounded-full">
                    💎 Rara
                  </span>
                )}
                {achievement.unlocked && (
                  <span className="px-2 py-1 bg-green-700 text-xs text-green-200 rounded-full">
                    ✅ Completa
                  </span>
                )}
              </div>

              <div className="flex items-start space-x-4">
                <div className={`text-3xl ${achievement.unlocked ? '' : achievement.hidden ? 'grayscale opacity-30' : 'grayscale opacity-50'}`}>
                  {achievement.hidden && !achievement.unlocked ? '❓' : achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold font-cinzel mb-2 ${
                    achievement.unlocked ? 'text-[#d4af37]' : achievement.hidden ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.hidden && !achievement.unlocked ? 'Conquista Oculta' : achievement.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    achievement.unlocked ? 'text-gray-300' : achievement.hidden ? 'text-gray-600 italic' : 'text-gray-500'
                  }`}>
                    {achievement.hidden && !achievement.unlocked ? 'Descubra esta conquista através de suas jornadas...' : achievement.description}
                  </p>

                  {/* Barra de progresso */}
                  {!achievement.unlocked && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progresso</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#d4af37] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Requisitos */}
                  <div className="text-xs text-gray-500 mb-3">
                    {achievement.requirements.map((req, index) => (
                      <div key={index} className="mb-1">
                        • {req.description}
                      </div>
                    ))}
                  </div>

                  {/* Recompensa */}
                  {achievement.reward && (
                    <div className="text-xs text-green-400 mb-3">
                      <strong>Recompensa:</strong>
                      {achievement.reward.experience && ` ${achievement.reward.experience} XP`}
                      {achievement.reward.title && `, Título: ${achievement.reward.title}`}
                      {achievement.reward.special && `, ${achievement.reward.special}`}
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-1 rounded ${
                      achievement.unlocked
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {achievement.unlocked ? '✅ Desbloqueada' : '🔒 Bloqueada'}
                    </span>
                    <span className={ACHIEVEMENT_CATEGORIES[achievement.category as keyof typeof ACHIEVEMENT_CATEGORIES]?.color}>
                      {ACHIEVEMENT_CATEGORIES[achievement.category as keyof typeof ACHIEVEMENT_CATEGORIES]?.icon}
                    </span>
                  </div>

                  {/* Data de desbloqueio */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-cinzel text-gray-400 mb-2">
              Nenhuma conquista encontrada
            </h3>
            <p className="text-gray-500">
              Tente alterar o filtro ou volte mais tarde para novas conquistas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}