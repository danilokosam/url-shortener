import * as urlService from "../services/urlService.js";
import { tryCatchFn } from "../utils/tryCatch.js";
import {
  shortenUrlSchema,
  shortenUrlSchemaChange,
} from "../schemas/urlSchema.js";
import validate from "../middlewares/validationMiddleware.js";
import client from "../config/redis.js";
import logger from "../utils/logger.js";

export const shortenUrl = tryCatchFn(async (req, res, _next) => {
  logger.info("Starting URL shortening process...", {
    originalUrl: req.validatedData.body.originalUrl,
  });

  const { originalUrl } = req.validatedData.body;
  const url = await urlService.createShortUrl(originalUrl);

  logger.info("URL shortened successfully", {
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
  });

  return res.status(201).json({
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
    clicks: url.clicks,
    createdAt: url.createdAt,
  });
});

export const redirectUrl = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params;

  logger.info("Starting URL redirection process...", {
    shortCode,
  });

  const reply = await client.get(`url:${shortCode}`);
  if (reply) {
    logger.info("Cache hit: Redirecting using cached URL", {
      shortCode,
      originalUrl: reply,
    });
    return res.redirect(301, reply);
  }

  logger.info("Cache miss: Fetching URL from database", { shortCode });
  const url = await urlService.getUrlByShortCode(shortCode);

  logger.info("Caching URL in Redis", {
    shortCode,
    originalUrl: url.originalUrl,
  });
  await client.set(`url:${shortCode}`, url.originalUrl, { EX: 60 * 5 });
  await client.del(`url:stats:${shortCode}`);
  logger.info("Invalidated stats cache after redirect", { shortCode });

  logger.info("Redirecting to original URL", {
    shortCode,
    originalUrl: url.originalUrl,
  });
  return res.redirect(301, url.originalUrl);
});

export const getUrlStats = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params;

  logger.info("Starting URL stats retrieval process", { shortCode });

  const reply = await client.get(`url:stats:${shortCode}`);
  if (reply) {
    logger.info("Cache hit: Returning stats from Redis", { shortCode });
    return res.status(200).json(JSON.parse(reply));
  }

  logger.info("Cache miss: Fetching stats from database", { shortCode });
  const url = await urlService.findUrlByShortCode(shortCode);

  const clicksByDay = url.clickHistory.reduce((acc, click) => {
    const date = click.timestamp.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const stats = {
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    totalClicks: url.clicks,
    clicksByDay,
    createdAt: url.createdAt,
    updatedAt: url.updatedAt,
  };

  logger.info("Caching URL stats in Redis", { shortCode });
  await client.set(`url:stats:${shortCode}`, JSON.stringify(stats), {
    EX: 60 * 5,
  });

  logger.info("URL stats retrieved successfully", {
    shortCode,
    totalClicks: stats.totalClicks,
  });
  return res.status(200).json(stats);
});

export const shortenUrlWithValidation = [
  validate(shortenUrlSchema),
  shortenUrl,
];

export const changeUrl = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params;
  const { newUrl } = req.body;

  logger.info("Starting URL update process", { shortCode, newUrl });
  const url = await urlService.changeUrl(newUrl, shortCode);

  logger.info("Invalidating caches after URL update", { shortCode });
  await client.del(`url:stats:${shortCode}`);
  await client.del(`url:${shortCode}`);

  logger.info("URL updated successfully", {
    shortCode,
    newUrl: url.originalUrl,
  });
  return res.status(200).json(url);
});

export const changeUrlWithValidation = [
  validate(shortenUrlSchemaChange),
  changeUrl,
];

// export const shortenUrlWithValidation = [validate(shortenUrlSchema), shortenUrl];
// export const shortenUrlWithAuthAndValidation = [authMiddleware, validate(shortenUrlSchema), shortenUrl]; <- For protected routes
