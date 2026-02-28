import { Request, Response } from 'express';
import { getChain, verifyChain } from '../services/audit.service.js';

export async function getAuditChain(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const chain = await getChain(page, limit);
    res.json({ success: true, data: chain });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch audit chain' });
  }
}

export async function verifyAuditChain(_req: Request, res: Response): Promise<void> {
  try {
    const result = await verifyChain();
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to verify audit chain' });
  }
}
