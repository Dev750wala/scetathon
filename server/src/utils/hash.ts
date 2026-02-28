import crypto from 'crypto';

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function computeAuditHash(
  previousHash: string,
  timestamp: Date,
  action: string,
  actor: string,
  data: unknown
): string {
  const payload = `${previousHash}${timestamp.toISOString()}${action}${actor}${JSON.stringify(data)}`;
  return sha256(payload);
}
