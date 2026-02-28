import { PrismaClient, UserRole, ZoneType, ReportCategory, ReportSeverity, ReportStatus, JobStatus, Sentiment } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { computeAuditHash } from '../src/utils/hash';
import { generateGenesisHash } from '../src/utils/helpers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.escalation.deleteMany();
  await prisma.insightCard.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.jobCard.deleteMany();
  await prisma.report.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // Users
  const student = await prisma.user.create({
    data: { email: 'student@scet.ac.in', password: hashedPassword, name: 'Arjun Patel', role: UserRole.STUDENT, phone: '9876543210' },
  });
  const supervisor = await prisma.user.create({
    data: { email: 'supervisor@scet.ac.in', password: hashedPassword, name: 'Ramesh Mehta', role: UserRole.SUPERVISOR, phone: '9876543211' },
  });
  const pic = await prisma.user.create({
    data: { email: 'pic@scet.ac.in', password: hashedPassword, name: 'Dr. Priya Shah', role: UserRole.PIC, phone: '9876543212' },
  });

  // Zones
  const zones = await Promise.all([
    prisma.zone.create({ data: { name: 'Main Cafeteria', building: 'Block A', floor: 'Ground', type: ZoneType.CANTEEN, decayRate: 0.035, currentScore: 82, svgPathId: 'zone-canteen-main', latitude: 21.1702, longitude: 72.8311 } }),
    prisma.zone.create({ data: { name: 'Boys Restroom - Block A', building: 'Block A', floor: '1st', type: ZoneType.RESTROOM, decayRate: 0.05, currentScore: 65, svgPathId: 'zone-restroom-a1', latitude: 21.1703, longitude: 72.8312 } }),
    prisma.zone.create({ data: { name: 'Girls Restroom - Block A', building: 'Block A', floor: '1st', type: ZoneType.RESTROOM, decayRate: 0.045, currentScore: 71, svgPathId: 'zone-restroom-a2' } }),
    prisma.zone.create({ data: { name: 'Main Corridor - Block B', building: 'Block B', floor: '2nd', type: ZoneType.CORRIDOR, decayRate: 0.02, currentScore: 88, svgPathId: 'zone-corridor-b2' } }),
    prisma.zone.create({ data: { name: 'Computer Lab - 301', building: 'Block C', floor: '3rd', type: ZoneType.LAB, decayRate: 0.015, currentScore: 92, svgPathId: 'zone-lab-301' } }),
    prisma.zone.create({ data: { name: 'Classroom - 201', building: 'Block B', floor: '2nd', type: ZoneType.CLASSROOM, decayRate: 0.018, currentScore: 85, svgPathId: 'zone-class-201' } }),
    prisma.zone.create({ data: { name: 'Sports Ground', building: 'Outdoor', floor: 'Ground', type: ZoneType.GROUND, decayRate: 0.008, currentScore: 78, svgPathId: 'zone-ground-main' } }),
    prisma.zone.create({ data: { name: 'Library', building: 'Block D', floor: '1st', type: ZoneType.CLASSROOM, decayRate: 0.01, currentScore: 95, svgPathId: 'zone-library' } }),
    prisma.zone.create({ data: { name: 'Boys Restroom - Block C', building: 'Block C', floor: '1st', type: ZoneType.RESTROOM, decayRate: 0.055, currentScore: 45, svgPathId: 'zone-restroom-c1' } }),
    prisma.zone.create({ data: { name: 'Mini Canteen - Block B', building: 'Block B', floor: 'Ground', type: ZoneType.CANTEEN, decayRate: 0.04, currentScore: 60, svgPathId: 'zone-canteen-b' } }),
  ]);

  const [canteen, restroomA1, restroomA2, corridorB2, labC301, classB201, ground, library, restroomC1, miniCanteen] = zones;

  // Reports
  const report1 = await prisma.report.create({
    data: {
      title: 'Overflowing dustbin near cafeteria entrance',
      description: 'The dustbin at the main cafeteria entrance is completely full and garbage is spilling onto the floor.',
      category: ReportCategory.WASTE,
      severity: ReportSeverity.HIGH,
      status: ReportStatus.IN_PROGRESS,
      zoneId: canteen.id,
      reporterId: student.id,
      affectedCount: 3,
      embedding: [],
    },
  });

  const report2 = await prisma.report.create({
    data: {
      title: 'Water leakage in restroom',
      description: 'There is significant water leakage from a broken pipe in the boys restroom on 1st floor of Block A.',
      category: ReportCategory.SPILL,
      severity: ReportSeverity.CRITICAL,
      status: ReportStatus.OPEN,
      zoneId: restroomA1.id,
      reporterId: student.id,
      affectedCount: 8,
      embedding: [],
    },
  });

  const report3 = await prisma.report.create({
    data: {
      title: 'Foul smell in Block C restroom',
      description: 'Strong odor from the restroom on ground floor of Block C. The drain seems to be blocked.',
      category: ReportCategory.ODOR,
      severity: ReportSeverity.HIGH,
      status: ReportStatus.OPEN,
      zoneId: restroomC1.id,
      reporterId: student.id,
      affectedCount: 12,
      embedding: [],
    },
  });

  const report4 = await prisma.report.create({
    data: {
      title: 'Graffiti on corridor wall',
      description: 'Unauthorized graffiti has been drawn on the corridor wall near classroom 203.',
      category: ReportCategory.GRAFFITI,
      severity: ReportSeverity.MEDIUM,
      status: ReportStatus.RESOLVED,
      zoneId: corridorB2.id,
      reporterId: student.id,
      isVerified: true,
      embedding: [],
    },
  });

  const report5 = await prisma.report.create({
    data: {
      title: 'Broken soap dispenser',
      description: 'The soap dispenser in the girls restroom Block A is broken and not dispensing.',
      category: ReportCategory.BROKEN_FIXTURE,
      severity: ReportSeverity.LOW,
      status: ReportStatus.OPEN,
      zoneId: restroomA2.id,
      reporterId: student.id,
      embedding: [],
    },
  });

  // Suppress unused variable warnings
  void report2; void report3; void report5;
  void labC301; void classB201; void ground; void library; void miniCanteen;
  void pic;

  // Job Cards
  const job1 = await prisma.jobCard.create({
    data: {
      status: JobStatus.IN_PROGRESS,
      assignedWorkerId: supervisor.id,
      supervisorId: supervisor.id,
      zoneId: canteen.id,
      reportId: report1.id,
      startedAt: new Date(),
      notes: 'Worker dispatched to empty dustbin and clean area',
    },
  });

  const job2 = await prisma.jobCard.create({
    data: {
      status: JobStatus.VERIFIED,
      assignedWorkerId: supervisor.id,
      supervisorId: supervisor.id,
      zoneId: corridorB2.id,
      reportId: report4.id,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      verifiedAt: new Date(Date.now() - 60 * 60 * 1000),
      afterImageVerified: true,
      notes: 'Graffiti removed using industrial cleaner',
    },
  });

  // Update reports with job references
  await prisma.report.update({ where: { id: report1.id }, data: { assignedJobId: job1.id } });
  await prisma.report.update({ where: { id: report4.id }, data: { assignedJobId: job2.id } });

  // Feedback
  await prisma.feedback.create({
    data: { cleanlinessRating: 4, odorRating: 3, suppliesRating: 4, comment: 'Generally clean but could use more frequent mopping', sentiment: Sentiment.POSITIVE, zoneId: canteen.id, userId: student.id },
  });
  await prisma.feedback.create({
    data: { cleanlinessRating: 2, odorRating: 1, suppliesRating: 2, comment: 'Restroom needs urgent attention', sentiment: Sentiment.NEGATIVE, zoneId: restroomA1.id, userId: student.id },
  });

  // Audit Log - genesis entry
  const genesisHash = generateGenesisHash();
  const now = new Date();
  const firstHash = computeAuditHash(genesisHash, now, 'SYSTEM_INITIALIZED', 'system', { message: 'Swachh Campus 360 initialized' });
  await prisma.auditLog.create({
    data: { action: 'SYSTEM_INITIALIZED', actor: 'system', data: { message: 'Swachh Campus 360 initialized' }, previousHash: genesisHash, currentHash: firstHash },
  });

  // Insight Cards
  await prisma.insightCard.create({
    data: {
      title: 'Restrooms need more frequent cleaning',
      description: 'Analysis of the last 30 days shows that restroom complaints spike between 12PM-2PM (lunch hours). Consider scheduling additional cleaning during this period.',
      pattern: { zoneType: 'RESTROOM', timeRange: '12:00-14:00', frequency: 15 },
      confidence: 0.87,
      suggestedAction: 'Schedule additional restroom cleaning between 12PM and 2PM on weekdays',
      isActive: true,
    },
  });

  await prisma.insightCard.create({
    data: {
      title: 'Block C restroom requires infrastructure upgrade',
      description: 'The Block C restroom has a 3x higher complaint rate compared to other restrooms. Historical data suggests recurring drainage issues.',
      pattern: { zoneId: restroomC1.id, category: 'ODOR', avgScore: 45 },
      confidence: 0.92,
      suggestedAction: 'Initiate maintenance request for drainage inspection in Block C restroom',
      zoneId: restroomC1.id,
      isActive: true,
    },
  });

  console.log('✅ Seeding complete!');
  console.log('📧 Demo accounts:');
  console.log('   student@scet.ac.in / Password123!');
  console.log('   supervisor@scet.ac.in / Password123!');
  console.log('   pic@scet.ac.in / Password123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
