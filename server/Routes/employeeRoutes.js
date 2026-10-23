import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../Controllers/employeeController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Read directory (authenticated users)
router.get('/', verifyToken, getEmployees);
router.get('/:id', verifyToken, getEmployeeById);

// HR only mutations
router.post('/', verifyToken, authorizeRoles('hr'), createEmployee);
router.patch('/:id', verifyToken, updateEmployee); // Users can update self; HR can update all
router.delete('/:id', verifyToken, authorizeRoles('hr'), deleteEmployee);

export default router;
