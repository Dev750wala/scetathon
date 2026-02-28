import { Router } from 'express';
import { getZones, getZoneById, getZoneScores } from '../controllers/zone.controller.js';

const router = Router();
router.get('/', getZones);
router.get('/scores', getZoneScores);
router.get('/:id', getZoneById);
export default router;
