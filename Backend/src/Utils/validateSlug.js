import { AppError } from "./errorHandler.js";

const SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,30}$/;

export const validateSlug = (slug) => {
    if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
        throw new AppError(
            "Custom short URL must be 3 to 30 characters: letters, numbers, - or _.",
            400
        );
    }

    return slug;
};
