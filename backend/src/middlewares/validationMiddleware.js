import { AppError } from "../utils/appError.js";
import { tryCatchFn } from "../utils/tryCatch.js";
import logger from "../utils/logger.js";

/**
 * Creates a middleware to validate incoming requests against a Zod schema.
 * @param {import('zod').ZodObject} schema - The Zod schema to validate the request against.
 * @returns {Function} An Express middleware function that validates req.body, req.params, and req.query.
 */
const validate = (schema) => {
  // Wrap the validation logic in tryCatchFn to handle errors gracefully
  const validateHandler = tryCatchFn(async (req, _res, next) => {
    logger.info("Validating incoming request...", {
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Parse the request data (body, params, query) using the provided schema
    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // If validation fails, throw an AppError with structured error details
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join("."), // Join the path array into a string (e.g., "body.originalUrl")
        message: err.message, // Error message from Zod
      }));
      throw new AppError(
        {
          message: "Validation error",
          errors: formattedErrors,
        },
        400
      );
    }

    // If validation succeeds, attach the validated data to req.validatedData
    req.validatedData = {
      body: result.data.body || {},
      params: result.data.params || {},
      query: result.data.query || {},
    };

    logger.info("Request validated successfully", {
      url: req.url,
      method: req.method,
      validatedData: req.validatedData,
    });

    next();
  });

  return validateHandler;
};

export default validate;
