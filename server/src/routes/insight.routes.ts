import { Router } from 'express';
import { listInsights, triggerInsightGeneration } from '../controllers/insight.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();
router.use(authenticate);
router.get('/', listInsights);
router.post('/generate', requireRole('PIC'), triggerInsightGeneration);
export default router;
