import prisma from '../config/database.js';
import { Prisma } from '@prisma/client';
import { computeAuditHash } from '../utils/hash.js';
import { generateGenesisHash, paginate } from '../utils/helpers.js';
import { AuditEventData } from '../types/index.js';

export async function logEvent(action: string, actor: string, data: AuditEventData): Promise<void> {
  const lastEntry = await prisma.auditLog.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { currentHash: true },
  });

  const previousHash = lastEntry?.currentHash ?? generateGenesisHash();
  const now = new Date();
  const currentHash = computeAuditHash(previousHash, now, action, actor, data);

  await prisma.auditLog.create({
    data: {
      action,
      actor,
      data: data as unknown as Prisma.InputJsonValue,
      previousHash,
      currentHash,
    },
  });
}

export async function verifyChain(): Promise<{ valid: boolean; brokenAt?: number }> {
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (entries.length === 0) return { valid: true };

  // Verify genesis
  if (entries[0].previousHash !== generateGenesisHash()) {
    return { valid: false, brokenAt: 0 };
  }

  for (let i = 1; i < entries.length; i++) {
    if (entries[i].previousHash !== entries[i - 1].currentHash) {
      return { valid: false, brokenAt: i };
    }
    const expectedHash = computeAuditHash(
      entries[i].previousHash,
      entries[i].createdAt,
      entries[i].action,
      entries[i].actor,
      entries[i].data
    );
    if (expectedHash !== entries[i].currentHash) {
      return { valid: false, brokenAt: i };
    }
  }

  return { valid: true };
}

export async function getChain(page: number = 1, limit: number = 50) {
  const { skip, take } = paginate(page, limit);
  const [entries, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.auditLog.count(),
  ]);
  return { entries, total, page, limit };
}
