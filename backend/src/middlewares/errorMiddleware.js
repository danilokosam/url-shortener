import { AppError } from "../utils/appError.js";
import { NODE_ENV } from "../config/env.js";

/**
 * Global error handling middleware for Express.
 * Handles various types of errors (Mongoose, duplicate key, AppError, etc.) and sends a formatted response.
 * @param {Error} err - The error object.
 * @param {Object} _req - The Express request object (not used).
 * @param {Object} res - The Express response object.
 * @param {Function} _next - The Express next function (not used).
 */
export const errorHandler = (err, _req, res, _next) => {
  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid input data",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Handle MongoDB duplicate key errors (e.g., shortCode already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      status: "fail",
      message: "Short code already exists",
    });
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    // If the error has structured details (e.g., validation errors), format the response accordingly
    if (err.details && typeof err.details === "object") {
      const { message, errors } = err.details;
      return res.status(statusCode).json({
        status,
        message,
        ...(errors && { errors }), // Include errors array if present
        ...(NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in development
      });
    }

    // Handle standard AppError with a simple message
    return res.status(statusCode).json({
      status,
      message: err.message,
      ...(NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in development
    });
  }

  // Handle unexpected errors (e.g., programming errors)
  console.error("Unexpected error:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong 😢",
    stack: NODE_ENV === "development" ? err.stack : undefined, // Include stack trace in development
  });
};
