import { createShortUrlService } from "../services/short_url.service.js";
import { getShortUrl } from "../dao/short_url.dao.js";
import { AppError } from "../Utils/errorHandler.js";
import config from "../config/config.js";

export const createShortUrlController = async (req, res) => {
    const { url, slug } = req.body ?? {};

    const shortUrl = await createShortUrlService({ url, slug });
    return res.status(201).send(config.APP_URL + "/" + shortUrl);
};
export const redirectFromShortUrl = async (req, res) => {
    const { id } = req.params;

    const url = await getShortUrl(id);

    if (!url) {
        throw new AppError("URL not found", 404);
    }

    url.clicks++;
    await url.save();
    return res.redirect(url.full_url);
};
