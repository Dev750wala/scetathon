import prisma from '../config/database.js';
import { logEvent } from './audit.service.js';

export async function escalateReport(reportId: string, level: number): Promise<void> {
  await prisma.escalation.create({
    data: { reportId, level, escalatedAt: new Date() },
  });

  await logEvent('ESCALATION_CREATED', 'system', { reportId, level });
}

export async function checkAndEscalateStalledReports(): Promise<void> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Level 1: Reports open > 24h → escalate to supervisor
  const stalledReports = await prisma.report.findMany({
    where: {
      status: 'OPEN',
      createdAt: { lt: twentyFourHoursAgo },
      escalations: { none: { level: 1 } },
    },
    select: { id: true },
  });

  for (const r of stalledReports) {
    await escalateReport(r.id, 1);
  }

  // Level 2: Reports still open > 48h → escalate to PIC
  const criticalReports = await prisma.report.findMany({
    where: {
      status: { in: ['OPEN', 'IN_PROGRESS'] },
      createdAt: { lt: fortyEightHoursAgo },
      escalations: { none: { level: 2 } },
    },
    select: { id: true },
  });

  for (const r of criticalReports) {
    await escalateReport(r.id, 2);
  }
}
