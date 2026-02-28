import { Router } from 'express';
import { createReport, getReports, getReportById, updateReportStatus } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(authenticate);
router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', upload.single('image'), createReport);
router.patch('/:id/status', requireRole('SUPERVISOR', 'PIC'), updateReportStatus);
export default router;
