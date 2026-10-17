import { generateNanoId } from "../Utils/helper.js";
import { validateUrl } from "../Utils/validateUrl.js";
import { validateSlug } from "../Utils/validateSlug.js";
import { validateDates } from "../Utils/validateDates.js";
import { AppError } from "../Utils/errorHandler.js";
import { saveShortUrl, getShortUrl, incrementClicks } from "../dao/short_url.dao.js";

const MAX_ATTEMPTS = 5;
const DUPLICATE_KEY = 11000;

export const createShortUrlService = async ({ url, slug, activeFrom, expiresAt }) => {
    const validUrl = validateUrl(url);
    const dates = validateDates(activeFrom, expiresAt);

    if (slug) {
        validateSlug(slug);

        try {
            await saveShortUrl({ shortUrl: slug, longUrl: validUrl, ...dates });
            return slug;
        } catch (error) {
            if (error.code === DUPLICATE_KEY) {
                throw new AppError("That short URL is already taken.", 409);
            }
            throw error;
        }
    }

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const shortUrl = generateNanoId(7);

        try {
            await saveShortUrl({ shortUrl, longUrl: validUrl, ...dates });
            return shortUrl;
        } catch (error) {
            if (error.code !== DUPLICATE_KEY) {
                throw error;
            }
        }
    }

    throw new AppError("Could not generate a unique short URL. Please try again.", 500);
};

export const getLongUrlService = async (code) => {
    const url = await getShortUrl(code);

    if (!url) {
        throw new AppError("URL not found", 404);
    }

    const now = new Date();

    if (url.activeFrom && url.activeFrom > now) {
        throw new AppError("This link is not active yet.", 403);
    }

    if (url.expiresAt && url.expiresAt <= now) {
        throw new AppError("This link has expired.", 410);
    }

    await incrementClicks(url._id);
    return url.full_url;
};
