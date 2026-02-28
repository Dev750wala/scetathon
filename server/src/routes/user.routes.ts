import { Router } from 'express';
import { listUsers } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();
router.get('/', authenticate, requireRole('SUPERVISOR', 'PIC'), listUsers);
export default router;
