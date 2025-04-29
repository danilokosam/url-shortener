import express from "express";
import * as urlController from "../controllers/urlController.js";
const router = express.Router();

// Shorten URL route
router.post("/shorten", urlController.shortenUrlWithValidation);

// Redirect to original URL route
router.get("/:shortCode", urlController.redirectUrl);

// Get URL stats route
router.get("/stats/:shortCode", urlController.getUrlStats);

router.patch("/:shortCode", urlController.changeUrl);

export default router;
