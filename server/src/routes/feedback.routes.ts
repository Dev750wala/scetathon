import { Router } from 'express';
import { submitFeedback, getZoneFeedback } from '../controllers/feedback.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.post('/', authenticate, submitFeedback);
router.get('/zone/:zoneId', getZoneFeedback);
export default router;
