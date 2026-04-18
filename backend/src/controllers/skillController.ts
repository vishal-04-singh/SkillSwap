import { Request, Response } from 'express';
import { skillService } from '../services/skillService';
import { AuthRequest } from '../middleware/auth';

export class SkillController {
  async getAllSkills(req: Request, res: Response) {
    try {
      const { category_id } = req.query;
      const skills = category_id
        ? await skillService.getSkillsByCategory(category_id as string)
        : await skillService.getAllSkills();
      
      res.json({
        success: true,
        data: skills,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await skillService.getCategories();
      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getUserSkills(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const skills = await skillService.getUserSkills(userId);
      res.json({
        success: true,
        data: skills,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async addUserSkill(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { skill_id, proficiency_level, years_of_experience } = req.body;
      
      const userSkill = await skillService.addUserSkill(
        userId,
        skill_id,
        proficiency_level,
        years_of_experience
      );
      
      res.status(201).json({
        success: true,
        data: userSkill,
        message: 'Skill added successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateUserSkill(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const userSkillId = req.params.id;
      const { proficiency_level, years_of_experience } = req.body;
      
      const userSkill = await skillService.updateUserSkill(
        userSkillId,
        userId,
        proficiency_level,
        years_of_experience
      );
      
      res.json({
        success: true,
        data: userSkill,
        message: 'Skill updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteUserSkill(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const userSkillId = req.params.id;
      
      await skillService.deleteUserSkill(userSkillId, userId);
      
      res.json({
        success: true,
        message: 'Skill removed successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const { skill_id, q } = req.query;
      const users = await skillService.searchUsersBySkill(
        skill_id as string | undefined,
        q as string | undefined
      );
      
      const formattedUsers = users.map((u: any) => ({
        ...u,
        user_id: u.id,
        user_skills: u.user_skills.map((us: any) => ({
          ...us,
          user_skill_id: us.id,
          skill_id: us.skillId,
        })),
      }));
      
      res.json({
        success: true,
        data: formattedUsers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getLearningGoals(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const goals = await skillService.getLearningGoals(userId);
      res.json({
        success: true,
        data: goals,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async addLearningGoal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { skill_id, description, priority } = req.body;
      const goal = await skillService.addLearningGoal(userId, skill_id, description, priority);
      res.status(201).json({
        success: true,
        data: goal,
        message: 'Learning goal added',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateLearningGoal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const goalId = req.params.id;
      const { status, priority } = req.body;
      const goal = await skillService.updateLearningGoal(goalId, userId, status, priority);
      res.json({
        success: true,
        data: goal,
        message: 'Learning goal updated',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteLearningGoal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const goalId = req.params.id;
      await skillService.deleteLearningGoal(goalId, userId);
      res.json({
        success: true,
        message: 'Learning goal removed',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getSuggestedMentorsForGoal(req: AuthRequest, res: Response) {
    try {
      const goalId = req.params.id;
      const mentors = await skillService.getSuggestedMentorsForGoal(goalId);
      res.json({
        success: true,
        data: mentors,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export const skillController = new SkillController();
