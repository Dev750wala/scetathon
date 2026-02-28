export function hoursSince(date: Date): number {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateGenesisHash(): string {
  return '0'.repeat(64);
}

export function paginate(page: number = 1, limit: number = 20): { skip: number; take: number } {
  const take = Math.min(limit, 100);
  const skip = (page - 1) * take;
  return { skip, take };
}
