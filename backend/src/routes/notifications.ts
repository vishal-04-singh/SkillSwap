import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications.bind(notificationController));
router.patch('/read-all', notificationController.markAllAsRead.bind(notificationController));
router.patch('/:id/read', notificationController.markAsRead.bind(notificationController));

export default router;
