import app from "./app.js";
import { connectDB, PORT } from "./config/index.js";

const startServer = async () => {
  let server;
  try {
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully!");

    // Start the server
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Please use a different port.`
        );
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }

  // Handle process termination gracefully
  process.on("SIGINT", async () => {
    try {
      if (server) {
        server.close(() => {
          console.log("Server closed 👋");
        });
      }
      // Close the database connection
      process.exit(0);
    } catch (error) {
      console.error("Error during server shutdown:", error);
      process.exit(1);
    }
  });
};

startServer();
