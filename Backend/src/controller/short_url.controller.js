import { createShortUrlService, getLongUrlService } from "../services/short_url.service.js";
import config from "../config/config.js";

export const createShortUrlController = async (req, res) => {
    const { url, slug, activeFrom, expiresAt } = req.body ?? {};

    const shortUrl = await createShortUrlService({ url, slug, activeFrom, expiresAt });
    return res.status(201).send(config.APP_URL + "/" + shortUrl);
};
export const redirectFromShortUrl = async (req, res) => {
    const { id } = req.params;

    const longUrl = await getLongUrlService(id);
    return res.redirect(302, longUrl);
};
