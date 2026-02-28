import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';
import { createFeedbackSchema, validate } from '../utils/validators.js';

function detectSentiment(avg: number): 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' {
  if (avg >= 4) return 'POSITIVE';
  if (avg >= 2.5) return 'NEUTRAL';
  return 'NEGATIVE';
}

export async function submitFeedback(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = validate(createFeedbackSchema, req.body);
    const avg = (data.cleanlinessRating + data.odorRating + data.suppliesRating) / 3;
    const sentiment = detectSentiment(avg);

    const feedback = await prisma.feedback.create({
      data: { ...data, userId: req.user!.id, sentiment },
    });
    res.status(201).json({ success: true, data: feedback });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
}

export async function getZoneFeedback(req: Request & { params: { zoneId: string } }, res: Response): Promise<void> {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { zoneId: req.params.zoneId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: feedbacks });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
}
