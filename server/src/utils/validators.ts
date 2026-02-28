import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  role: z.enum(['STUDENT', 'SUPERVISOR', 'PIC']),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createReportSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  category: z.enum(['WASTE', 'SPILL', 'ODOR', 'GRAFFITI', 'BROKEN_FIXTURE', 'OTHER']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  zoneId: z.string().uuid(),
});

export const createFeedbackSchema = z.object({
  cleanlinessRating: z.number().int().min(1).max(5),
  odorRating: z.number().int().min(1).max(5),
  suppliesRating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  zoneId: z.string().uuid(),
});

export const assignJobSchema = z.object({
  workerId: z.string().uuid(),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
