import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';
import { logEvent } from '../services/audit.service.js';
import { verifyResolution } from '../services/vision.service.js';
import { adaptDecayRate } from '../services/entropy.service.js';
import { paginate } from '../utils/helpers.js';
import { assignJobSchema, validate } from '../utils/validators.js';
import { uploadBuffer } from '../config/cloudinary.js';

export async function getJobs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, take } = paginate(Number(page), Number(limit));
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (req.user?.role === 'SUPERVISOR') where.supervisorId = req.user.id;

    const [jobs, total] = await Promise.all([
      prisma.jobCard.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          zone: { select: { id: true, name: true, building: true } },
          report: { select: { id: true, title: true, category: true, severity: true } },
          assignedWorker: { select: { id: true, name: true } },
        },
      }),
      prisma.jobCard.count({ where }),
    ]);
    res.json({ success: true, data: { jobs, total } });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
}

export async function assignJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = validate(assignJobSchema, req.body);
    const job = await prisma.jobCard.update({
      where: { id: req.params.id },
      data: {
        assignedWorkerId: data.workerId,
        supervisorId: req.user!.id,
        status: 'ASSIGNED',
      },
    });
    await logEvent('JOB_ASSIGNED', req.user!.email, { jobId: job.id, workerId: data.workerId });
    res.json({ success: true, data: job });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to assign job' });
  }
}

export async function updateJobStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, notes } = req.body;
    const updateData: Record<string, unknown> = { status, notes };
    if (status === 'IN_PROGRESS') updateData.startedAt = new Date();
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    const job = await prisma.jobCard.update({
      where: { id: req.params.id },
      data: updateData,
    });
    await logEvent('JOB_STATUS_UPDATED', req.user!.email, { jobId: job.id, status });
    res.json({ success: true, data: job });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to update job status' });
  }
}

export async function uploadEvidence(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) { res.status(400).json({ success: false, error: 'No image provided' }); return; }

    const job = await prisma.jobCard.findUnique({ where: { id: req.params.id } });
    if (!job) { res.status(404).json({ success: false, error: 'Job not found' }); return; }

    const afterImageUrl = await uploadBuffer(req.file.buffer, 'swachh-campus/evidence');

    let afterImageVerified = false;
    if (job.beforeImageUrl) {
      const verification = await verifyResolution(job.beforeImageUrl, afterImageUrl);
      afterImageVerified = verification.isResolved && verification.confidence > 0.7;
    }

    const updatedJob = await prisma.jobCard.update({
      where: { id: req.params.id },
      data: {
        afterImageUrl,
        afterImageVerified,
        status: afterImageVerified ? 'VERIFIED' : 'COMPLETED',
        verifiedAt: afterImageVerified ? new Date() : undefined,
      },
    });

    if (afterImageVerified) {
      await prisma.zone.update({
        where: { id: job.zoneId },
        data: { lastCleanedAt: new Date(), currentScore: 100 },
      });
      await adaptDecayRate(job.zoneId);
    }

    await logEvent('EVIDENCE_UPLOADED', req.user!.email, { jobId: job.id, verified: afterImageVerified });
    res.json({ success: true, data: updatedJob });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to upload evidence' });
  }
}
