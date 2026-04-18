import { Router } from 'express';
import { sessionController } from '../controllers/sessionController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, sessionSchema } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/', sessionController.getSessions.bind(sessionController));
router.get('/stats', sessionController.getDashboardStats.bind(sessionController));
router.get('/requests', sessionController.getRequests.bind(sessionController));
router.get('/:id', sessionController.getSessionById.bind(sessionController));
router.post('/', validate(sessionSchema), sessionController.createSession.bind(sessionController));
router.patch('/:id/status', sessionController.updateSessionStatus.bind(sessionController));
router.post('/:id/respond', sessionController.respondToRequest.bind(sessionController));
router.post('/:id/reschedule', sessionController.requestReschedule.bind(sessionController));

export default router;
