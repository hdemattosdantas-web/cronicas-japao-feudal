'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface AchievementStats {
  totalUnlocked: number;
  totalAchievements: number;
}

export function FloatingAchievementButton() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AchievementStats>({ totalUnlocked: 0, totalAchievements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadAchievementStats();
    }
  }, [session]);

  const loadAchievementStats = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUnlocked: data.totalUnlocked,
          totalAchievements: data.totalAchievements
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user || loading) return null;

  const progressPercent = stats.totalAchievements > 0
    ? Math.round((stats.totalUnlocked / stats.totalAchievements) * 100)
    : 0;

  return (
    <Link
      href="/achievements"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <div className="relative">
        {/* Botão principal */}
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full shadow-lg border-2 border-yellow-500 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer">
          🏆
        </div>

        {/* Badge de progresso */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-xs font-bold text-black border-2 border-[#1a1a1a]">
          {stats.totalUnlocked}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#2a2a2a] text-[#d4af37] text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-[#d4af37]/30">
          <div className="font-bold">🏆 Conquistas</div>
          <div className="text-xs text-gray-300 mt-1">
            {stats.totalUnlocked} / {stats.totalAchievements} desbloqueadas
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className="bg-[#d4af37] h-1 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1 text-gray-400">
            {progressPercent}%
          </div>
        </div>

        {/* Efeito de brilho */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent animate-pulse" />
      </div>
    </Link>
  );
}