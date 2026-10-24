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
router.post('/clock-in', verifyToken, clockIn);
router.post('/check-out', verifyToken, clockOut);
router.post('/clock-out', verifyToken, clockOut);
router.patch('/:id/status', verifyToken, authorizeRoles('hr', 'manager'), updateStatus);
router.put('/:id/status', verifyToken, authorizeRoles('hr', 'manager'), updateStatus);

export default router;
