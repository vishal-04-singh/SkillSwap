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

export default router;
