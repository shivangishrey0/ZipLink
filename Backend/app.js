import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import ShortUrl from "./src/models/short_url.model.js";
import shortUrlRouter from "./src/routes/short_url.route.js"; 

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/create", shortUrlRouter);
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
