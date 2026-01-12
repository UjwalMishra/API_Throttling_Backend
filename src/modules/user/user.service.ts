import { User } from "./user.model";
import { UserTier } from "../../constants/userTier.constants";
import { AppError } from "../../utils/AppError";

export const upgradeUserTierService = async (
  userId: string,
  tier: UserTier
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.tier === tier) {
    return user; 
  }

  user.tier = tier;
  await user.save();

  return user;
};
