import { Request, Response } from 'express';
import { getInsights, generateInsightCards } from '../services/insight.service.js';

export async function listInsights(req: Request, res: Response): Promise<void> {
  try {
    const { zoneId } = req.query;
    const insights = await getInsights(zoneId as string | undefined);
    res.json({ success: true, data: insights });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch insights' });
  }
}

export async function triggerInsightGeneration(_req: Request, res: Response): Promise<void> {
  try {
    await generateInsightCards();
    res.json({ success: true, message: 'Insight generation triggered' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to generate insights' });
  }
}
