import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import ShortUrl from "./src/models/shorturl.model.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/create", async (req, res) => {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "A URL is required." });
    }

    try {
        const shortUrl = nanoid(7);
        const newUrl = await ShortUrl.create({
            full_url: url,
            short_url: shortUrl,
        });

        return res.status(201).json({
            shortId: newUrl.short_url,
        });
    } catch (error) {
        console.error("Failed to create short URL:", error.message);
        return res.status(500).json({ error: "Failed to create short URL." });
    }
});
app.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const url = await ShortUrl.findOne({ short_url: id });

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
});

const startServer = async () => {
    await connectDB();

    app.listen(5000, () => {
        console.log("Server is running on http://localhost:5000");
    });
};

startServer();
