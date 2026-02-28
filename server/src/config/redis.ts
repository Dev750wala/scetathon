import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    redisClient.on('connect', () => console.log('✅ Redis connected'));
    redisClient.on('error', (err) => console.error('❌ Redis error:', err));
  }
  return redisClient;
}

export async function connectRedis(): Promise<void> {
  try {
    const client = getRedisClient();
    await client.connect();
  } catch (error) {
    console.warn('⚠️ Redis connection failed, continuing without cache:', error);
  }
}

export default getRedisClient;
