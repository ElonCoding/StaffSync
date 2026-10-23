import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../Controllers/announcementController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAnnouncements);
router.post('/', verifyToken, authorizeRoles('hr', 'manager'), createAnnouncement);
router.delete('/:id', verifyToken, authorizeRoles('hr'), deleteAnnouncement);

export default router;
