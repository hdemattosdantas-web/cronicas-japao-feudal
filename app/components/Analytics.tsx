'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function Analytics() {
  const { data: session } = useSession();

  useEffect(() => {
    // Track user session
    if (session?.user) {
      // Custom analytics events
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'user_login', {
          event_category: 'engagement',
          event_label: 'user_authenticated',
          user_id: session.user.id,
          username: session.user.name || session.user.username
        });
      }
    }
  }, [session]);

  return <VercelAnalytics />;
}

// Função auxiliar para track de eventos customizados
export function trackEvent(eventName: string, parameters: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString()
    });
  }
}

// Função para track de conquistas desbloqueadas
export function trackAchievementUnlock(achievementName: string, category: string) {
  trackEvent('achievement_unlock', {
    achievement_name: achievementName,
    category: category,
    event_category: 'achievement',
    event_label: 'achievement_unlocked'
  });
}

// Função para track de criação de personagem
export function trackCharacterCreation(characterData: {
  profession: string;
  origin: string;
  age: number;
}) {
  trackEvent('character_created', {
    ...characterData,
    event_category: 'character',
    event_label: 'character_creation'
  });
}

// Função para track de mensagens enviadas
export function trackMessageSent(roomType: string) {
  trackEvent('message_sent', {
    room_type: roomType,
    event_category: 'social',
    event_label: 'chat_message'
  });
}

// Função para track de navegação
export function trackPageView(page: string) {
  trackEvent('page_view', {
    page_path: page,
    event_category: 'navigation',
    event_label: 'page_visit'
  });
}