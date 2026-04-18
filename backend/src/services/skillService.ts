import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SkillService {
  async getAllSkills() {
    return prisma.skill.findMany({
      include: {
        category: true,
        _count: {
          select: { user_skills: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getSkillsByCategory(categoryId: string) {
    return prisma.skill.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async getCategories() {
    return prisma.skillCategory.findMany({
      include: {
        _count: {
          select: { skills: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getUserSkills(userId: string) {
    return prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: { category: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async addUserSkill(userId: string, skillId: string, proficiencyLevel: string, yearsOfExperience: number) {
    const existingSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: { userId, skillId },
      },
    });

    if (existingSkill) {
      throw new Error('Skill already added');
    }

    return prisma.userSkill.create({
      data: {
        userId,
        skillId,
        proficiency_level: proficiencyLevel,
        years_of_experience: yearsOfExperience,
      },
      include: {
        skill: {
          include: { category: true },
        },
      },
    });
  }

  async updateUserSkill(userSkillId: string, userId: string, proficiencyLevel: string, yearsOfExperience: number) {
    const userSkill = await prisma.userSkill.findFirst({
      where: { id: userSkillId, userId },
    });

    if (!userSkill) {
      throw new Error('User skill not found');
    }

    return prisma.userSkill.update({
      where: { id: userSkillId },
      data: {
        proficiency_level: proficiencyLevel,
        years_of_experience: yearsOfExperience,
      },
      include: {
        skill: {
          include: { category: true },
        },
      },
    });
  }

  async deleteUserSkill(userSkillId: string, userId: string) {
    const userSkill = await prisma.userSkill.findFirst({
      where: { id: userSkillId, userId },
    });

    if (!userSkill) {
      throw new Error('User skill not found');
    }

    await prisma.userSkill.delete({
      where: { id: userSkillId },
    });

    return { message: 'Skill removed successfully' };
  }

  async searchUsersBySkill(skillId?: string, query?: string) {
    const whereClause: any = {};

    if (skillId) {
      whereClause.user_skills = {
        some: { skillId },
      };
    }

    if (query) {
      whereClause.OR = [
        { full_name: { contains: query } },
        { email: { contains: query } },
        { roll_number: { contains: query } },
        { department: { contains: query } },
      ];
    }

    return prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        roll_number: true,
        full_name: true,
        email: true,
        role: true,
        department: true,
        avg_rating: true,
        user_skills: {
          include: {
            skill: {
              include: { category: true },
            },
          },
        },
      },
    });
  }

  async getLearningGoals(userId: string) {
    return prisma.learningGoal.findMany({
      where: { userId },
      include: {
        skill: {
          include: { category: true },
        },
      },
      orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
    });
  }

  async addLearningGoal(userId: string, skillId: string, description?: string, priority?: string) {
    return prisma.learningGoal.create({
      data: {
        userId,
        skillId,
        description,
        priority: priority || 'medium',
      },
      include: {
        skill: {
          include: { category: true },
        },
      },
    });
  }

  async updateLearningGoal(goalId: string, userId: string, status?: string, priority?: string) {
    const goal = await prisma.learningGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Learning goal not found');
    }

    return prisma.learningGoal.update({
      where: { id: goalId },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: {
        skill: {
          include: { category: true },
        },
      },
    });
  }

  async deleteLearningGoal(goalId: string, userId: string) {
    const goal = await prisma.learningGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Learning goal not found');
    }

    await prisma.learningGoal.delete({
      where: { id: goalId },
    });

    return { message: 'Learning goal removed' };
  }

  async getSuggestedMentorsForGoal(goalId: string) {
    const goal = await prisma.learningGoal.findUnique({
      where: { id: goalId },
      include: { skill: true },
    });

    if (!goal) {
      throw new Error('Learning goal not found');
    }

    const mentors = await prisma.user.findMany({
      where: {
        role: 'faculty',
        user_skills: {
          some: { skillId: goal.skillId },
        },
      },
      select: {
        id: true,
        full_name: true,
        department: true,
        avg_rating: true,
        user_skills: {
          where: { skillId: goal.skillId },
          include: { skill: true },
        },
      },
      orderBy: { avg_rating: 'desc' },
      take: 5,
    });

    return mentors.map((m) => ({
      ...m,
      user_id: m.id,
      user_skills: m.user_skills.map((us) => ({
        ...us,
        user_skill_id: us.id,
        skill_id: us.skillId,
      })),
    }));
  }
}

export const skillService = new SkillService();