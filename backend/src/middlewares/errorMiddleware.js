import { AppError } from "../utils/appError.js";

export const errorHandler = (err, _req, res, _next) => {
  // Handle mongoose errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid input data",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Handle duplicate errors, e.g. short code already exists
  if (err.code === 11000) {
    return res.status(400).json({
      status: "fail",
      message: "Short code already exists",
    });
  }

  // Handle custom errors (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Handle unexpected errors
  console.error("Unexpected error:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong 😢",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
