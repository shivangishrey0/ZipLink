import express from "express";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/create", (req, res) => {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "A URL is required." });
    }

    console.log(url);
    return res.json({ shortId: nanoid(8) });
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
