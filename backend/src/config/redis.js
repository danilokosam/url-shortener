import { createClient } from "redis";
import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from "./env.js";
import { AppError } from "../utils/appError.js";
import logger from "../utils/logger.js";
import { host } from "envalid";

const client = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

logger.info("Connecting to Redis..."),
  {
    host: REDIS_HOST,
    port: REDIS_PORT,
  };

client.on("connect", () => {
  logger.info("Connected to Redis! 🚀", {
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
});

client.on("recconecting", () => {
  logger.warn("Reconnecting to Redis... 🔄", {
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
});

client.on("error", (err) => {
  logger.error("Redis connection error", {
    error: err.message,
    stack: err.stack,
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
  throw new AppError("Could not connect to Redis database", 500);
});

client.on("ready", () => {
  logger.info("Redis client is ready to accept commands", {
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
});

client.on("end", () => {
  logger.warn("Redis connection closed", {
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
});

export default client;
