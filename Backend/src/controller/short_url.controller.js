import { createShortUrlService } from "../services/short_url.service.js";
import { getShortUrl } from "../dao/short_url.dao.js";

export const createShortUrlController = async (req, res) => {
    const { url } = req.body;

    try {
        const shortUrl = await createShortUrlService(url);
        return res.status(201).send(process.env.APP_URL + "/" + shortUrl);
    } catch (error) {
        console.error("Failed to create short URL:", error.message);
        return res
            .status(error.statusCode || 500)
            .json({ error: error.statusCode ? error.message : "Failed to create short URL." });
    }
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
