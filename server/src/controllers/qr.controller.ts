import { Request, Response } from 'express';
import { generateZoneQR } from '../services/qr.service.js';

export async function getZoneQR(req: Request, res: Response): Promise<void> {
  try {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const qrDataUrl = await generateZoneQR(req.params.zoneId, baseUrl);
    res.json({ success: true, data: { qrDataUrl, zoneId: req.params.zoneId } });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to generate QR code' });
  }
}
