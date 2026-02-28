import prisma from '../config/database.js';
import { generateEmbedding } from './ai.service.js';
import { cosineSimilarity } from '../utils/cosine.js';
import { DedupResult } from '../types/index.js';

const SIMILARITY_THRESHOLD = 0.85;

export async function checkDuplicate(
  text: string,
  zoneId: string,
  embedding: number[]
): Promise<DedupResult> {
  // Get open reports in same zone
  const existingReports = await prisma.report.findMany({
    where: {
      zoneId,
      status: { in: ['OPEN', 'IN_PROGRESS'] },
    },
    select: { id: true, embedding: true },
  });

  if (existingReports.length === 0) return { isDuplicate: false };

  let maxSimilarity = 0;
  let mostSimilarId: string | undefined;

  for (const report of existingReports) {
    if (!report.embedding || !Array.isArray(report.embedding)) continue;
    const similarity = cosineSimilarity(embedding, report.embedding as number[]);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarId = report.id;
    }
  }

  if (maxSimilarity >= SIMILARITY_THRESHOLD && mostSimilarId) {
    return { isDuplicate: true, existingReportId: mostSimilarId, similarity: maxSimilarity };
  }

  return { isDuplicate: false };
}

export async function mergeReport(existingReportId: string): Promise<void> {
  await prisma.report.update({
    where: { id: existingReportId },
    data: {
      affectedCount: { increment: 1 },
    },
  });
}

export { generateEmbedding };
