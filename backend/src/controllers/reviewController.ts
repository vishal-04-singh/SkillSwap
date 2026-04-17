import { Request, Response } from 'express';
import { reviewService } from '../services/reviewService';
import { AuthRequest } from '../middleware/auth';

export class ReviewController {
  async createReview(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { session_id, rating, comment } = req.body;
      
      const review = await reviewService.createReview(session_id, userId, rating, comment);
      
      res.status(201).json({
        success: true,
        data: review,
        message: 'Review submitted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getMentorReviews(req: Request, res: Response) {
    try {
      const mentorId = req.params.mentorId;
      const reviews = await reviewService.getReviewsByMentor(mentorId);
      res.json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await reviewService.getLeaderboard();
      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export const reviewController = new ReviewController();
