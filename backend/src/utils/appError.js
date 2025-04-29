/**
 * Custom error class for handling operational errors in the application.
 * Extends the built-in Error class to include additional properties like statusCode and status.
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string|Object} message - The error message (string) or a structured error object with message and errors.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    // Extract a string message for the Error parent class
    const messageStr = typeof message === "object" ? message.message : message;
    super(messageStr); // Pass the string message to the Error constructor

    // HTTP status code for the response
    this.statusCode = statusCode;
    // Status label: "fail" for 4xx errors, "error" for 5xx errors
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Mark as an operational error (not a programming error)
    this.isOperational = true;
    // Store the full error details if message is an object (e.g., for validation errors)
    this.details = typeof message === "object" ? message : null;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}
