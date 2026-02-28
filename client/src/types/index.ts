// User types
export type UserRole = 'STUDENT' | 'SUPERVISOR' | 'PIC';
export type ZoneType = 'RESTROOM' | 'CANTEEN' | 'CORRIDOR' | 'CLASSROOM' | 'GROUND' | 'LAB';
export type ReportCategory = 'WASTE' | 'SPILL' | 'ODOR' | 'GRAFFITI' | 'BROKEN_FIXTURE' | 'OTHER';
export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ReportStatus = 'OPEN' | 'MERGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type JobStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
export type ZoneStatus = 'clean' | 'attention' | 'critical';
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  building: string;
  floor?: string;
  type: ZoneType;
  decayRate: number;
  lastCleanedAt: string;
  currentScore: number;
  svgPathId?: string;
  latitude?: number;
  longitude?: number;
  liveScore?: number;
  status?: ZoneStatus;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  imageUrl?: string;
  imageAnalysis?: Record<string, unknown>;
  affectedCount: number;
  isVerified: boolean;
  zoneId: string;
  reporterId: string;
  zone?: Pick<Zone, 'id' | 'name'>;
  reporter?: Pick<User, 'id' | 'name'>;
  createdAt: string;
  updatedAt: string;
  merged?: boolean;
}

export interface JobCard {
  id: string;
  status: JobStatus;
  assignedWorkerId?: string;
  supervisorId?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  afterImageVerified: boolean;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  zoneId: string;
  reportId: string;
  zone?: Pick<Zone, 'id' | 'name' | 'building'>;
  report?: Pick<Report, 'id' | 'title' | 'category' | 'severity'>;
  assignedWorker?: Pick<User, 'id' | 'name'>;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  cleanlinessRating: number;
  odorRating: number;
  suppliesRating: number;
  comment?: string;
  sentiment: SentimentType;
  zoneId: string;
  userId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  data: Record<string, unknown>;
  previousHash: string;
  currentHash: string;
  createdAt: string;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  pattern: Record<string, unknown>;
  confidence: number;
  suggestedAction: string;
  zoneId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ZoneScore {
  zoneId: string;
  name: string;
  score: number;
  status: ZoneStatus;
  lastUpdated: string;
}

export interface OverviewStats {
  totalReports: number;
  openReports: number;
  resolvedReports: number;
  activeJobs: number;
  avgCleanlinessScore: number;
  resolutionRate: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
