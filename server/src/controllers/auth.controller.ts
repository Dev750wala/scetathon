import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database.js';
import { logEvent } from '../services/audit.service.js';
import { registerSchema, loginSchema, validate } from '../utils/validators.js';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const data = validate(registerSchema, req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    await logEvent('USER_REGISTERED', user.email, { userId: user.id, role: user.role });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'] }
    );
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const data = validate(loginSchema, req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }
    await logEvent('USER_LOGIN', user.email, { userId: user.id });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'] }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
}

export async function me(req: Request & { user?: { id: string } }, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
}
