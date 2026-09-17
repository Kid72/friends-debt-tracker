/**
 * Web Notification API helper for PWA
 */

export const NotificationService = {
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermission() {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission() {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.error('Failed to request notification permission:', e);
      return 'denied';
    }
  },

  sendNotification(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return null;
    }

    try {
      const defaultOptions = {
        icon: '/icon-192.png',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        ...options
      };
      return new Notification(title, defaultOptions);
    } catch (e) {
      console.warn('Could not display notification:', e);
      return null;
    }
  }
};
