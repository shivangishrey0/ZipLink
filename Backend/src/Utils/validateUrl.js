import { AppError } from "./errorHandler.js";

export const validateUrl = (url) => {
    if (!url || typeof url !== "string") {
        throw new AppError("A URL is required.", 400);
    }

    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        throw new AppError("Enter a valid URL, including http:// or https://.", 400);
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new AppError("Only http and https URLs are allowed.", 400);
    }

    return parsed.href;
};
