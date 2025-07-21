import { createClient } from 'redis';

export const redisPub = createClient({
  socket: { host: 'redis', port: 6379 },
});

export const redisSub = createClient({
  socket: { host: 'redis', port: 6379 },
});


export const redisSubDuplicate = redisSub.duplicate();


export const redisCache = redisPub.duplicate();

await redisPub.connect();
await redisSub.connect();
await redisCache.connect();
await redisSubDuplicate.connect();
