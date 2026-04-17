import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';
import { validate, reviewSchema } from '../middleware/validate';

const router = Router();

router.get('/leaderboard', reviewController.getLeaderboard.bind(reviewController));
router.get('/mentor/:mentorId', reviewController.getMentorReviews.bind(reviewController));
router.post('/', authenticate, validate(reviewSchema), reviewController.createReview.bind(reviewController));

export default router;
