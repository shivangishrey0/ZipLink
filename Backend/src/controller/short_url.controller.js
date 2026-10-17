import { createShortUrlService } from "../services/short_url.service.js";
import { getShortUrl } from "../dao/short_url.dao.js";
import { AppError } from "../Utils/errorHandler.js";
import config from "../config/config.js";

export const createShortUrlController = async (req, res) => {
    const url = req.body?.url;

    const shortUrl = await createShortUrlService(url);
    return res.status(201).send(config.APP_URL + "/" + shortUrl);
};
export const redirectFromShortUrl = async (req, res) => {
    const { id } = req.params;

    try {
        const url = await getShortUrl(id);

        if (!url) {
            return res.status(404).send("URL not found");
        }

        url.clicks++;
        await url.save();
        return res.redirect(url.full_url);
    } catch (error) {
        console.error("Failed to redirect short URL:", error.message);
        return res.status(500).send("Failed to redirect short URL");
    }
};
