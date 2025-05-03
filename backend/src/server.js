import app from "./app.js";
import { connectDB, PORT } from "./config/index.js";
import client from "./config/redis.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  let server;
  try {
    // Connect to the database
    await connectDB();
    await client.connect();
    logger.info("Database and Redis connections established successfully");

    // Start the server
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} 🚀`, {
        environment: process.env.NODE_ENV || "development",
      });
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(
          `Port ${PORT} is already in use. Please use a different port.`,
          {
            port: PORT,
          }
        );
      } else {
        logger.error("Server error", {
          error: error.message,
          stack: error.stack,
        });
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error("Error starting the server", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }

  // Handle process termination gracefully
  process.on("SIGINT", async () => {
    try {
      if (server) {
        server.close(() => {
          logger.info("Server closed 👋");
        });
      }
      // Close the Redis client
      await client.disconnect();
      logger.info("Redis client disconnected during shutdown");
      // Close the database connection
      process.exit(0);
    } catch (error) {
      logger.error("Error during server shutdown", {
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    }
  });
};

startServer();
