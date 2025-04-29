/**
 * A higher-order function that wraps an async function to handle errors in Express.
 * Catches promise rejections and passes them to the next middleware.
 * @param {Function} fn - The async function to wrap, expecting (req, res, next) arguments.
 * @returns {Function} A middleware function that executes fn and handles errors.
 */
export const tryCatchFn = (fn) => {
  // Return a middleware function compatible with Express
  return (req, res, next) => {
    // Execute the wrapped function and catch any promise rejections, passing errors to next
    fn(req, res, next).catch(next);
  };
};

/*
   Usage example in a controller
  export const login = tryCatchFn(async (req, res, next) => {});
  */
