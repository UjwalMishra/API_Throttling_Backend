import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { UserTier } from "../constants/userTier.constants";

export interface JwtPayload {
  userId: string;
  tier: UserTier,
}

export interface RefreshTokenPayload {
  userId: string;
}


// access token
export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

// refresh token
export const signRefreshToken = (
  payload: RefreshTokenPayload
): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};
