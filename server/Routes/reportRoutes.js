import { Router } from 'express';
import { getWorkforceSummary } from '../Controllers/reportController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/summary', verifyToken, authorizeRoles('hr', 'manager'), getWorkforceSummary);

export default router;
