import { Router } from 'express';
import {
  getAttendance,
  clockIn,
  clockOut,
  updateStatus,
} from '../Controllers/attendanceController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAttendance);
router.post('/check-in', verifyToken, clockIn);
router.post('/check-out', verifyToken, clockOut);
router.patch('/:id/status', verifyToken, authorizeRoles('hr'), updateStatus);

export default router;
