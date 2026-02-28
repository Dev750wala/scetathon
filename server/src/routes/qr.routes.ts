import { Router } from 'express';
import { getZoneQR } from '../controllers/qr.controller.js';

const router = Router();
router.get('/:zoneId', getZoneQR);
export default router;
