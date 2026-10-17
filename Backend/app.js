import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./src/config/config.js";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/short_url.route.js"; 
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import analyticsRouter from "./src/routes/analytics.route.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/Utils/errorHandler.js";

const app = express();

app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/analytics", analyticsRouter);
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
