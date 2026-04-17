import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { AuthRequest } from '../middleware/auth';

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const notifications = await notificationService.getNotifications(userId);
      
      const formattedNotifications = notifications.map((n: any) => ({
        ...n,
        notification_id: n.id,
        user_id: n.userId,
      }));
      
      res.json({
        success: true,
        data: formattedNotifications,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const notificationId = req.params.id;
      
      const notification = await notificationService.markAsRead(notificationId, userId);
      res.json({
        success: true,
        data: notification,
        message: 'Notification marked as read',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      await notificationService.markAllAsRead(userId);
      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export const notificationController = new NotificationController();
