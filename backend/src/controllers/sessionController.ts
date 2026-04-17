import { Request, Response } from 'express';
import { sessionService } from '../services/sessionService';
import { AuthRequest } from '../middleware/auth';

export class SessionController {
  async getSessions(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const sessions = await sessionService.getSessions(userId, role);
      
      const formattedSessions = sessions.map((s: any) => ({
        ...s,
        session_id: s.id,
        mentor_id: s.mentorId,
        mentee_id: s.menteeId,
        skill_id: s.skillId,
        mentor: s.mentor ? { ...s.mentor, user_id: s.mentor.id } : undefined,
        mentee: s.mentee ? { ...s.mentee, user_id: s.mentee.id } : undefined,
        skill: s.skill ? { ...s.skill, skill_id: s.skill.id, category_id: s.skill.categoryId } : undefined,
      }));
      
      res.json({
        success: true,
        data: formattedSessions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getSessionById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const sessionId = req.params.id;
      const session = await sessionService.getSessionById(sessionId, userId);
      res.json({
        success: true,
        data: session,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  async createSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { mentor_id, skill_id, title, description, scheduled_date } = req.body;
      
      const session = await sessionService.createSession(
        mentor_id,
        userId,
        skill_id,
        title,
        description,
        scheduled_date
      );
      
      res.status(201).json({
        success: true,
        data: session,
        message: 'Session request sent successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateSessionStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const sessionId = req.params.id;
      const { status } = req.body;
      
      const session = await sessionService.updateSessionStatus(sessionId, userId, status);
      res.json({
        success: true,
        data: session,
        message: 'Session status updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const stats = await sessionService.getDashboardStats(userId);
      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export const sessionController = new SessionController();
