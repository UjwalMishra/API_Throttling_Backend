import { UserTier } from "../constants/userTier.constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tier: UserTier;
      };
    }
  }
}
