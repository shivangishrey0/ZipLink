import express from "express";
import config from "./src/config/config.js";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/short_url.route.js"; 
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/Utils/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/create", shortUrlRouter);
app.get("/:id", redirectFromShortUrl)

app.use(errorHandler);

const startServer = async () => {
    await connectDB();

    app.listen(config.PORT, () => {
        console.log(`Server is running on http://localhost:${config.PORT}`);
    });
};

startServer();
