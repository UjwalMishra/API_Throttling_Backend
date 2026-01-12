import { Request, Response } from "express";
import { upgradeUserTierService } from "./user.service";
import { UserTier } from "../../constants/userTier.constants";
import { signAccessToken } from "../../utils/jwt";

export const upgradeUserTier = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { tier } = req.body;

  if (![UserTier.FREE, UserTier.PREMIUM].includes(tier)) {
    return res.status(400).json({
      message: "Invalid tier value",
    });
  }


  const user = await upgradeUserTierService(req.user.id, tier);

  const newAccessToken = signAccessToken({
    userId: user.id,
    tier: user.tier,
  });


  res.json({
    success: true,
    message: "User upgraded successfully",
    accessToken: newAccessToken,
    user: {
      id: user.id,
      tier: user.tier,
    },
  });
};
