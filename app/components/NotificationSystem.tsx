'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'achievement' | 'info' | 'warning';
  title: string;
  message: string;
  icon?: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications?: Notification[];
  onNotificationClose?: (id: string) => void;
}

export function NotificationSystem({
  notifications: externalNotifications = [],
  onNotificationClose
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Adicionar notificações externas
    externalNotifications.forEach(notification => {
      addNotification(notification);
    });
  }, [externalNotifications]);

  const addNotification = (notification: Notification) => {
    const id = notification.id || Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remover após duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    onNotificationClose?.(id);
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-green-700 border-green-500';
      case 'warning':
        return 'bg-gradient-to-r from-orange-600 to-orange-700 border-orange-500';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500';
    }
  };

  const getIcon = (type: string, customIcon?: string) => {
    if (customIcon) return customIcon;

    switch (type) {
      case 'achievement':
        return '🏆';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border-l-4 shadow-lg text-white transform transition-all duration-300 ease-in-out animate-slide-in-right ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl flex-shrink-0">
              {getIcon(notification.type, notification.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold font-cinzel text-sm">
                {notification.title}
              </h4>
              <p className="text-sm opacity-90 mt-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook personalizado para usar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remover após duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showAchievement = (achievementName: string, description: string) => {
    addNotification({
      type: 'achievement',
      title: '🏆 Conquista Desbloqueada!',
      message: `${achievementName}: ${description}`,
      duration: 8000
    });
  };

  const showSuccess = (title: string, message: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 5000
    });
  };

  const showInfo = (title: string, message: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  };

  const showWarning = (title: string, message: string) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showAchievement,
    showSuccess,
    showInfo,
    showWarning
  };
}