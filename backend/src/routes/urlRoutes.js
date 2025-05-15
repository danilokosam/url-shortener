import express from "express";
import * as urlController from "../controllers/urlController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// Shorten URL route
router.post("/shorten", authMiddleware, urlController.shortenUrlWithValidation);

// Redirect to original URL route
router.get("/:shortCode", urlController.redirectUrl);

// Get URL stats route
router.get("/stats/:shortCode", authMiddleware, urlController.getUrlStats);

router.patch("/:shortCode", authMiddleware, urlController.changeUrlWithValidation);

export default router;
