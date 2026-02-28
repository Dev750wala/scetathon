import { Router } from 'express';
import authRoutes from './auth.routes.js';
import reportRoutes from './report.routes.js';
import jobRoutes from './job.routes.js';
import zoneRoutes from './zone.routes.js';
import analyticsRoutes from './analytics.routes.js';
import auditRoutes from './audit.routes.js';
import feedbackRoutes from './feedback.routes.js';
import insightRoutes from './insight.routes.js';
import userRoutes from './user.routes.js';
import qrRoutes from './qr.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/jobs', jobRoutes);
router.use('/zones', zoneRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit', auditRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/insights', insightRoutes);
router.use('/users', userRoutes);
router.use('/qr', qrRoutes);

export default router;
