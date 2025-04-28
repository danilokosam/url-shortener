import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "URL routes are working!" });
});

export default router;
