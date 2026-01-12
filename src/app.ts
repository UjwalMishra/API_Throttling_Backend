import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";

import { authMiddleware } from "./middlewares/auth.middleware";


const app = express();

// Global Middlewares 
app.use(express.json());
app.use(cookieParser());

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Test Route for Rate Limiting

app.get(
  "/api/test-rate-limit",
  authMiddleware,
  rateLimitMiddleware,
  (req, res) => {
    res.json({
      message: "Request successful 🎉",
      userId: req.user?.id,
      tier: req.user?.tier,
    });
  }
);

export default app;
