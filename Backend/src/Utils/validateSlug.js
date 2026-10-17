import { AppError } from "./errorHandler.js";

const SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,30}$/;

// These are pages and routes of the app itself. Behind one public address (Nginx) a short link with
// one of these names would be unreachable or would hide the page.
const RESERVED = new Set([
    "api",
    "login",
    "register",
    "urls",
    "analytics",
    "auth",
    "expired",
    "not-active",
    "protected",
    "assets",
]);

export const validateSlug = (slug) => {
    if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
        throw new AppError(
            "Custom short URL must be 3 to 30 characters: letters, numbers, - or _.",
            400
        );
    }

    if (RESERVED.has(slug.toLowerCase())) {
        throw new AppError("That short URL is reserved. Choose another one.", 400);
    }

    return slug;
};
