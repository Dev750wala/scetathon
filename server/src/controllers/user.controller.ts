import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import prisma from '../config/database.js';

export async function listUsers(req: Request, res: Response): Promise<void> {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({
      where: role ? { role: role as UserRole } : undefined,
      select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
}
