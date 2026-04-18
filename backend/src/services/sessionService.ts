import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SessionService {
  async getSessions(userId: string, role: string) {
    const whereClause = role === 'faculty'
      ? { mentorId: userId }
      : { menteeId: userId };

    return prisma.skillSession.findMany({
      where: whereClause,
      include: {
        mentor: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avg_rating: true,
          },
        },
        mentee: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        skill: {
          include: { category: true },
        },
        review: true,
      },
      orderBy: { scheduled_date: 'desc' },
    });
  }

  async getSessionById(sessionId: string, userId: string) {
    const session = await prisma.skillSession.findUnique({
      where: { id: sessionId },
      include: {
        mentor: {
          select: {
            id: true,
            full_name: true,
            email: true,
            department: true,
            avg_rating: true,
          },
        },
        mentee: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        skill: {
          include: { category: true },
        },
        review: true,
      },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.mentorId !== userId && session.menteeId !== userId) {
      throw new Error('Unauthorized access to session');
    }

    return session;
  }

  async createSession(mentorId: string, menteeId: string, skillId: string, title: string, description: string | undefined, scheduledDate: string) {
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
    });

    if (!mentor || mentor.role !== 'faculty') {
      throw new Error('Invalid mentor');
    }

    const mentorHasSkill = await prisma.userSkill.findFirst({
      where: { userId: mentorId, skillId },
    });

    if (!mentorHasSkill) {
      throw new Error('Mentor does not have this skill');
    }

    const scheduledDateTime = new Date(scheduledDate);
    
    const conflictingSession = await prisma.skillSession.findFirst({
      where: {
        mentorId,
        status: { in: ['pending', 'confirmed'] },
        scheduled_date: scheduledDateTime,
      },
    });

    if (conflictingSession) {
      throw new Error('Mentor is already booked at this time');
    }

    const session = await prisma.skillSession.create({
      data: {
        mentorId,
        menteeId,
        skillId,
        title,
        description,
        scheduled_date: scheduledDateTime,
        status: 'pending',
      },
      include: {
        mentor: { select: { id: true, full_name: true } },
        mentee: { select: { id: true, full_name: true } },
        skill: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        message: `New session request from mentee for "${title}"`,
        is_read: false,
      },
    });

    return session;
  }

  async updateSessionStatus(sessionId: string, userId: string, status: string) {
    const session = await prisma.skillSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.mentorId !== userId) {
      throw new Error('Only the mentor can update session status');
    }

    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
    };

    if (!validTransitions[session.status]?.includes(status)) {
      throw new Error(`Cannot transition from ${session.status} to ${status}`);
    }

    const updatedSession = await prisma.skillSession.update({
      where: { id: sessionId },
      data: { status },
      include: {
        mentor: { select: { id: true, full_name: true } },
        mentee: { select: { id: true, full_name: true } },
        skill: true,
      },
    });

    const notificationMessage = status === 'confirmed'
      ? `Your session "${session.title}" has been confirmed!`
      : status === 'cancelled'
        ? `Your session "${session.title}" has been cancelled.`
        : `Your session "${session.title}" is now completed!`;

    await prisma.notification.create({
      data: {
        userId: session.menteeId,
        message: notificationMessage,
        is_read: false,
      },
    });

    return updatedSession;
  }

  async getDashboardStats(userId: string) {
    const [totalSkills, upcomingSessions, completedSessions, unreadNotifications] = await Promise.all([
      prisma.userSkill.count({ where: { userId } }),
      prisma.skillSession.count({
        where: {
          OR: [
            { mentorId: userId, status: { in: ['pending', 'confirmed'] } },
            { menteeId: userId, status: { in: ['pending', 'confirmed'] } },
          ],
        },
      }),
      prisma.skillSession.count({
        where: {
          OR: [
            { mentorId: userId, status: 'completed' },
            { menteeId: userId, status: 'completed' },
          ],
        },
      }),
      prisma.notification.count({
        where: { userId, is_read: false },
      }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avg_rating: true },
    });

    return {
      total_skills: totalSkills,
      upcoming_sessions: upcomingSessions,
      completed_sessions: completedSessions,
      avg_rating: user?.avg_rating || 0,
      unread_notifications: unreadNotifications,
    };
  }

  async getRequests(userId: string, role: string, status?: string) {
    const whereClause: any = role === 'faculty'
      ? { receiverId: userId }
      : { requesterId: userId };

    if (status) {
      whereClause.status = status;
    }

    return prisma.mentorRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: { id: true, full_name: true, email: true, department: true, avg_rating: true },
        },
        receiver: {
          select: { id: true, full_name: true, email: true, department: true, avg_rating: true },
        },
        skill: {
          include: { category: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async respondToRequest(requestId: string, userId: string, action: 'accepted' | 'rejected', message?: string) {
    const request = await prisma.mentorRequest.findUnique({
      where: { id: requestId },
      include: { skill: true },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.receiverId !== userId) {
      throw new Error('Unauthorized to respond to this request');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    const skillName = request.skill?.name || 'the requested skill';

    const updatedRequest = await prisma.mentorRequest.update({
      where: { id: requestId },
      data: { status: action },
      include: {
        requester: { select: { id: true, full_name: true } },
        skill: true,
      },
    });

    const notificationMessage = action === 'accepted'
      ? `Your request to learn ${skillName} has been accepted!`
      : `Your request to learn ${skillName} has been declined.`;

    await prisma.notification.create({
      data: {
        userId: request.requesterId,
        message: notificationMessage,
        is_read: false,
      },
    });

    if (action === 'accepted') {
      await prisma.skillSession.create({
        data: {
          mentorId: userId,
          menteeId: request.requesterId,
          skillId: request.skillId,
          title: `${skillName} Session`,
          description: message || undefined,
          scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'confirmed',
        },
      });
    }

    return updatedRequest;
  }

  async requestReschedule(sessionId: string, userId: string, newDate: string, reason?: string) {
    const session = await prisma.skillSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.mentorId !== userId && session.menteeId !== userId) {
      throw new Error('Unauthorized to reschedule this session');
    }

    if (!['pending', 'confirmed'].includes(session.status)) {
      throw new Error('Cannot reschedule a completed or cancelled session');
    }

    const isMentor = session.mentorId === userId;
    const otherUserId = isMentor ? session.menteeId : session.mentorId;

    await prisma.skillSession.update({
      where: { id: sessionId },
      data: { scheduled_date: new Date(newDate) },
    });

    await prisma.notification.create({
      data: {
        userId: otherUserId,
        message: `Session rescheduled to ${new Date(newDate).toLocaleString()}. Reason: ${reason || 'Not provided'}`,
        is_read: false,
      },
    });

    return { success: true };
  }
}

export const sessionService = new SessionService();
