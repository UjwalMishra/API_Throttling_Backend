import { Request, Response, NextFunction } from "express";
import { RATE_LIMIT_CONFIG } from "../config/rateLimit.config";
import { incrementRequestCount } from "../utils/redis.util";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: userId, tier } = req.user;

    const config = RATE_LIMIT_CONFIG[tier];
    const redisKey = `rate_limit:${userId}`;

    const { currentCount, ttl } = await incrementRequestCount(
      redisKey,
      config.windowInSeconds
    );

    // Set rate-limit headers
    res.setHeader("X-RateLimit-Limit", config.limit);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(config.limit - currentCount, 0)
    );
    res.setHeader(
      "X-RateLimit-Reset",
      Math.floor(Date.now() / 1000) + ttl
    );

    if (currentCount > config.limit) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
