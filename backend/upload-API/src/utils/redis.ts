import { createClient } from 'redis';

export const redisCache = createClient({
  socket: { host: 'redis', port: 6379 },
});

await redisCache.connect();