import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UserTier } from "../constants/userTier.constants";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token) as {
      userId: string;
      tier: UserTier;
    };

    req.user = {
      id: decoded.userId,
      tier: decoded.tier,
    };

    next();
  } catch {
    res.status(401).json({ message: "Access token expired" });
  }
};
