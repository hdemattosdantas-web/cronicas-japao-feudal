'use client';

import { createContext, useContext, ReactNode } from 'react';
import { NotificationSystem, useNotifications } from './NotificationSystem';

interface NotificationContextType {
  showAchievement: (name: string, description: string) => void;
  showSuccess: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { notifications, showAchievement, showSuccess, showInfo, showWarning } = useNotifications();

  return (
    <NotificationContext.Provider value={{
      showAchievement,
      showSuccess,
      showInfo,
      showWarning
    }}>
      {children}
      <NotificationSystem notifications={notifications} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}