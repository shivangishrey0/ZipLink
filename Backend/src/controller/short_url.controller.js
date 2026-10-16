import { nanoid } from "nanoid";
import ShortUrl from "../models/short_url.model.js";

export const createShortUrlController = async (req, res) => {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "A URL is required." });
    }

    try {
        const shortUrl = nanoid(7);
        const newUrl = new ShortUrl({
            full_url: url,
            short_url: shortUrl,
        });

        await newUrl.save();
        return res.status(201).send(shortUrl);
    } catch (error) {
        console.error("Failed to create short URL:", error.message);
        return res.status(500).json({ error: "Failed to create short URL." });
    }
};