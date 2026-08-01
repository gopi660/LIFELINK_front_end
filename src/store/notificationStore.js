import { create } from 'zustand';
import { notificationsApi } from '../api/notifications';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await notificationsApi.getNotifications();
      set({
        notifications: res.data.notifications,
        unreadCount: res.data.unread_count,
        loading: false
      });
    } catch {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsApi.markRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, is_read: true, status: 'read' } : n)),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (err) {
      console.error(err);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true, status: 'read' })),
        unreadCount: 0
      }));
    } catch (err) {
      console.error(err);
    }
  }
}));
