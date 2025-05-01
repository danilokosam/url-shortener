import * as urlService from "../services/urlService.js";
import { tryCatchFn } from "../utils/tryCatch.js";
import { shortenUrlSchema, shortenUrlSchemaChange } from "../schemas/urlSchema.js";
import validate from "../middlewares/validationMiddleware.js";
import client from '../config/redis.js';

export const shortenUrl = tryCatchFn(async (req, res, _next) => {
  const { originalUrl } = req.validatedData.body;
  const url = await urlService.createShortUrl(originalUrl);
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
  const reply = await client.get(`url:${shortCode}`)
  if (reply) {
    return res.redirect(301, reply)
  }
  const url = await urlService.getUrlByShortCode(shortCode);
  await client.set(`url:${shortCode}`, url.originalUrl, { EX: 60 * 5 })
  await client.del(`url:stats:${shortCode}`)
  return res.redirect(301, url.originalUrl);
});

export const getUrlStats = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params;
  const reply = await client.get(`url:stats:${shortCode}`)
  if (reply) {
    return res.status(200).json(JSON.parse(reply))
  }
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
  }
  await client.set(`url:stats:${shortCode}`, JSON.stringify(stats), { EX: 60 * 5 })

  return res.status(200).json(stats);
});

export const shortenUrlWithValidation = [
  validate(shortenUrlSchema),
  shortenUrl,
];

export const changeUrl = tryCatchFn(async (req, res, _next) => {
  const { shortCode } = req.params
  const { newUrl } = req.body
  const url = await urlService.changeUrl(newUrl, shortCode)
  await client.del(`url:stats:${shortCode}`)
  await client.del(`url:${shortCode}`)
  return res.status(200).json(url)
})

export const changeUrlWithValidation = [
  validate(shortenUrlSchemaChange),
  changeUrl
]

// export const shortenUrlWithValidation = [validate(shortenUrlSchema), shortenUrl];
// export const shortenUrlWithAuthAndValidation = [authMiddleware, validate(shortenUrlSchema), shortenUrl]; <- For protected routes
