import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/urls", urlRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

export default app;
