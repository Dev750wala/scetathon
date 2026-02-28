import { Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import { AuthRequest, ReportFilters } from '../types/index.js';
import { checkDuplicate, mergeReport, generateEmbedding } from '../services/dedup.service.js';
import { classifyReport } from '../services/ai.service.js';
import { logEvent } from '../services/audit.service.js';
import { createReportSchema, validate } from '../utils/validators.js';
import { paginate } from '../utils/helpers.js';
import { uploadBuffer } from '../config/cloudinary.js';

export async function createReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = validate(createReportSchema, req.body);
    const reporterId = req.user!.id;

    // AI classification
    const aiAnalysis = await classifyReport(data.title, data.description);

    // Generate embedding for dedup
    const embedding = await generateEmbedding(`${data.title} ${data.description}`);

    // Check for duplicates
    const dedupResult = await checkDuplicate(data.description, data.zoneId, embedding);

    if (dedupResult.isDuplicate && dedupResult.existingReportId) {
      await mergeReport(dedupResult.existingReportId);
      const existing = await prisma.report.findUnique({ where: { id: dedupResult.existingReportId } });
      res.status(200).json({
        success: true,
        data: existing,
        message: 'Similar report found and merged',
        merged: true,
      });
      return;
    }

    // Handle image upload
    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = await uploadBuffer(req.file.buffer);
    }

    const report = await prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        category: aiAnalysis.category,
        severity: data.severity || aiAnalysis.severity,
        zoneId: data.zoneId,
        reporterId,
        imageUrl,
        imageAnalysis: aiAnalysis as unknown as Prisma.InputJsonValue,
        embedding,
      },
      include: { zone: true, reporter: { select: { id: true, name: true } } },
    });

    await logEvent('REPORT_CREATED', req.user!.email, { reportId: report.id, zoneId: data.zoneId });
    res.status(201).json({ success: true, data: report });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: 'Failed to create report' });
  }
}

export async function getReports(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { page = 1, limit = 20, status, category, severity, zoneId } = req.query as ReportFilters;
    const { skip, take } = paginate(Number(page), Number(limit));

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (severity) where.severity = severity;
    if (zoneId) where.zoneId = zoneId;

    // Students only see their own reports
    if (req.user?.role === 'STUDENT') {
      where.reporterId = req.user.id;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { zone: { select: { id: true, name: true } }, reporter: { select: { id: true, name: true } } },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({ success: true, data: { reports, total, page: Number(page), limit: Number(limit) } });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
}

export async function getReportById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: {
        zone: true,
        reporter: { select: { id: true, name: true } },
        jobCard: true,
      },
    });
    if (!report) { res.status(404).json({ success: false, error: 'Report not found' }); return; }
    res.json({ success: true, data: report });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch report' });
  }
}

export async function updateReportStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status } = req.body;
    const report = await prisma.report.update({
      where: { id: req.params.id },
      data: { status },
    });
    await logEvent('REPORT_STATUS_UPDATED', req.user!.email, { reportId: req.params.id, status });
    res.json({ success: true, data: report });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to update report' });
  }
}
