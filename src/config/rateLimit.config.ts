import { UserTier } from "../constants/userTier.constants";

export const RATE_LIMIT_CONFIG: Record<
  UserTier,
  {
    limit: number;
    windowInSeconds: number;
  }
> = {
  FREE: {
    limit: 20,
    windowInSeconds: 60,
  },
  PREMIUM: {
    limit: 100,
    windowInSeconds: 60,
  },
};
