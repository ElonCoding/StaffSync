import { Router } from 'express';
import {
  getTrainingPrograms,
  createTrainingProgram,
  updateProgress,
} from '../Controllers/trainingController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getTrainingPrograms);
router.post('/', verifyToken, authorizeRoles('hr', 'manager'), createTrainingProgram);
router.patch('/:id/progress', verifyToken, updateProgress);

export default router;
