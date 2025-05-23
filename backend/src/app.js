import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import urlRoutes from "./routes/urlRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
import logger from "./utils/logger.js";

const app = express();

// Middleware to attach a unique request ID to each request
app.use((req, _res, next) => {
  req.id = uuidv4();
  next();
});

// Define a custom Morgan token for the request ID
morgan.token("id", (req) => req.id);

// Use Morgan with a custom JSON log format
app.use(
  morgan(function (tokens, req, res) {
    return JSON.stringify({
      requestId: tokens.id(req, res), // Unique request ID
      method: tokens.method(req, res), // HTTP method (GET, POST, etc.)
      url: tokens.url(req, res), // Request URL
      status: parseInt(tokens.status(req, res), 10), // HTTP status code as an integer
      responseTime: `${tokens["response-time"](req, res)} ms`, // Response time in ms
    });
  })
);

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use("/api/v1/urls", urlRoutes);
app.use("/api/v1/users", userRoutes);

// Health check route
app.get("/health", (_req, res) => {
  logger.info("Health check endpoint accessed");
  res.status(200).json({ message: "Server is running!" });
});

// Error handling middleware
app.use(errorHandler);
export default app;
