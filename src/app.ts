import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { env } from "./config/env.config";


import { authMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";


const app = express();

// Global Middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true, // for cookies
    exposedHeaders: [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
  })
);

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

// invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// error handler
app.use(errorHandler);

export default app;
