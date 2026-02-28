import prisma from '../config/database.js';
import { generateInsightDescription } from './ai.service.js';

export async function analyzePatterns() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Zone + category frequency
  const zonePatterns = await prisma.report.groupBy({
    by: ['zoneId', 'category'],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  });

  return { zonePatterns };
}

export async function generateInsightCards(): Promise<void> {
  const { zonePatterns } = await analyzePatterns();

  for (const pattern of zonePatterns.slice(0, 5)) {
    if (pattern._count.id < 3) continue;

    const description = await generateInsightDescription({
      zoneId: pattern.zoneId,
      category: pattern.category,
      frequency: pattern._count.id,
      period: '30 days',
    });

    await prisma.insightCard.create({
      data: {
        title: `Recurring ${pattern.category} issue in zone`,
        description,
        pattern: { zoneId: pattern.zoneId, category: pattern.category, count: pattern._count.id },
        confidence: Math.min(pattern._count.id / 10, 1.0),
        suggestedAction: `Schedule proactive cleaning for this zone focusing on ${pattern.category.toLowerCase()} issues`,
        zoneId: pattern.zoneId,
        isActive: true,
      },
    });
  }
}

export async function getInsights(zoneId?: string) {
  return prisma.insightCard.findMany({
    where: { isActive: true, ...(zoneId ? { zoneId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}
