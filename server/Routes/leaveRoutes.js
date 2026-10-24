import { Router } from 'express';
import {
  getLeaves,
  applyLeave,
  approveLeave,
  rejectLeave,
  updateLeaveStatus,
} from '../Controllers/leaveController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getLeaves);
router.post('/', verifyToken, applyLeave);

// Manager and HR can review
router.patch('/:id/approve', verifyToken, authorizeRoles('hr', 'manager'), approveLeave);
router.patch('/:id/reject', verifyToken, authorizeRoles('hr', 'manager'), rejectLeave);
router.put('/:id/status', verifyToken, authorizeRoles('hr', 'manager'), updateLeaveStatus);
router.patch('/:id/status', verifyToken, authorizeRoles('hr', 'manager'), updateLeaveStatus);

export default router;
