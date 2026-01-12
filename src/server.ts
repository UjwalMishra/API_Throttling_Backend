import app from "./app";
import mongoose from "mongoose";
import { env } from "./config/env.config";
import { redisClient } from "./config/redis.config";
import { connectDB } from "./config/db";

const startServer = async () => {
  try {
    // MongoDB
    connectDB();

    // Redis
    await redisClient.connect();

    // Server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
    
  } catch (error) {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  }
};

startServer();
