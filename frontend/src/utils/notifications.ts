export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.permission = Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  async show(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag || 'mindchat',
        requireInteraction: options.requireInteraction || false,
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return new Promise((resolve) => {
        notification.onshow = () => resolve();
        notification.onclick = () => {
          window.focus();
          notification.close();
          resolve();
        };
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Predefined notification types
  async showMoodReminder(): Promise<void> {
    await this.show({
      title: '🧠 MindChat Reminder',
      body: 'How are you feeling today? Take a moment to check in with yourself.',
      tag: 'mood-reminder'
    });
  }

  async showBreathingReminder(): Promise<void> {
    await this.show({
      title: '🧘 Time to Breathe',
      body: 'Take a few minutes for a breathing exercise to relax and center yourself.',
      tag: 'breathing-reminder'
    });
  }

  async showCrisisAlert(): Promise<void> {
    await this.show({
      title: '⚠️ Crisis Support Available',
      body: 'We noticed you might be struggling. Remember, help is always available.',
      requireInteraction: true,
      tag: 'crisis-alert'
    });
  }

  async showPositiveAffirmation(message: string): Promise<void> {
    await this.show({
      title: '💫 Daily Affirmation',
      body: message,
      tag: 'affirmation'
    });
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  isPermissionGranted(): boolean {
    return this.permission === 'granted';
  }
}

export const notificationService = new NotificationService();
export default notificationService;

// Schedule notifications (basic implementation)
export const scheduleReminders = () => {
  if (!notificationService.isSupported() || !notificationService.isPermissionGranted()) {
    return;
  }

  // Schedule mood check-in reminder (daily at 9 AM)
  const now = new Date();
  const tomorrow9AM = new Date();
  tomorrow9AM.setDate(now.getDate() + 1);
  tomorrow9AM.setHours(9, 0, 0, 0);

  const timeTo9AM = tomorrow9AM.getTime() - now.getTime();
  
  setTimeout(() => {
    notificationService.showMoodReminder();
    // Repeat daily
    setInterval(() => {
      notificationService.showMoodReminder();
    }, 24 * 60 * 60 * 1000);
  }, timeTo9AM);

  // Schedule breathing reminder (every 3 hours during day)
  const breathingInterval = 3 * 60 * 60 * 1000; // 3 hours
  setInterval(() => {
    const currentHour = new Date().getHours();
    // Only during waking hours (8 AM - 10 PM)
    if (currentHour >= 8 && currentHour <= 22) {
      notificationService.showBreathingReminder();
    }
  }, breathingInterval);
};
