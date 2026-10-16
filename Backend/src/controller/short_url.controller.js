import { createShortUrlService } from "../services/short_url.service.js";

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