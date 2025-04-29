import * as urlService from "../services/urlService.js";
import { AppError } from "../utils/appError.js";

export const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return next(new AppError("originalUrl is required", 400));
    }

    const url = await urlService.createShortUrl(originalUrl);
    res.status(201).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await urlService.getUrlByShortCode(shortCode);
    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
};
