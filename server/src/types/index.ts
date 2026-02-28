import { Request } from 'express';

export type UserRole = 'STUDENT' | 'SUPERVISOR' | 'PIC';
export type ZoneType = 'RESTROOM' | 'CANTEEN' | 'CORRIDOR' | 'CLASSROOM' | 'GROUND' | 'LAB';
export type ReportCategory = 'WASTE' | 'SPILL' | 'ODOR' | 'GRAFFITI' | 'BROKEN_FIXTURE' | 'OTHER';
export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ReportStatus = 'OPEN' | 'MERGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type JobStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type ZoneStatus = 'clean' | 'attention' | 'critical';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AIAnalysisResult {
  category: ReportCategory;
  severity: ReportSeverity;
  isValid: boolean;
  confidence: number;
  description: string;
}

export interface VisionVerificationResult {
  isResolved: boolean;
  confidence: number;
  notes: string;
}

export interface DedupResult {
  isDuplicate: boolean;
  existingReportId?: string;
  similarity?: number;
}

export interface EntropyScore {
  zoneId: string;
  score: number;
  status: ZoneStatus;
  lastUpdated: Date;
}

export interface AuditEventData {
  [key: string]: unknown;
}

export interface InsightPattern {
  zoneId?: string;
  timeOfDay?: string;
  dayOfWeek?: string;
  category?: ReportCategory;
  frequency?: number;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ReportFilters extends PaginationQuery {
  status?: ReportStatus;
  category?: ReportCategory;
  severity?: ReportSeverity;
  zoneId?: string;
  startDate?: string;
  endDate?: string;
}
