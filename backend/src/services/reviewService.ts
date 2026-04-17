import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewService {
  async createReview(sessionId: string, reviewerId: string, rating: number, comment?: string) {
    const session = await prisma.skillSession.findUnique({
      where: { id: sessionId },
      include: { review: true },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.menteeId !== reviewerId) {
      throw new Error('Only the mentee can review the session');
    }

    if (session.status !== 'completed') {
      throw new Error('Can only review completed sessions');
    }

    if (session.review) {
      throw new Error('Session has already been reviewed');
    }

    const review = await prisma.sessionReview.create({
      data: {
        sessionId,
        reviewerId,
        rating,
        comment,
      },
      include: {
        session: {
          include: {
            mentor: { select: { id: true, full_name: true } },
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.mentorId,
        message: `You received a ${rating}-star review!`,
        is_read: false,
      },
    });

    const allReviews = await prisma.sessionReview.findMany({
      where: {
        session: { mentorId: session.mentorId },
      },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.user.update({
      where: { id: session.mentorId },
      data: { avg_rating: avgRating },
    });

    return review;
  }

  async getReviewsByMentor(mentorId: string) {
    return prisma.sessionReview.findMany({
      where: {
        session: {
          mentorId,
        },
      },
      include: {
        session: {
          include: {
            mentee: {
              select: { id: true, full_name: true },
            },
            skill: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getLeaderboard() {
    const mentors = await prisma.user.findMany({
      where: { role: 'faculty' },
      include: {
        mentor_sessions: {
          where: { status: 'completed' },
          include: { review: true },
        },
      },
    });

    const leaderboard = mentors.map((mentor) => {
      const reviews = mentor.mentor_sessions
        .filter((s) => s.review)
        .map((s) => s.review!.rating);
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r, 0) / reviews.length
        : 0;

      return {
        user_id: mentor.id,
        roll_number: mentor.roll_number,
        full_name: mentor.full_name,
        email: mentor.email,
        department: mentor.department,
        avg_rating: avgRating,
        total_sessions: mentor.mentor_sessions.length,
        completed_sessions: mentor.mentor_sessions.length,
      };
    });

    return leaderboard
      .sort((a, b) => b.avg_rating - a.avg_rating || b.completed_sessions - a.completed_sessions)
      .slice(0, 20);
  }
}

export const reviewService = new ReviewService();
