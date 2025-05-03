import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";
import logger from "../utils/logger.js";

// Connect to MongoDB using Mongoose
export const connectDB = async () => {
  try {
    const connectionString = MONGODB_URI;
    if (!connectionString) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    logger.info("Connecting to MongoDB...");

    const options = {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    };

    // Mongoose connection events
    mongoose.connection.on("connecting", () => {
      logger.info("Connecting to MongoDB... ⏳");
    });

    mongoose.connection.on("connected", () => {
      logger.info("Connected to MongoDB! ⭐⭐⭐");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Disconnected from MongoDB. Attempting to reconnect... 🔄");
    });

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", {
        error: error.message,
        stack: error.stack,
      });
    });

    await mongoose.connect(connectionString, options);

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// Close the MongoDB connection gracefully on process termination
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed 👋");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
});
