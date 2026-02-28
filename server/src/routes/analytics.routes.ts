import { Router } from 'express';
import { getOverviewStats, getTrends, getZonePerformance } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();
router.use(authenticate, requireRole('PIC', 'SUPERVISOR'));
router.get('/overview', getOverviewStats);
router.get('/trends', getTrends);
router.get('/zones', getZonePerformance);
export default router;
