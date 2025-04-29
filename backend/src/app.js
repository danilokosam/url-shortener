import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/urls", urlRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Error handling middleware
app.use(errorHandler);
export default app;
