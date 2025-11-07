"use client";

import { useState, useCallback } from "react";
import { Trophy, X } from "lucide-react";
import type { Achievement } from "@/lib/onboarding/types";

/**
 * Simple achievement notification hook
 * Creates a temporary notification element for achievements
 */
export function useAchievements() {
  const [notifications, setNotifications] = useState<
    Array<Achievement & { id: string }>
  >([]);

  const showAchievement = useCallback((achievement: Achievement) => {
    const id = Math.random().toString(36).substring(7);
    const notificationWithId = { ...achievement, id };

    setNotifications((prev) => [...prev, notificationWithId]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { showAchievement, notifications, dismissNotification };
}

/**
 * Achievement notification display component
 */
export function AchievementNotifications({
  notifications,
  onDismiss,
}: {
  notifications: Array<Achievement & { id: string }>;
  onDismiss: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-card border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-top-5"
        >
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.description}
              </p>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
