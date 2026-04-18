import { Router } from 'express';
import { skillController } from '../controllers/skillController';
import { authenticate } from '../middleware/auth';
import { validate, userSkillSchema } from '../middleware/validate';

const router = Router();

router.get('/', skillController.getAllSkills.bind(skillController));
router.get('/categories', skillController.getCategories.bind(skillController));
router.get('/users/search', skillController.searchUsers.bind(skillController));
router.get('/users/:userId', skillController.getUserSkills.bind(skillController));

router.post('/', authenticate, validate(userSkillSchema), skillController.addUserSkill.bind(skillController));
router.patch('/:id', authenticate, skillController.updateUserSkill.bind(skillController));
router.delete('/:id', authenticate, skillController.deleteUserSkill.bind(skillController));

router.get('/learning-goals', authenticate, skillController.getLearningGoals.bind(skillController));
router.post('/learning-goals', authenticate, skillController.addLearningGoal.bind(skillController));
router.patch('/learning-goals/:id', authenticate, skillController.updateLearningGoal.bind(skillController));
router.delete('/learning-goals/:id', authenticate, skillController.deleteLearningGoal.bind(skillController));
router.get('/learning-goals/:id/suggested-mentors', authenticate, skillController.getSuggestedMentorsForGoal.bind(skillController));

export default router;
