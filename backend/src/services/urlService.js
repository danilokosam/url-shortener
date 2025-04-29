import { nanoid } from "nanoid";
import Url from "../models/urlModel.js";
import { AppError } from "../utils/appError.js";

export const createShortUrl = async (originalUrl) => {
  let shortCode = nanoid(8); // Generate a unique short code

  // Check if the short code already exists in the database
  let existingUrl = await Url.findOne({ shortCode });
  while (existingUrl) {
    shortCode = nanoid(8); // Generate a new short code if it already exists
    existingUrl = await Url.findOne({ shortCode });
  }

  // Create and save a new URL entry in the database
  const url = new Url({
    originalUrl,
    shortCode,
  });
  await url.save();

  return url;
};

// Function to retrieve the original URL based on the short code
export const getUrlByShortCode = async (shortCode) => {
  // Find the URL entry in the database using the short code
  const url = await Url.findOne({ shortCode });
  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  // Increment the click count
  url.clicks += 1;
  await url.save();

  return url;
};
