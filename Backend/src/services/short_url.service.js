import { generateNanoId } from "../Utils/helper.js";
import { validateUrl } from "../Utils/validateUrl.js";
import { validateSlug } from "../Utils/validateSlug.js";
import { validateDates } from "../Utils/validateDates.js";
import { AppError } from "../Utils/errorHandler.js";
import config from "../config/config.js";
import { saveShortUrl, getShortUrl, incrementClicks, findUrlsByUser, countUrlsByUser, findUrlByIdAndUser, updateUrl, deleteUrlByIdAndUser } from "../dao/short_url.dao.js";

const MAX_ATTEMPTS = 5;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const DUPLICATE_KEY = 11000;

export const createShortUrlService = async ({ url, slug, activeFrom, expiresAt, userId }) => {
    const validUrl = validateUrl(url);
    const dates = validateDates(activeFrom, expiresAt);

    if (slug) {
        validateSlug(slug);

        try {
            await saveShortUrl({ shortUrl: slug, longUrl: validUrl, userId, ...dates });
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
            await saveShortUrl({ shortUrl, longUrl: validUrl, userId, ...dates });
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

const toPublicUrl = (url) => ({
    id: url._id,
    fullUrl: url.full_url,
    shortCode: url.short_url,
    shortUrl: `${config.APP_URL}/${url.short_url}`,
    clicks: url.clicks,
    activeFrom: url.activeFrom ?? null,
    expiresAt: url.expiresAt ?? null,
    createdAt: url.createdAt ?? null,
});

const toPositiveInt = (value, fallback, max = Infinity) => {
    const number = Number.parseInt(value, 10);

    if (!Number.isInteger(number) || number < 1) {
        return fallback;
    }

    return Math.min(number, max);
};

export const getUserUrlsService = async (userId, { page, limit }) => {
    const currentPage = toPositiveInt(page, 1);
    const pageSize = toPositiveInt(limit, DEFAULT_LIMIT, MAX_LIMIT);

    const [urls, total] = await Promise.all([
        findUrlsByUser(userId, (currentPage - 1) * pageSize, pageSize),
        countUrlsByUser(userId),
    ]);

    return {
        urls: urls.map(toPublicUrl),
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
    };
};

export const updateUserUrlService = async (id, userId, { url, activeFrom, expiresAt }) => {
    // The query includes the owner, so someone else's link looks the same as a missing one.
    const link = await findUrlByIdAndUser(id, userId);

    if (!link) {
        throw new AppError("URL not found", 404);
    }

    const changes = {};

    if (url !== undefined) {
        changes.full_url = validateUrl(url);
    }

    // Sending null or an empty value clears a date, leaving it out keeps the old one.
    const dates = validateDates(activeFrom, expiresAt);

    if (activeFrom !== undefined) {
        changes.activeFrom = dates.activeFrom ?? null;
    }

    if (expiresAt !== undefined) {
        changes.expiresAt = dates.expiresAt ?? null;
    }

    if (Object.keys(changes).length === 0) {
        throw new AppError("Nothing to update.", 400);
    }

    const finalActiveFrom = "activeFrom" in changes ? changes.activeFrom : link.activeFrom;
    const finalExpiresAt = "expiresAt" in changes ? changes.expiresAt : link.expiresAt;

    if (finalActiveFrom && finalExpiresAt && finalActiveFrom >= finalExpiresAt) {
        throw new AppError("activeFrom must be before expiresAt.", 400);
    }

    return toPublicUrl(await updateUrl(link, changes));
};

export const deleteUserUrlService = async (id, userId) => {
    const deleted = await deleteUrlByIdAndUser(id, userId);

    if (!deleted) {
        throw new AppError("URL not found", 404);
    }
};
