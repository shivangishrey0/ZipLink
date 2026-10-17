import { generateNanoId } from "../Utils/helper.js";
import { validateUrl } from "../Utils/validateUrl.js";
import { validateSlug } from "../Utils/validateSlug.js";
import { validateDates } from "../Utils/validateDates.js";
import { AppError } from "../Utils/errorHandler.js";
import argon2 from "argon2";
import config from "../config/config.js";
import { saveClick, deleteClicksByUrl } from "../dao/click.dao.js";
import { saveShortUrl, getShortUrl, getShortUrlWithPassword, incrementClicks, findUrlsByUser, countUrlsByUser, findUrlByIdAndUser, updateUrl, deleteUrlByIdAndUser } from "../dao/short_url.dao.js";

const MAX_ATTEMPTS = 5;
const MIN_LINK_PASSWORD = 4;
const MAX_LINK_PASSWORD = 128;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const DUPLICATE_KEY = 11000;

// No password (undefined, null or empty) means the link is public.
const hashLinkPassword = async (password) => {
    if (password === undefined || password === null || password === "") {
        return undefined;
    }

    if (
        typeof password !== "string" ||
        password.length < MIN_LINK_PASSWORD ||
        password.length > MAX_LINK_PASSWORD
    ) {
        throw new AppError(
            `Link password must be ${MIN_LINK_PASSWORD} to ${MAX_LINK_PASSWORD} characters.`,
            400
        );
    }

    return await argon2.hash(password);
};

export const createShortUrlService = async ({ url, slug, activeFrom, expiresAt, password, userId }) => {
    const validUrl = validateUrl(url);
    const dates = validateDates(activeFrom, expiresAt);
    const hash = await hashLinkPassword(password);

    if (slug) {
        validateSlug(slug);

        try {
            await saveShortUrl({ shortUrl: slug, longUrl: validUrl, userId, password: hash, ...dates });
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
            await saveShortUrl({ shortUrl, longUrl: validUrl, userId, password: hash, ...dates });
            return shortUrl;
        } catch (error) {
            if (error.code !== DUPLICATE_KEY) {
                throw error;
            }
        }
    }

    throw new AppError("Could not generate a unique short URL. Please try again.", 500);
};

const getLinkState = (url) => {
    const now = new Date();

    if (url.activeFrom && url.activeFrom > now) {
        return "not_active";
    }

    if (url.expiresAt && url.expiresAt <= now) {
        return "expired";
    }

    return url.isProtected ? "protected" : "ok";
};

// Analytics must never slow down or break the redirect, so these writes are not awaited.
const recordClick = (url, device) => {
    Promise.all([incrementClicks(url._id), saveClick({ url: url._id, device })]).catch((error) => {
        console.error("Failed to record click:", error.message);
    });
};

export const getLongUrlService = async (code, device) => {
    const url = await getShortUrl(code);

    if (!url) {
        throw new AppError("URL not found", 404);
    }

    const state = getLinkState(url);

    if (state !== "ok") {
        return { state };
    }

    recordClick(url, device);
    return { state, url: url.full_url };
};

export const unlockUrlService = async (code, password, device) => {
    const url = await getShortUrlWithPassword(code);

    if (!url) {
        throw new AppError("URL not found", 404);
    }

    const state = getLinkState(url);

    if (state === "not_active") {
        throw new AppError("This link is not active yet.", 403);
    }

    if (state === "expired") {
        throw new AppError("This link has expired.", 410);
    }

    if (state !== "protected") {
        throw new AppError("This link is not password protected.", 400);
    }

    if (typeof password !== "string" || !(await argon2.verify(url.password, password))) {
        throw new AppError("Incorrect password.", 401);
    }

    recordClick(url, device);
    return url.full_url;
};

export const toPublicUrl = (url) => ({
    id: url._id,
    fullUrl: url.full_url,
    shortCode: url.short_url,
    shortUrl: `${config.APP_URL}/${url.short_url}`,
    clicks: url.clicks,
    activeFrom: url.activeFrom ?? null,
    expiresAt: url.expiresAt ?? null,
    isProtected: url.isProtected ?? false,
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

    await deleteClicksByUrl(deleted._id);
};
