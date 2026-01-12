import { redisClient } from "../config/redis.config";

export const incrementRequestCount = async (
  key: string,
  windowInSeconds: number
) => {
  const currentCount = await redisClient.incr(key);

  // If first request, set expiry
  if (currentCount === 1) {
    await redisClient.expire(key, windowInSeconds);
  }

  const ttl = await redisClient.ttl(key);

  return { currentCount, ttl };
};
