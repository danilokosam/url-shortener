import express from "express";
import * as urlController from "../controllers/urlController.js";
const router = express.Router();

// Shorten URL route
router.post("/shorten", urlController.shortenUrl);

// Redirect to original URL route
router.get("/:shortCode", urlController.redirectUrl);

export default router;
