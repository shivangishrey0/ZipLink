import { nanoid } from "nanoid";
import ShortUrl from "../models/short_url.model.js";

export const createShortUrlService = async (url) => {
    if (!url || typeof url !== "string") {
        const error = new Error("A URL is required.");
        error.statusCode = 400;
        throw error;
    }

    const shortUrl = nanoid(8);
    const newUrl = new ShortUrl({
        full_url: url,
        short_url: shortUrl,
    });

    await newUrl.save();
    return shortUrl;
};
