import { Router } from "express";
import { upgradeUserTier } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.patch("/upgrade", authMiddleware, upgradeUserTier);

export default router;
