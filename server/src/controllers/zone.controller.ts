import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { calculateScore, getZoneStatus } from '../services/entropy.service.js';

export async function getZones(_req: Request, res: Response): Promise<void> {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { reports: true } } },
    });
    res.json({ success: true, data: zones });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch zones' });
  }
}

export async function getZoneById(req: Request, res: Response): Promise<void> {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: req.params.id },
      include: {
        reports: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { reports: true, feedbacks: true } },
      },
    });
    if (!zone) { res.status(404).json({ success: false, error: 'Zone not found' }); return; }
    const score = calculateScore(zone.decayRate, zone.lastCleanedAt);
    res.json({ success: true, data: { ...zone, liveScore: score, status: getZoneStatus(score) } });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch zone' });
  }
}

export async function getZoneScores(_req: Request, res: Response): Promise<void> {
  try {
    const zones = await prisma.zone.findMany({ select: { id: true, name: true, decayRate: true, lastCleanedAt: true, currentScore: true } });
    const scores = zones.map((z) => ({
      zoneId: z.id,
      name: z.name,
      score: calculateScore(z.decayRate, z.lastCleanedAt),
      status: getZoneStatus(calculateScore(z.decayRate, z.lastCleanedAt)),
      lastUpdated: new Date(),
    }));
    res.json({ success: true, data: scores });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch zone scores' });
  }
}
