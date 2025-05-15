import { config } from "dotenv";
import { cleanEnv, str, port } from "envalid";
import logger from "../utils/logger.js";

// Load and validate environment variables
const envPath = `.env.${process.env.NODE_ENV || "development"}`;
logger.info(`Loading environment file: ${envPath}`);
config({ path: envPath });

let MONGODB_URI, PORT, NODE_ENV, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET;

try {
  // Validate and clean environment variables
  const env = cleanEnv(process.env, {
    MONGODB_URI: str({ desc: "MongoDB connection URI" }),
    PORT: port({ default: 3000, desc: "Server port" }),
    NODE_ENV: str({
      choices: ["development", "production", "test"],
      default: "development",
    }),
    REDIS_PORT: str({ desc: "Redis connection PORT" }),
    REDIS_HOST: str({ desc: "Redis connection HOST" }),
    REDIS_PASSWORD: str({ desc: "Redis connection PASSWORD" }),
    JWT_ACCESS_SECRET: str({ desc: "Secret for encode the access token" }),
    JWT_REFRESH_SECRET: str({ desc: "Secret for encode the refresh token" })
  });

  // Assign the cleaned environment variables
  ({ MONGODB_URI, PORT, NODE_ENV, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } =
    env);

  logger.info("Environment variables loaded and validated successfully", {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
  });
} catch (error) {
  logger.error("Failed to validate environment variables", {
    error: error.message,
    stack: error.stack,
  });
  throw error; // Re-throw the error to halt the application
}

export { MONGODB_URI, PORT, NODE_ENV, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET };
