import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

// Connect to MongoDB using Mongoose
export const connectDB = async () => {
  try {
    const connectionString = MONGODB_URI;
    if (!connectionString) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    console.log("Connecting to MongoDB...");

    const options = {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    };

    // Mongoose connection events
    mongoose.connection.on("connecting", () => {
      console.log("Connecting to MongoDB... ⏳");
    });

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB! ⭐⭐⭐");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB. Attempting to reconnect... 🔄");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    await mongoose.connect(connectionString, options);

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

// Close the MongoDB connection gracefully on process termination
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed 👋");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});
