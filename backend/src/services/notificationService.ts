import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, is_read: false },
      data: { is_read: true },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, is_read: false },
    });
  }
}

export const notificationService = new NotificationService();
