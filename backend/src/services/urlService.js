import { nanoid } from "nanoid";
import Url from "../models/urlModel.js";
import { AppError } from "../utils/appError.js";
import logger from "../utils/logger.js";

export const createShortUrl = async (originalUrl, author) => {
  logger.info("Starting short URL creation process", { originalUrl });

  let shortCode = nanoid(8); // Generate a unique short code
  logger.info("Generated initial short code", { shortCode, originalUrl });

  // Check if the short code already exists in the database
  let existingUrl = await Url.findOne({ shortCode });
  let attempts = 1;
  while (existingUrl) {
    logger.warn("Short code already exists, generating a new one", {
      shortCode,
      attempt: attempts,
    });
    shortCode = nanoid(8); // Generate a new short code if it already exists
    existingUrl = await Url.findOne({ shortCode });
    attempts++;
  }

  // Create and save a new URL entry in the database
  const url = new Url({
    originalUrl,
    shortCode,
    author
  });
  await url.save();
  logger.info("Short URL saved to database", {
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
  });

  return url;
};

// Function to retrieve the original URL based on the short code
export const getUrlByShortCode = async (shortCode) => {
  logger.info("Retrieving URL by short code", { shortCode });
  // Find the URL entry in the database using the short code
  const url = await Url.findOne({ shortCode });
  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  // Update the clickHistory
  url.clickHistory.push({ timestamp: new Date() });
  // Increment the click count
  url.clicks += 1;
  await url.save();
  logger.info("Updated URL click count and history", {
    shortCode,
    clicks: url.clicks,
    clickHistoryLength: url.clickHistory.length,
  });

  return url;
};

export const findUrlByShortCode = async (shortCode, author) => {
  logger.info("Finding URL by short code for stats", { shortCode });
  const url = await Url.findOne({ shortCode, author }).populate('author');
  if (!url) {
    throw new AppError("Short URL not found", 404);
  }
  logger.info("URL found for stats", {
    shortCode,
    originalUrl: url.originalUrl,
  });
  return url;
};

export const changeUrl = async (newUrl, shortCode, author) => {
  logger.info("Starting URL change process in service", { shortCode, newUrl });

  const url = await findUrlByShortCode(shortCode, author);
  const newParameter = await url.updateOne({ originalUrl: newUrl });

  logger.info("URL changed successfully", {
    shortCode,
    newUrl,
    modifiedCount: updatedUrl.modifiedCount,
  });
  return newParameter;
};
