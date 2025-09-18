const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class NotificationService {
  constructor() {
    this.prisma = prisma;
  }

  // Check if user should receive notification based on preferences
  async shouldSendNotification(userId, notificationType, channel = 'PUSH') {
    try {
      const preference = await this.prisma.notificationPreference.findUnique({
        where: {
          userId_type: {
            userId,
            type: notificationType
          }
        }
      });

      // If no preference exists, use default behavior
      if (!preference) {
        return true;
      }

      // Check if notifications are enabled for this type
      if (!preference.enabled) {
        return false;
      }

      // Check if the channel is enabled
      const enabledChannels = JSON.parse(preference.channels || '[]');
      if (!enabledChannels.includes(channel)) {
        return false;
      }

      // Check quiet hours for PUSH notifications
      if (channel === 'PUSH' && preference.quietHours) {
        if (!this.isWithinQuietHours(preference.quietHours)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking notification preferences:', error);
      // Default to sending notification if there's an error
      return true;
    }
  }

  // Check if current time is within quiet hours
  isWithinQuietHours(quietHours) {
    if (!quietHours || !quietHours.start || !quietHours.end) {
      return true; // No quiet hours set
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Handle quiet hours spanning midnight
    if (startTime > endTime) {
      return !(currentTime >= startTime || currentTime <= endTime);
    } else {
      return !(currentTime >= startTime && currentTime <= endTime);
    }
  }

  // Create notification with preference checks
  async createNotification(userId, notificationType, title, message, data = null) {
    try {
      // Check if we should send notification
      const shouldSend = await this.shouldSendNotification(userId, notificationType, 'IN_APP');
      
      if (!shouldSend) {
        console.log(`Notification blocked by user preferences: ${userId} - ${notificationType}`);
        return null;
      }

      // Create notification in database
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type: notificationType,
          title,
          message,
          data: data ? JSON.stringify(data) : null
        }
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Get notification preferences for a user
  async getPreferences(userId) {
    try {
      return await this.prisma.notificationPreference.findMany({
        where: { userId },
        orderBy: { type: 'asc' }
      });
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return [];
    }
  }

  // Create default preferences for a new user
  async createDefaultPreferences(userId) {
    const defaultPreferences = [
      {
        userId,
        type: 'BOOKING',
        channels: JSON.stringify(['PUSH', 'IN_APP']),
        enabled: true,
        frequency: 'immediate'
      },
      {
        userId,
        type: 'TOUR',
        channels: JSON.stringify(['PUSH', 'IN_APP']),
        enabled: true,
        frequency: 'immediate'
      },
      {
        userId,
        type: 'PAYMENT',
        channels: JSON.stringify(['PUSH', 'IN_APP', 'EMAIL']),
        enabled: true,
        frequency: 'immediate'
      },
      {
        userId,
        type: 'SYSTEM',
        channels: JSON.stringify(['IN_APP']),
        enabled: true,
        frequency: 'immediate'
      },
      {
        userId,
        type: 'PROMOTION',
        channels: JSON.stringify(['IN_APP']),
        enabled: false,
        frequency: 'daily'
      },
      {
        userId,
        type: 'MESSAGE',
        channels: JSON.stringify(['PUSH', 'IN_APP']),
        enabled: true,
        frequency: 'immediate'
      }
    ];

    try {
      await this.prisma.notificationPreference.createMany({
        data: defaultPreferences,
        skipDuplicates: true
      });
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  }

  // Send notification respecting user preferences
  async sendNotification(io, userId, notificationType, title, message, data = null) {
    try {
      // Check PUSH notification preferences
      const shouldSendPush = await this.shouldSendNotification(userId, notificationType, 'PUSH');
      // Check IN_APP notification preferences
      const shouldSendInApp = await this.shouldSendNotification(userId, notificationType, 'IN_APP');

      let notification = null;

      // Create in-app notification if allowed
      if (shouldSendInApp) {
        notification = await this.createNotification(userId, notificationType, title, message, data);
      }

      // Send real-time notification if allowed
      if (shouldSendPush && notification) {
        io.to(`user_${userId}`).emit('notification', {
          ...notification,
          timestamp: notification.createdAt.toISOString(),
          read: false,
          data: notification.data ? JSON.parse(notification.data) : null
        });
      }

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Send notification to all admins
  async sendAdminNotification(io, notificationType, title, message, data = null) {
    try {
      const adminUsers = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      });

      const notifications = [];
      for (const admin of adminUsers) {
        const notification = await this.sendNotification(
          io, 
          admin.id, 
          notificationType, 
          title, 
          message, 
          data
        );
        if (notification) {
          notifications.push(notification);
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error sending admin notifications:', error);
      return [];
    }
  }
}

module.exports = { NotificationService };
