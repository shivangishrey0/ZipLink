import { generateNanoId } from "../Utils/helper.js";
import { validateUrl } from "../Utils/validateUrl.js";
import { AppError } from "../Utils/errorHandler.js";
import { saveShortUrl } from "../dao/short_url.dao.js";

const MAX_ATTEMPTS = 5;
const DUPLICATE_KEY = 11000;

export const createShortUrlService = async (url) => {
    const validUrl = validateUrl(url);

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const shortUrl = generateNanoId(7);

        try {
            await saveShortUrl({ shortUrl, longUrl: validUrl });
            return shortUrl;
        } catch (error) {
            if (error.code !== DUPLICATE_KEY) {
                throw error;
            }
        }
    }

    throw new AppError("Could not generate a unique short URL. Please try again.", 500);
};
