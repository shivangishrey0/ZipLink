import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/short_url.route.js"; 
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/create", shortUrlRouter);
app.get("/:id", redirectFromShortUrl)


const startServer = async () => {
    await connectDB();

    app.listen(5000, () => {
        console.log("Server is running on http://localhost:5000");
    });
};

startServer();
