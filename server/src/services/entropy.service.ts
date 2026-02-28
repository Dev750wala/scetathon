import prisma from '../config/database.js';
import { emitZoneUpdate } from '../config/socket.js';
import { hoursSince } from '../utils/helpers.js';
import { ZoneStatus } from '../types/index.js';

export function calculateScore(decayRate: number, lastCleanedAt: Date): number {
  const hours = hoursSince(lastCleanedAt);
  return 100 * Math.exp(-decayRate * hours);
}

export function getZoneStatus(score: number): ZoneStatus {
  if (score >= 70) return 'clean';
  if (score >= 40) return 'attention';
  return 'critical';
}

export function shouldTriggerProactiveCleaning(score: number): boolean {
  return score < 40;
}

export async function updateAllZoneScores(): Promise<void> {
  const zones = await prisma.zone.findMany();

  for (const zone of zones) {
    const newScore = calculateScore(zone.decayRate, zone.lastCleanedAt);
    await prisma.zone.update({
      where: { id: zone.id },
      data: { currentScore: newScore },
    });

    emitZoneUpdate(zone.id, {
      score: newScore,
      status: getZoneStatus(newScore),
      zoneId: zone.id,
    });
  }
}

export async function adaptDecayRate(zoneId: string): Promise<number> {
  // Count complaints in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const count = await prisma.report.count({
    where: {
      zoneId,
      createdAt: { gte: thirtyDaysAgo },
      status: { not: 'MERGED' },
    },
  });

  // Base decay rate 0.01, increase by 0.002 per complaint per day on average
  const complaintsPerDay = count / 30;
  const newRate = Math.min(0.01 + complaintsPerDay * 0.002, 0.1);

  await prisma.zone.update({ where: { id: zoneId }, data: { decayRate: newRate } });
  return newRate;
}
