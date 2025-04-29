import * as urlService from "../services/urlService.js";
import { tryCatchFn } from "../utils/tryCatch.js";
import { shortenUrlSchema } from "../schemas/urlSchema.js";
import validate from "../middlewares/validationMiddleware.js";

export const shortenUrl = tryCatchFn(async (req, res, _next) => {
  const { originalUrl } = req.validatedData.body;
  const url = await urlService.createShortUrl(originalUrl);
  res.status(201).json({
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
    clicks: url.clicks,
    createdAt: url.createdAt,
  });
});

export const redirectUrl = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params;
  const url = await urlService.getUrlByShortCode(shortCode);
  res.redirect(301, url.originalUrl);
});

export const getUrlStats = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params;
  const url = await urlService.findUrlByShortCode(shortCode);

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
});

export const shortenUrlWithValidation = [
  validate(shortenUrlSchema),
  shortenUrl,
];

// export const shortenUrlWithValidation = [validate(shortenUrlSchema), shortenUrl];
// export const shortenUrlWithAuthAndValidation = [authMiddleware, validate(shortenUrlSchema), shortenUrl]; <- For protected routes
