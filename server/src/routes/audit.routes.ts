import { Router } from 'express';
import { getAuditChain, verifyAuditChain } from '../controllers/audit.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();
router.use(authenticate, requireRole('PIC'));
router.get('/', getAuditChain);
router.get('/verify', verifyAuditChain);
export default router;
