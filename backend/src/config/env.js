import { config } from "dotenv";
import { cleanEnv, str, port } from "envalid";

// Load environment variables from .env file
const envPath = `.env.${process.env.NODE_ENV || "development"}`;
console.log(`Loading environment file: ${envPath}`);
config({ path: envPath });

// Validate and clean environment variables
const env = cleanEnv(process.env, {
  MONGODB_URI: str({ desc: "MongoDB connection URI" }),
  PORT: port({ default: 3000, desc: "Server port" }),
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  REDIS_PORT: str({ desc: "Redis connection PORT" }),
  REDIS_HOST: str({ desc: "Redis connection PORT" }),
  REDIS_PASSWORD: str({ desc: "Redis connection PASSWORD" })
});

// Export the cleaned environment variables
export const { MONGODB_URI, PORT, NODE_ENV, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = env;
