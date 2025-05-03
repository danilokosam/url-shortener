import { createLogger, format, transports } from "winston";

// Custom format to nest metada under a "medata" field
const customFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const logObject = {
      level,
      message,
      timestamp,
    };

    // Only add metadata field if there are additional properties
    if (Object.keys(metadata).length > 0) {
      logObject.metadata = metadata;
    }

    return JSON.stringify(logObject);
  }
);

// Configure the Winston logger
const logger = createLogger({
  level: "info", // Log messages at 'info' level and above (info, warn, error)
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp to logs
    customFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
  ],
});

export default logger;
