import { Router } from 'express';
import { getJobs, assignJob, updateJobStatus, uploadEvidence } from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(authenticate);
router.get('/', getJobs);
router.patch('/:id/assign', requireRole('SUPERVISOR'), assignJob);
router.patch('/:id/status', updateJobStatus);
router.post('/:id/evidence', upload.single('image'), uploadEvidence);
export default router;
