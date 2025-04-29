import * as urlService from "../services/urlService.js";
import { AppError } from "../utils/appError.js";
import validUrl from "valid-url";
export const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return next(new AppError("originalUrl is required", 400));
    }

    if (!validUrl.isWebUri(originalUrl)) {
      return next(new AppError("Invalid URL format", 400));
    }

    const url = await urlService.createShortUrl(originalUrl);
    res.status(201).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
      clicks: url.clicks,
      // clickHistory: url.clickHistory,
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

export const getUrlStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await urlService.getUrlByShortCode(shortCode);

    const clicksByDay = url.clickHistory.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalClicks: url.clicks,
      clicksByDay,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};
