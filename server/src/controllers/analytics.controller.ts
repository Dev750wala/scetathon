import { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getOverviewStats(_req: Request, res: Response): Promise<void> {
  try {
    const [totalReports, openReports, resolvedReports, activeJobs, avgScore] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.jobCard.count({ where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.zone.aggregate({ _avg: { currentScore: true } }),
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        openReports,
        resolvedReports,
        activeJobs,
        avgCleanlinessScore: Math.round(avgScore._avg.currentScore || 0),
        resolutionRate: totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
}

export async function getTrends(req: Request, res: Response): Promise<void> {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const reports = await prisma.report.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
    });

    res.json({ success: true, data: reports });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch trends' });
  }
}

export async function getZonePerformance(_req: Request, res: Response): Promise<void> {
  try {
    const zones = await prisma.zone.findMany({
      include: {
        _count: { select: { reports: true } },
      },
      orderBy: { currentScore: 'asc' },
    });
    res.json({ success: true, data: zones });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch zone performance' });
  }
}
