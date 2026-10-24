import { Router } from 'express';
import { login, register, getMe, logout } from '../Controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);

export default router;
